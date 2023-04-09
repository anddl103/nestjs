import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class StoreStopHourEditDTO {
  @ApiProperty({
    example: true,
    description: '영업 임시중지(시작-true, 해제-false)',
  })
  @IsBoolean()
  isStop: boolean;

  @ApiProperty({
    example: true,
    description: '시간 설정 안함(설정안함-true, 설정함-false)',
  })
  @IsBoolean()
  isNotSettings: boolean;

  @ApiProperty({
    example: '가게사정',
    description: '가게사정|재료소진|직접입력...',
  })
  @IsNotEmpty({ message: '가게사정( message )을 입력해주세요.' })
  @IsString()
  message: string;

  @ApiProperty({
    example: 15,
    description: '시작시간(시)',
  })
  @IsInt()
  @Min(0)
  @Max(23)
  startHour: number;

  @ApiProperty({
    example: 0,
    description: '시작시간(분)',
  })
  @IsInt()
  @Min(0)
  @Max(59)
  startMin: number;

  @ApiProperty({
    example: 17,
    description: '종료시간(시)',
  })
  @IsInt()
  @Min(0)
  @Max(23)
  endHour: number;

  @ApiProperty({
    example: 0,
    description: '종료시간(분)',
  })
  @IsInt()
  @Min(0)
  @Max(59)
  endMin: number;
}
