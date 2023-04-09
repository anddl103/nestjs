import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity({
  name: 'pos_banner',
})
export class PosBannerEntity extends CommonEntity {
  @ApiProperty({
    example: 1,
    description: '작성자(운영자) 아이디',
  })
  @Column({ type: 'int', nullable: false })
  ownerId: number;

  @ApiProperty({
    example:
      'https://d1jwjxg29cufk5.cloudfront.net/stores/pasta-salad-1967501_640.jpg',
    description: '배너 URL',
  })
  @Column({ type: 'varchar', nullable: true })
  bannerUrl: string;

  @ApiProperty({
    example: 'http://foodnet24.com',
    description: '배너 클릭시 이동할 페이지 URL',
  })
  @Column({ type: 'varchar', nullable: true })
  href: string;
}
