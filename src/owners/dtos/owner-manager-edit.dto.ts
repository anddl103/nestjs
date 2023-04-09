import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OwnerRole } from '../../common/enums/owner-role';

export class OwnerManagerEditDTO {
  @ApiProperty({
    example: '김운영',
    description: '이름',
  })
  @IsOptional()
  fullName: string;

  @ApiProperty({
    enum: [
      OwnerRole.Admin,
      OwnerRole.Manager,
      OwnerRole.CS,
      OwnerRole.Operator,
      OwnerRole.Sales,
    ],
    example: OwnerRole.Manager,
    description: '등급(role 아이디)',
  })
  @IsEnum(OwnerRole)
  roleId: OwnerRole;

  @ApiProperty({
    example: '개발파트',
    description: '소속',
  })
  @IsOptional()
  department: string;

  @ApiProperty({
    example: '010-1234-1234',
    description: '연락처',
  })
  @IsOptional()
  phoneNumber: string;
}
