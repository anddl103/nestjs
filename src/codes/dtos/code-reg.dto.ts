import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CodeRegisterDTO {
  @ApiProperty({
    example: 12,
    description: '부모 가게 아이디',
  })
  @IsOptional()
  @IsNumber()
  parentId: number;
  @ApiProperty({
    example: 'target',
    description: '적용대상',
  })
  @IsString()
  ref: string;
  @ApiProperty({
    example: 0,
    description: '(0 : 코드 종류, 1 대분류 : 2 중분류 3: 소분류 ...)',
  })
  @IsNumber()
  depth: number;
  @ApiProperty({
    example: 'rank',
    description: 'rank',
  })
  @IsString()
  name: string;
  @ApiProperty({
    example: '적용대상',
    description: '적용대상',
  })
  @IsString()
  description: string;
  @ApiProperty({
    example: 1,
    description: '순서',
  })
  @IsNumber()
  position: number;
}
