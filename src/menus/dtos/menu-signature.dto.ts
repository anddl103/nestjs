import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsNotEmpty, IsPositive } from 'class-validator';

export class MenuSignatureDTO {
  @ApiProperty({
    example: 12,
    description:
      '가게 리스트에서 원하는 가게의 id 를 입력<br>점주의 경우 auth/me > storeId 를 입력',
    required: true,
  })
  @IsNotEmpty({ message: '가게 아이디( storeId )를 입력해주세요.' })
  @IsPositive()
  storeId: number;

  @ApiProperty({
    example: [1, 2],
    description: '대표메뉴 메뉴아이디 리스트( 0 ~ 5개 )',
    required: true,
  })
  @IsArray()
  @ArrayMaxSize(5)
  menuIds: number[];
}
