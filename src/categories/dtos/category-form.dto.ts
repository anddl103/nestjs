import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CategoryFormDTO {
  @ApiProperty({
    example: '한식',
    description: '카테고리명',
    required: true,
  })
  @MinLength(1, { message: '카테고리명은 1글자 이상 입력해주십시오.' })
  @MaxLength(10, { message: '카테고리명은 10글자 이하로 입력해주십시오.' })
  @IsNotEmpty({
    message: '카테고리명(name)를 입력해주십시오.',
  })
  name: string;
}
