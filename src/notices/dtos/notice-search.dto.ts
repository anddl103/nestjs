import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { NoticeType } from '../../common/enums/notice-type';
import { CommonSearchRequestDTO } from '../../common/dtos/common.search.req.dto';

export class NoticeSearchDTO extends CommonSearchRequestDTO {
  @ApiProperty({
    example: '',
    description: '공지사항 검색어 입력',
    required: false,
  })
  @IsOptional()
  @IsString()
  keyword: string;

  @ApiProperty({
    enum: [NoticeType.User, NoticeType.Owner],
    example: NoticeType.User,
    description: '공지사항 분류(고객: user, 점주: owner)',
    required: true,
  })
  @IsEnum(NoticeType)
  type: NoticeType;
}
