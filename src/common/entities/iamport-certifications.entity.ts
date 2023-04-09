import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from './common.entity';

@Entity({
  name: 'iamport_certification',
})
export class IamportCertificationEntity extends CommonEntity {
  @ApiProperty({
    example: '9X013J/lCrLJrbLn2Q==',
    description: '핸드폰 번호(암호화)',
  })
  @Column({ type: 'varchar', nullable: false })
  phoneNumber: string;

  @ApiProperty({
    example: 'user',
    description: '회원타입(사용자-user|점주-owner)',
  })
  @Column({ type: 'varchar', nullable: true })
  memberType: string;

  @ApiProperty({
    example: 'imp_123456789',
    description: '아임포트 인증번호',
  })
  @Column({ type: 'varchar', nullable: false })
  impUid: string;

  @ApiProperty({
    example: 'a1b1c1d1e1',
    description: '개인 고유구분 식별키(다날 매뉴얼 기준 CI)',
  })
  @Column({ type: 'varchar', nullable: true })
  uniqueKey: string;

  @ApiProperty({
    example: 'a2b2c2d2e2',
    description:
      '가맹점 내 개인 고유구분 식별키(다날 매뉴얼 기준 DI). 본인인증 PG MID별로 할당되는 개인 식별키',
  })
  @Column({ type: 'varchar', nullable: true })
  uniqueInSite: string;

  @ApiProperty({
    example: '김하나',
    description: '인증결과-실명',
  })
  @Column({ type: 'varchar', nullable: true })
  name: string;

  @ApiProperty({
    example: 'male',
    description: '인증결과-성별. male:남성, female:여성',
  })
  @Column({ type: 'varchar', nullable: true })
  gender: string;

  @ApiProperty({
    example: '1999-03-25',
    description:
      '인증결과-생년월일 ISO8601 형식의 문자열. YYYY-MM-DD 10자리 문자열',
  })
  @Column({ type: 'varchar', nullable: true })
  birthday: string;
}
