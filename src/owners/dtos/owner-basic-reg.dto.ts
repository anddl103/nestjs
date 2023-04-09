import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OwnerBasicRegisterDTO {
  @ApiProperty({
    example: 'manager1@foodnet24.com',
    description: 'CMS 아이디(이메일)',
  })
  @IsEmail({}, { message: '올바른 이메일을 작성해주세요.' })
  @IsNotEmpty({ message: '이메일을 작성해주세요.' })
  username: string;

  @ApiProperty({
    example: '123123',
    description: 'CMS 운영자 비밀번호',
  })
  @MinLength(6)
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 작성해주세요.' })
  password: string;
}
