import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EncryptPhoneDTO {
  @ApiProperty({
    example: '010-1234-1234',
    description: '핸드폰 번호',
  })
  @IsNotEmpty({ message: '핸드폰 번호를 작성해주세요.' })
  phone: string;
}
