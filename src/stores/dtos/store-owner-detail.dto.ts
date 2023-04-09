import { ApiProperty, PickType } from '@nestjs/swagger';
import { StoreEntity } from '../../common/entities/stores.entity';
import { OwnerDetailDTO } from '../../owners/dtos/owner-detail.dto';

export class StoreOwnerDetailDTO extends PickType(StoreEntity, [
  'id',
  'createdAt',
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
  'cookingTime',
  'relayTo',
  'latitude',
  'longitude',
  'relayTo',
] as const) {
  @ApiProperty({
    example: [
      {
        categoryId: 5,
        category: {
          name: '치킨',
        },
      },
      {
        categoryId: 6,
        category: {
          name: '야식',
        },
      },
      {
        categoryId: 7,
        category: {
          name: '패스트푸드',
        },
      },
    ],
    description: '업종(카테고리) 리스트',
  })
  categoryStores: object[];

  @ApiProperty({
    example: [
      {
        imageFileId: 1,
        imageFile: {
          url: 'https://d1jwjxg29cufk5.cloudfront.net/stores/pasta-salad-1967501_640.jpg',
        },
      },
      {
        imageFileId: 2,
        imageFile: {
          url: 'https://d1jwjxg29cufk5.cloudfront.net/stores/sushi-3367640_640.jpg',
        },
      },
      {
        imageFileId: 3,
        imageFile: {
          url: 'https://d1jwjxg29cufk5.cloudfront.net/stores/burger-3962996_640.jpg',
        },
      },
      {
        imageFileId: 4,
        imageFile: {
          url: 'https://d1jwjxg29cufk5.cloudfront.net/stores/charcoal-grilled-meat-6464948_640.jpg',
        },
      },
      {
        imageFileId: 5,
        imageFile: {
          url: 'https://d1jwjxg29cufk5.cloudfront.net/stores/jajang-2545938_640.jpg',
        },
      },
    ],
    description: '가게사진 리스트',
  })
  storeImages: object[];

  @ApiProperty({
    example: {
      id: 14,
      username: 'store12@test.com',
      fullName: '오사장',
      phoneNumber: '010-1111-3333',
      businessName: '바른치킨공덕파크자이점',
      businessNumber: '123-12-12345',
      ownerImages: [
        {
          imageFileId: 7,
          imageFile: {
            url: 'https://d1jwjxg29cufk5.cloudfront.net/stores/ttukbaegi-2517765_640.jpg',
          },
        },
        {
          imageFileId: 6,
          imageFile: {
            url: 'https://d1jwjxg29cufk5.cloudfront.net/stores/jambong-6004032_640.jpg',
          },
        },
        {
          imageFileId: 5,
          imageFile: {
            url: 'https://d1jwjxg29cufk5.cloudfront.net/stores/jajang-2545938_640.jpg',
          },
        },
      ],
    },
    description: '점주 정보',
  })
  owner: OwnerDetailDTO;
}
