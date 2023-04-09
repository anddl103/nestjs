import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayMinSize } from 'class-validator';
import { NotificationMessagePayload } from 'firebase-admin/lib/messaging/messaging-api';
import { PushSendNotificationDTO } from './push-send-notification.dto';

export class PushSendRequestDTO {
  @ApiProperty({
    example: ['l5UO1zLfja5Bffx'],
    description: '토큰',
  })
  @IsArray()
  @ArrayMinSize(1)
  idToken: string[];

  @ApiProperty({
    type: PushSendNotificationDTO,
  })
  notification: PushSendNotificationDTO;
}
