import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsPositive } from 'class-validator';

export class MenuGroupPositionDTO {
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
    description: '노출순서 메뉴그룹아이디 리스트',
    required: true,
  })
  @IsArray()
  menuGroupIds: number[];
}
