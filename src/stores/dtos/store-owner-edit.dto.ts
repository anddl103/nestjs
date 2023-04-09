import { ArrayMaxSize, ArrayMinSize, IsArray } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { StoreEntity } from '../../common/entities/stores.entity';
import { OwnerEditDTO } from '../../owners/dtos/owner-edit.dto';

export class StoreOwnerEditDTO extends PickType(StoreEntity, [
  'name',
  'address1',
  'address2',
  'phoneNumber',
  'minOrderPrice',
  'deliveryPrice',
  'deliveryArea',
  'origin',
  'hygiene',
  'instruction',
  'intro',
  'relayTo',
  'cookingTime',
  'latitude',
  'longitude',
] as const) {
  @ApiProperty({
    example: {
      fullName: '오사장',
      businessName: '바른치킨공덕파크자이점',
      businessNumber: '123-12-12345',
    },
    description: '점주 수정 항목',
  })
  owner: OwnerEditDTO;

  @ApiProperty({
    example: [5, 6, 7],
    description: '업종(카테고리) 아이디 리스트(1개 이상)',
  })
  @IsArray()
  @ArrayMinSize(1, { message: '업종을 선택해주세요.' })
  categoryIds: number[];

  @ApiProperty({
    example: [1, 2, 3, 4, 5],
    description: '이미지파일 아이디 리스트(1-5개)',
  })
  @IsArray()
  @ArrayMinSize(1, { message: '가게 이미지를 첨부해주세요.' })
  @ArrayMaxSize(5)
  imageFileIds: number[];

  @ApiProperty({
    example: [1, 2],
    description: '1 : 결제완료, 2 : 만나서 결제',
  })
  @IsArray()
  @ArrayMinSize(1, { message: '결제 방법을 선택해 주세요.' })
  @ArrayMaxSize(2)
  payTypes: number[];
}
