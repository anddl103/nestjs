import { ApiProperty } from '@nestjs/swagger';

export class PushSendResponseDTO {
  @ApiProperty({
    example: '0',
    description: '실패 수',
  })
  failureCount: number;

  @ApiProperty({
    example: '3',
    description: '성공 수',
  })
  successCount: number;
}
