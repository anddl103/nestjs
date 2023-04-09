import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TestMailFormDTO {
  @ApiProperty({
    example: 'kimwon@foodnet24.com',
    description: '수신 메일',
  })
  @IsEmail({}, { message: '올바른 이메일을 작성해주세요.' })
  @IsNotEmpty({ message: '이메일( toAddress )을 작성해주세요.' })
  toAddress: string;

  @ApiProperty({
    example: '동네가게 안내',
    description: '이메일 제목',
  })
  @IsString()
  @IsNotEmpty({ message: '제목( subject )를 작성해주세요.' })
  subject: string;

  @ApiProperty({
    example: '동네가게 안내 본문입니다.',
    description: '이메일 본문',
  })
  @IsString()
  @IsNotEmpty({ message: '본문( message )를 작성해주세요.' })
  message: string;
}
