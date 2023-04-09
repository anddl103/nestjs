import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OwnerPasswordChangeDTO {
  @ApiProperty({
    example: '123123',
    description: '현재 비밀번호',
  })
  @IsString()
  @MinLength(6, { message: '현재 비밀번호는 6글자 이상 입력해주세요.' })
  @IsNotEmpty({ message: '현재 비밀번호를 입력해주세요.' })
  currentPassword: string;

  @ApiProperty({
    example: '123456',
    description: '변경 비밀번호',
  })
  @IsString()
  @MinLength(6, { message: '새 비밀번호는 6글자 이상 입력해주세요.' })
  @IsNotEmpty({ message: '새 비밀번호를 입력해주세요.' })
  newPassword: string;
}
