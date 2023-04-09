import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, Matches } from 'class-validator';

export class SettlementDateFormDTO {
  @ApiProperty({
    example: [1, 2],
    description: '정산합계 아이디 리스트',
    required: true,
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'id 는 최소 1개 이상 선택해 주세요.' })
  ids: number[];

  @ApiProperty({
    example: '2022-08-12',
    description: '정산예정일',
    required: true,
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'yyyy-MM-dd 으로 입력해주십시오.',
  })
  @IsNotEmpty({
    message: '정산예정일(expectedDate)를 입력해주십시오.',
  })
  expectedDate: string;
}
