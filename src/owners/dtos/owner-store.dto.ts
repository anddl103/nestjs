import { ApiProperty } from '@nestjs/swagger';
import { OwnerStatus } from 'src/common/enums/owner-status';

export class OwnerStoreDTO {
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
}
