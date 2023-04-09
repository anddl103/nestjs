import { ApiProperty } from '@nestjs/swagger';

export class OwnerRegisterResponseDTO {
  @ApiProperty({
    example: 1,
    description: '내부 아이디',
  })
  id: number;

  @ApiProperty({
    example: 'kimwon@foodnet24.com',
    description: 'CMS 회원 아이디(이메일)',
  })
  username: string;

  @ApiProperty({
    example: 3,
    description: '역할 아이디',
  })
  roleId: number;
}
