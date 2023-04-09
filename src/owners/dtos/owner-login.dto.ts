import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { OwnerEntity } from '../../common/entities/owners.entity';

export class OwnerLoginDTO extends PickType(OwnerEntity, [
  'username',
] as const) {
  @ApiProperty({
    example: '123123',
    description: '점주 비밀번호',
  })
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 작성해주세요.' })
  password: string;
}
