import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CommonEntity } from './common.entity';
import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'user_device',
})
export class UserDeviceEntity extends CommonEntity {
  @ApiProperty({
    example: 'cPS9MtsAQTSpTmC4PrsHzc:APA91bEZN....',
    description: '디바이스 토큰',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: false })
  deviceToken: string;

  @ApiProperty({
    example: 1,
    description: '사용자 내부 아이디',
  })
  @IsNumber()
  @Column({ type: 'int', nullable: false })
  userId: number;
}
