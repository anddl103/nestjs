import { ParseIntPipe, Query } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString, IsOptional } from 'class-validator';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

export abstract class CommonSearchRequestDTO {
  @ApiProperty({
    example: 1,
    description: '페이지 번호',
  })
  @IsOptional()
  @IsNumberString()
  page: number | 1;

  @ApiProperty({
    example: 20,
    description: '페이지 목록의 개수',
  })
  @IsOptional()
  @IsNumberString()
  limit: number | 20;

  public getIPaginationOptions(): IPaginationOptions {
    return { page: this.page, limit: this.limit };
  }
}
