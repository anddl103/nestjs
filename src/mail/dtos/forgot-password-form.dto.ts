import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordFormDTO {
  @ApiProperty({
    example: 'kimwon@foodnet24.com',
    description: '수신 메일',
  })
  @IsEmail({}, { message: '올바른 이메일을 작성해주세요.' })
  @IsNotEmpty({ message: '이메일( toAddress )을 작성해주세요.' })
  toAddress: string;

  @ApiProperty({
    example: '임시 비밀번호가 발급되었습니다.',
    description: '이메일 제목',
  })
  @IsString()
  @IsNotEmpty({ message: '제목( subject )를 작성해주세요.' })
  subject: string;

  @ApiProperty({
    example: 'kimwon@foodnet24.com',
    description: '아이디',
  })
  @IsString()
  @IsNotEmpty({ message: '아이디( username )를 작성해주세요.' })
  username: string;

  @ApiProperty({
    example: '김동네',
    description: '이름(닉네임)',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'abcdefg',
    description: '임시비밀번호',
  })
  @IsString()
  @IsNotEmpty({ message: '임시비밀번호( tempPassword )를 작성해주세요.' })
  tempPassword: string;
}
