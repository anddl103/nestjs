import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize } from 'class-validator';
import { PushSendNotificationDTO } from './push-send-notification.dto';

export class PushSendUserRequestDTO {
  @ApiProperty({
    example: 20,
    description: '유저 아이디',
  })
  @ArrayMinSize(1)
  userIds: number[];

  @ApiProperty({
    type: PushSendNotificationDTO,
  })
  notification: PushSendNotificationDTO;
}
