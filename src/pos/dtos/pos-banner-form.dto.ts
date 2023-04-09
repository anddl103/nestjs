import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class PosBannerFormDTO {
  @ApiProperty({
    example:
      'https://d1jwjxg29cufk5.cloudfront.net/stores/pasta-salad-1967501_640.jpg',
    description: '배너 URL',
    required: true,
  })
  @IsNotEmpty({ message: '배너 URL( bannerUrl )을 입력해주세요.' })
  bannerUrl: string;

  @ApiProperty({
    example: 'http://foodnet24.com',
    description: '배너 클릭시 이동할 페이지 URL',
    required: true,
  })
  @IsNotEmpty({
    message: '배너 클릭시 이동할 페이지 URL( href )을 입력해주세요.',
  })
  href: string;
}
