import { PushSendQueueEntity } from 'src/common/entities/push-send_queue.entity';
import { PushHistoryEntity } from './../common/entities/push-history.entity';
import { PushSendResponseDTO } from './../push/dtos/push-send.res.dto';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';
import { FcmOptions } from './interfaces/fcm-options.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, getManager, Repository } from 'typeorm';
import { PushSendNotificationDTO } from 'src/push/dtos/push-send-notification.dto';
import { UserDeviceEntity } from 'src/common/entities/user-device.entity';

@Injectable()
export class FcmService {
  private readonly TOKEN_NOT_REGISTERED =
    'messaging/registration-token-not-registered';

  constructor(
    @Inject('FcmOptions') private fcmOptionsProvider: FcmOptions,
    @InjectRepository(PushHistoryEntity)
    private readonly pushHistoryRepository: Repository<PushHistoryEntity>,
    private readonly logger: Logger,
  ) {
    if (firebaseAdmin.apps.length === 0) {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(
          this.fcmOptionsProvider.firebaseSpecsPath,
        ),
      });
    }
  }

  async sendNotification(
    deviceIds: Array<string>,
    payload: PushSendNotificationDTO,
  ): Promise<PushSendResponseDTO> {
    if (deviceIds.length == 0) {
      throw new Error('You provide an empty device ids list!');
    }
    const pushSendResponse = new PushSendResponseDTO();

    try {
      const message = {
        data: { score: '850', time: '2:45' },
        notification: payload,
        tokens: deviceIds,
      };

      await firebaseAdmin
        .messaging()
        .sendMulticast(message)
        .then((response) => {
          pushSendResponse.failureCount = response.failureCount;
          pushSendResponse.successCount = response.successCount;

          response.responses.forEach(async (resp, idx) => {
            console.log('token:', deviceIds[idx]);
            const deviceToken = deviceIds[idx];
            const isSucceed = resp.success;
            let failureCode = null;
            let failureMessage = null;

            await getManager().transaction(
              async (transactionalEntityManager) => {
                // 실패
                if (!resp.success) {
                  failureCode = resp.error.code;
                  failureMessage = resp.error.message;

                  if (failureCode == this.TOKEN_NOT_REGISTERED)
                    await transactionalEntityManager
                      .createQueryBuilder()
                      .update(UserDeviceEntity)
                      .softDelete()
                      .where('user_device.device_token = :idToken', {
                        idToken: deviceToken,
                      })
                      .execute();
                  // 실패 시 토큰 삭제 로직 추가
                }

                await transactionalEntityManager
                  .getRepository(PushHistoryEntity)
                  .save({
                    deviceToken,
                    title: payload.title,
                    body: payload.body,
                    imageUrl: payload.imageUrl,
                    isSucceed,
                    failureCode,
                    failureMessage,
                  });

                // 발송 실패 시 retry 추가
                // 발송된 id 삭제하기
                await transactionalEntityManager
                  .getRepository(PushSendQueueEntity)
                  .delete({ deviceToken });
              },
            );
          });
        });
    } catch (error) {
      this.logger.error(error.message, error.stackTrace, 'nestjs-fcm');
      throw error;
    }

    return pushSendResponse;
  }

  async verifyIdToken(idToken: string) {
    const decodedToken = await firebaseAdmin
      .auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        return decodedToken;
      })
      .catch((error) => {
        throw new NotFoundException(
          `유요하지 않은 토큰입니다, error: ${error}`,
        );
      });

    return decodedToken;
  }

  async removeDeviceToken(idToken: string) {
    try {
      await getConnection()
        .createQueryBuilder()
        .update(UserDeviceEntity)
        .softDelete()
        .where('user_device.device_token = :idToken', {
          idToken,
        })
        .execute();
    } catch (error) {
      throw new NotFoundException(`유요하지 않은 토큰입니다, error: ${error}`);
    }
  }
}
