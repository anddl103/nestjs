import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OwnerStoreRegisterDTO {
  @ApiProperty({
    example: 'store1@test.com',
    description: 'CMS 점주 아이디(이메일)',
  })
  @IsEmail({}, { message: '올바른 이메일을 작성해주세요.' })
  @IsNotEmpty({ message: '이메일을 작성해주세요.' })
  username: string;

  @ApiProperty({
    example: '123123',
    description: 'CMS 점주 비밀번호',
  })
  @MinLength(6)
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 작성해주세요.' })
  password: string;

  @ApiProperty({
    example: '010-1234-1234',
    description: 'CMS 점주 핸드폰 번호',
  })
  @IsString()
  @IsNotEmpty({ message: '핸드폰 번호를 작성해주세요.' })
  phoneNumber: string;

  @ApiProperty({
    example: 'imp_123456789',
    description: '아임포트 인증번호',
  })
  @IsNotEmpty({ message: '아임포트 인증번호를 작성해주세요.' })
  impUid: string;

  @ApiProperty({
    example: false,
    description: 'CMS 점주 동네가게 혜택 알림(선택)',
  })
  @IsBoolean()
  isBenefitNoti: boolean;

  @ApiProperty({
    example: [1, 2, 3, 4],
    description: '이미지파일 아이디 리스트(1-4개)',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  imageFileIds: number[];
}
