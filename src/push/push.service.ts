import { Injectable, NotFoundException } from '@nestjs/common';
import { FcmService } from 'src/fcm/fcm.service';
import { PushSendResponseDTO } from './dtos/push-send.res.dto';
import { PushSendRequestDTO } from './dtos/push-send.req.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PushSendQueueEntity } from 'src/common/entities/push-send_queue.entity';
import { In, Repository } from 'typeorm';
import { PushSendUserRequestDTO } from './dtos/push-send-user.req.dto';
import { UserDeviceEntity } from 'src/common/entities/user-device.entity';

@Injectable()
export class PushService {
  constructor(
    private readonly fcmService: FcmService,
    @InjectRepository(PushSendQueueEntity)
    private readonly pushSendQueueRepository: Repository<PushSendQueueEntity>,
    @InjectRepository(UserDeviceEntity)
    private readonly userDeviceRepository: Repository<UserDeviceEntity>,
  ) {}

  /**
   * 발송 테스트
   * @param pushSendRequestDTO
   * @returns
   */
  async doStuff(
    pushSendRequestDTO: PushSendRequestDTO,
  ): Promise<PushSendResponseDTO> {
    const { idToken, notification } = pushSendRequestDTO;
    return await this.fcmService.sendNotification(idToken, notification);
  }

  /**
   * 발송 큐에 직접 등록
   * @param pushSendRequestDTO
   */
  async pushSendQueue(pushSendRequestDTO: PushSendRequestDTO): Promise<void> {
    const { idToken, notification } = pushSendRequestDTO;
    idToken.forEach((val) => {
      this.pushSendQueueRepository.save({
        deviceToken: val,
        title: notification.title,
        body: notification.body,
        imageUrl: notification.imageUrl,
        retryCount: 0,
        status: 'ready',
      });
    });
  }

  /**
   * 유저 정보에서 발송 큐 등록
   * @param pushSendRequestDTO
   */
  async pushSendQueueUser(pushSendUserRequestDTO: PushSendUserRequestDTO) {
    const { userIds, notification } = pushSendUserRequestDTO;

    if (userIds.length == 0) {
      throw new NotFoundException('You provide an empty user ids list!');
    }

    const pushSendRequestDTO = new PushSendRequestDTO();
    pushSendRequestDTO.notification = notification;

    const deviceList = await this.userDeviceRepository.find({
      where: { userId: In(userIds) },
    });

    console.log(deviceList);
    const idToken = [];
    for (const val of deviceList) {
      if (val.deviceToken) idToken.push(val.deviceToken);
    }

    if (idToken.length == 0) {
      throw new NotFoundException('You provide an empty deviceToken!');
    }
    pushSendRequestDTO.idToken = idToken;
    this.pushSendQueue(pushSendRequestDTO);
  }

  async verifyIdToken(idToken: string) {
    return await this.fcmService.verifyIdToken(idToken);
  }
}
