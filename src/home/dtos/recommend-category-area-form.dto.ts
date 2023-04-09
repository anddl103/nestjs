import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CityAndProvince } from '../../common/enums/city-and-province';

export class RecommendCategoryAreaFormDTO {
  @ApiProperty({
    enum: [
      CityAndProvince.Seoul,
      CityAndProvince.Busan,
      CityAndProvince.Daegu,
      CityAndProvince.Incheon,
      CityAndProvince.Gwangju,
      CityAndProvince.Daejeon,
      CityAndProvince.Ulsan,
      CityAndProvince.Sejong,
      CityAndProvince.Gyeonggi,
      CityAndProvince.Gangwon,
      CityAndProvince.Chungbuk,
      CityAndProvince.Chungnam,
      CityAndProvince.Jeonbuk,
      CityAndProvince.Jeonnam,
      CityAndProvince.Gyeongbuk,
      CityAndProvince.Gyeongnam,
      CityAndProvince.Jeju,
    ],
    example: CityAndProvince.Gangwon,
    description:
      '지역명(seoul|busan|daegu|incheon|gwangju|daejeon|ulsan|sejong|gyeonggi|gangwon|chungbuk|chungnam|jeonbuk|jeonnam|gyeongbuk|gyeongnam|jeju)',
  })
  @IsEnum(CityAndProvince)
  name: CityAndProvince;
}
