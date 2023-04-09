import { ApiProperty } from '@nestjs/swagger';
import { UserLevel } from '../../common/enums/user-level';
import { UserRank } from '../../common/enums/user-rank';

export class UserAddressDetailDTO {
  @ApiProperty({
    example: 1,
    description: '회원 내부 아이디',
  })
  id: number;

  @ApiProperty({
    example: 'user1@test.com',
    description: '일반회원 아이디(이메일)',
  })
  username: string;

  @ApiProperty({
    example: '김푸드',
    description: '이름',
  })
  fullName: string;

  @ApiProperty({
    example: '010-1234-1234',
    description: '연락처',
  })
  phoneNumber: string;

  @ApiProperty({
    enum: UserLevel,
    example: '1',
    description: '회원레벨(일반회원_C1-1|바우처회원_C2-2|C3_기부회원-3)',
  })
  level: UserLevel;

  @ApiProperty({
    enum: UserRank,
    example: 'rookie',
    description:
      '회원등급(새내기-rookie|주민-local|이웃-neighbor|단골-regular)',
  })
  rank: UserRank;

  @ApiProperty({
    example: '회원 관련 내용을 기록하세요.',
    description: '회원 메모',
  })
  memo: string;

  @ApiProperty({
    example: '2022-03-05 04:51:30.962560',
    description: '가입 일자',
  })
  createdAt: Date;

  @ApiProperty({
    example: [
      {
        id: 1,
        area: '우리집',
        type: 'road',
        name: '엘리스리틀이태리공덕',
        address1: '서울 마포구 공덕동 476',
        address2: '3층 302호',
      },
    ],
    description: '주소 리스트',
  })
  userAddresses: object[];
}
