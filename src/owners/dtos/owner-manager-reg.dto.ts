import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OwnerRole } from '../../common/enums/owner-role';

export class OwnerManagerRegisterDTO {
  @ApiProperty({
    example: 'manager1@foodnet24.com',
    description: 'CMS 운영자 아이디(이메일)',
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

  @ApiProperty({
    example: '김운영',
    description: '이름',
  })
  @IsOptional()
  fullName: string;

  @ApiProperty({
    enum: [
      OwnerRole.Admin,
      OwnerRole.Manager,
      OwnerRole.CS,
      OwnerRole.Operator,
      OwnerRole.Sales,
    ],
    example: OwnerRole.Manager,
    description: '등급(role 아이디)',
  })
  @IsEnum(OwnerRole)
  roleId: OwnerRole;

  @ApiProperty({
    example: '개발파트',
    description: '소속',
  })
  @IsOptional()
  department: string;

  @ApiProperty({
    example: '010-1234-1234',
    description: '연락처',
  })
  @IsOptional()
  phoneNumber: string;
}
