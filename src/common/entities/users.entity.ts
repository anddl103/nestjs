import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CommonEntity } from './common.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserAddressEntity } from './user-addresses.entity';
import { OrderEntity } from './orders.entity';
import { QuestionEntity } from './questions.entity';

@Index('username', ['username'], { unique: true })
@Entity({
  name: 'user',
})
export class UserEntity extends CommonEntity {
  @ApiProperty({
    example: 'user1@test.com',
    description: '일반회원 아이디(이메일)',
  })
  @IsEmail({}, { message: '올바른 이메일을 작성해주세요.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  username: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @ApiProperty({
    example: '01012341234',
    description: '핸드폰 번호',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string;

  @ApiProperty({
    example: '김푸드',
    description: '이름',
  })
  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  @Column({ type: 'varchar', nullable: true })
  fullName: string;

  @ApiProperty({
    example: 'email',
    description: '회원가입 유형',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  signupType: string;

  @ApiProperty({
    example: false,
    description: '동네가게 혜택 알림 동의(회원가입 선택옵션)',
  })
  @Column({ type: 'boolean', nullable: true })
  isBenefitNoti: boolean;

  @ApiProperty({
    example: 1,
    description: '회원레벨(일반회원_C1-1|바우처회원_C2-2|C3_기부회원-3)',
  })
  @IsNumber()
  @Column({ type: 'int', nullable: true })
  level: number;

  @ApiProperty({
    example: 'rookie',
    description:
      '회원등급(새내기-rookie|주민-local|이웃-neighbor|단골-regular)',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  rank: string;

  @ApiProperty({
    example: '회원 관련 내용을 기록하세요.',
    description: '회원메모',
  })
  @Column({ type: 'varchar', nullable: true })
  memo: string;

  @OneToMany(() => UserAddressEntity, (userAddress) => userAddress.user)
  userAddresses: UserAddressEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @OneToMany(() => QuestionEntity, (question) => question.user)
  questions: QuestionEntity[];
}
