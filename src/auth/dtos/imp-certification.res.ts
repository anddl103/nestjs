import { ApiProperty } from '@nestjs/swagger';

export class ImpCertificationResDTO {
  @ApiProperty({
    example: 'a1b1c1d1e1',
    description: '개인 고유구분 식별키(다날 매뉴얼 기준 CI)',
  })
  unique_key: string;

  @ApiProperty({
    example: 'a2b2c2d2e2',
    description:
      '가맹점 내 개인 고유구분 식별키(다날 매뉴얼 기준 DI). 본인인증 PG MID별로 할당되는 개인 식별키',
  })
  unique_in_site: string;

  @ApiProperty({
    example: '김하나',
    description: '인증결과-실명',
  })
  name: string;

  @ApiProperty({
    example: 'male',
    description: '인증결과-성별. male:남성, female:여성',
  })
  gender: string;

  @ApiProperty({
    example: '1999-01-01',
    description:
      '인증결과-생년월일 ISO8601 형식의 문자열. YYYY-MM-DD 10자리 문자열',
  })
  birthday: string;
}
