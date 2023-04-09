import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserLevel } from '../../common/enums/user-level';
import { UserRank } from '../../common/enums/user-rank';

export class UserEditDTO {
  @ApiProperty({
    example: '회원 관련 내용을 기록하세요.',
    description: '메모',
  })
  @IsOptional()
  @IsString()
  memo: string;

  @ApiProperty({
    enum: [UserLevel.C1, UserLevel.C2, UserLevel.C3],
    example: UserLevel.C1,
    description: '회원레벨(C1_일반회원-1|C2_바우처회원-2|C3_기부회원-3)',
  })
  @IsEnum(UserLevel)
  level: UserLevel;

  @ApiProperty({
    enum: UserRank,
    example: UserRank.Rookie,
    description:
      '회원등급(새내기-rookie|주민-local|이웃-neighbor|단골-regular)',
  })
  @IsEnum(UserRank)
  rank: UserRank;
}
