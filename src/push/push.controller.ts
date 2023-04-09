import { PushSendRequestDTO } from './dtos/push-send.req.dto';
import { PushSendResponseDTO } from './dtos/push-send.res.dto';
import { PushService } from './push.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommonResponseDTO } from 'src/common/dtos/common.res.dto';
import { PushIdtokenDTO } from './dtos/push-idtoken.dto';
import { PushSendUserRequestDTO } from './dtos/push-send-user.req.dto';

@ApiTags('push')
@Controller('/api/v1/push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('send')
  @ApiOperation({ summary: 'SNS PUSH 발송' })
  @ApiResponse({
    type: PushSendResponseDTO,
    description: 'success',
    status: 200,
  })
  async pushSendQueue(@Body() pushSendRequestDTO: PushSendRequestDTO) {
    await this.pushService.pushSendQueue(pushSendRequestDTO);
    return new CommonResponseDTO('push queue 추가', {}, {});
  }

  @Post('send/user')
  @ApiOperation({ summary: '사용자 doken 정보를 이용해 SNS PUSH 발송' })
  @ApiResponse({
    description: 'success',
    status: 200,
  })
  async pushSendQueueUser(
    @Body() pushSendUserRequestDTO: PushSendUserRequestDTO,
  ) {
    await this.pushService.pushSendQueueUser(pushSendUserRequestDTO);
    return new CommonResponseDTO('push queue 추가', {}, {});
  }

  // @Post('verify/idToken')
  // @ApiOperation({ summary: '토큰 검증' })
  // async pushVerifyIdToken(@Body() pushIdtokenDTO: PushIdtokenDTO) {
  //   const { idToken } = pushIdtokenDTO;
  //   await this.pushService.verifyIdToken(idToken);

  //   return new CommonResponseDTO('토큰 검증 성공', {}, {});
  // }
}
