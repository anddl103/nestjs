import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserEntity } from '../../common/entities/users.entity';

export class UserRegisterDTO extends PickType(UserEntity, [
  'username',
  'fullName',
  'phoneNumber',
  'signupType',
  'level',
  'rank',
] as const) {
  @ApiProperty({
    example: '123123',
    description: '사용자 비밀번호',
  })
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 작성해주세요.' })
  password: string;
}
