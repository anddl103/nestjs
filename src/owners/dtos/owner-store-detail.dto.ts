import { ApiProperty } from '@nestjs/swagger';
import { OwnerStatus } from 'src/common/enums/owner-status';

export class OwnerStoreDetailDTO {
  @ApiProperty({
    example: 1,
    description: '회원 내부 아이디',
  })
  id: number;

  @ApiProperty({
    example: 'store1@test.com',
    description: '점주 아이디(이메일)',
  })
  username: string;

  @ApiProperty({
    example: '김점주',
    description: '이름',
  })
  fullName: string;

  @ApiProperty({
    example: '010-1234-1234',
    description: '연락처',
  })
  phoneNumber: string;

  @ApiProperty({
    example: '회원 관련 내용을 기록하세요.',
    description: '회원 메모',
  })
  memo: string;

  @ApiProperty({
    enum: OwnerStatus,
    example: 'request',
    description: '상태(요청-request|승인-confirm|반려-reject)',
  })
  status: OwnerStatus;

  @ApiProperty({
    example: '2022-03-05 04:51:30.962560',
    description: '가입 일자',
  })
  createdAt: Date;

  @ApiProperty({
    example: [
      {
        id: 1,
        category: '양식',
        name: '엘리스리틀이태리공덕',
        address1: '서울 마포구 공덕동 476',
        address2: '1층 102호',
      },
    ],
    description: '가게 리스트',
  })
  stores: object[];

  @ApiProperty({
    example: [
      {
        imageFileId: 19,
        imageFile: {
          url: 'https://d1jwjxg29cufk5.cloudfront.net/test/won/9acdaa77-2e25-4018-bbbf-2abe492d2719.jpg',
        },
      },
      {
        imageFileId: 18,
        imageFile: {
          url: 'https://d1jwjxg29cufk5.cloudfront.net/test/won/c49aa61f-5dac-4aaa-87e9-991413c16ed7.jpg',
        },
      },
      {
        imageFileId: 17,
        imageFile: {
          url: 'https://d1jwjxg29cufk5.cloudfront.net/test/won/c27aacdc-6197-474e-8020-d17ef1792e32.jpg',
        },
      },
      {
        imageFileId: 16,
        imageFile: {
          url: 'https://d1jwjxg29cufk5.cloudfront.net/test/won/c27aacdc-6197-474e-8020-d17ef1792e32.jpg',
        },
      },
    ],
    description:
      '인증사진 리스트(사업자 등록증, 가게 외부 사진, 가게 내부 사진, 통장 사본)',
  })
  ownerImages: object[];
}
