import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterResponseDTO {
  @ApiProperty({
    example: 1,
    description: '내부 아이디',
  })
  id: number;

  @ApiProperty({
    example: 'kimwon@foodnet24.com',
    description: '사용자 아이디(이메일)',
  })
  username: string;

  @ApiProperty({
    example: '김푸드',
    description: '이름',
  })
  fullName: string;

  @ApiProperty({
    example: '2021-12-06T08:29:41.334Z',
    description: '가입일자',
  })
  createdAt: Date;
}
