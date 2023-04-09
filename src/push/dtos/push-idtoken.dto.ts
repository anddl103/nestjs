import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PushIdtokenDTO {
  @ApiProperty({
    example: 'l5UO1zLfja5Bffx',
    description: '토큰',
  })
  @IsString()
  @IsNotEmpty({ message: '토큰을 입력해주세요.' })
  idToken: string;
}
