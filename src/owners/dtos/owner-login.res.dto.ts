import { ApiProperty } from '@nestjs/swagger';

export class OwnerLoginResDTO {
  @ApiProperty({
    example: 'aaa.bbb.ccc',
    description: 'JWT Access Token',
  })
  accessToken: string;
}
