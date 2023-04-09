import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OwnerUsernameDTO {
  @ApiProperty({
    example: 'store1@test.com',
    description: 'CMS 아이디(이메일)',
  })
  @IsEmail({}, { message: '올바른 이메일을 작성해주세요.' })
  @IsNotEmpty({ message: '이메일을 작성해주세요.' })
  username: string;
}
