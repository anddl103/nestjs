import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from './common.entity';
import { Exclude } from 'class-transformer';
import { StoreEntity } from './stores.entity';
import { OwnerImageEntity } from './owner-images.entity';
import { EventEntity } from './events.entity';
import { NoticeEntity } from './notices.entity';
import { QuestionEntity } from './questions.entity';
import { PaymentSnapshotEntity } from './payment-snapshots.entity';
import { OrderSnapshotEntity } from './order-snapshots.entity';

@Index('username', ['username'], { unique: true })
@Entity({
  name: 'owner',
})
export class OwnerEntity extends CommonEntity {
  @ApiProperty({
    example: 3,
    description: '롤 아이디',
  })
  @Column({ type: 'int', nullable: false })
  roleId: number;

  @ApiProperty({
    example: false,
    description: '가게인증 여부(점주용 로그인 필수)',
  })
  @Column({ type: 'boolean', nullable: true })
  isConfirmed: boolean;

  @ApiProperty({
    example: false,
    description: '동네가게 혜택 알림 동의(점주용 회원가입 선택)',
  })
  @Column({ type: 'boolean', nullable: true })
  isBenefitNoti: boolean;

  @ApiProperty({
    example: 'kimwon@foodnet24.com',
    description: '아이디(이메일)',
  })
  @IsEmail({}, { message: '올바른 이메일을 작성해주세요.' })
  @IsNotEmpty({ message: '이메일을 작성해주세요.' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  username: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @ApiProperty({
    example: '010-1234-1234',
    description: '핸드폰 번호(점주용 회원가입 필수)',
  })
  @IsString()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  phoneNumber: string;

  @ApiProperty({
    example: '김푸드',
    description: '대표자명',
  })
  @IsString()
  @IsNotEmpty({ message: '대표자명을 입력해주세요.' })
  @Column({ type: 'varchar', nullable: true })
  fullName: string;

  @ApiProperty({
    example: 'email',
    description: '사장님 회원가입 유형',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  signupType: string;

  @ApiProperty({
    example: '바른치킨 공덕파크자이점',
    description: '상호명',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  businessName: string;

  @ApiProperty({
    example: '서울 마포구 공덕동 476',
    description: '사업자 기본주소',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  businessAddress1: string;

  @ApiProperty({
    example: '1층 102호',
    description: '사업자 상세주소',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  businessAddress2: string;

  @ApiProperty({
    example: '123-12-12345',
    description: '사업자등록번호',
  })
  @Column({ type: 'varchar', nullable: true })
  businessNumber: string;

  @ApiProperty({
    example: '개발',
    description: '소속 부서',
  })
  @Column({ type: 'varchar', nullable: true })
  department: string;

  @ApiProperty({
    example: '회원 관련 내용을 기록하세요.',
    description: '회원 메모',
  })
  @Column({ type: 'varchar', nullable: true })
  memo: string;

  @ApiProperty({
    example: 'request',
    description: '점주 인가 상태(요청-request|승인-confirm|반려-reject)',
  })
  @Column({ type: 'varchar', nullable: true })
  status: string;

  @OneToMany(() => StoreEntity, (store) => store.owner)
  stores: StoreEntity[];

  @OneToMany(() => OwnerImageEntity, (ownerImage) => ownerImage.owner)
  ownerImages: OwnerImageEntity[];

  @OneToMany(() => EventEntity, (event) => event.owner)
  events: EventEntity[];

  @OneToMany(() => NoticeEntity, (notice) => notice.owner)
  notices: NoticeEntity[];

  @OneToMany(() => QuestionEntity, (question) => question.owner)
  questions: QuestionEntity[];

  @OneToMany(
    () => PaymentSnapshotEntity,
    (paymentSnapshot) => paymentSnapshot.createdBy,
  )
  paymentSnapshots: PaymentSnapshotEntity[];

  @OneToMany(
    () => OrderSnapshotEntity,
    (orderSnapshot) => orderSnapshot.createdBy,
  )
  orderSnapshots: OrderSnapshotEntity[];
}
