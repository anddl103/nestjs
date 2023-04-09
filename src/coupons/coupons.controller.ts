import {
  Body,
  Controller,
  createParamDecorator,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CommonResponseDTO } from 'src/common/dtos/common.res.dto';
import { CouponsService } from './coupons.service';
import { CouponDTO } from './dtos/coupon.dto';
import { CouponEditDTO } from './dtos/coupon-edit.dto';
import { CouponRegisterDTO } from './dtos/coupon-reg.dto';
import { CouponDisableDTO } from './dtos/coupon-disable.dto';
import { CouponSearchDTO } from './dtos/coupon-search.dto';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { CouponEntity } from 'src/common/entities/coupons.entity';
import { CommonSearchResponseDTO } from 'src/common/dtos/common.search.res.dto';
import { StoresService } from 'src/stores/stores.service';
import { OwnerResDTO } from 'src/owners/dtos/owner.res.dto';
import { CodesService } from 'src/codes/codes.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('coupons')
@Controller('/api/v1/coupons')
export class CouponsController {
  constructor(
    private readonly couponsService: CouponsService,
    private readonly storesService: StoresService,
    private readonly codesService: CodesService,
  ) {}

  @Get()
  @ApiOperation({ summary: '쿠폰 조회' })
  @ApiResponse({
    type: CouponDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getCouponList(
    @Query() couponSearchDTO: CouponSearchDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const id = currentOwner.id;
    const storeId = currentOwner.storeId;

    if (currentOwner.roleId > 2) {
      if (!couponSearchDTO.storeId) {
        throw new UnauthorizedException('매장ID가 필요합니다.');
      } else {
        // 점주용 매장 검증 추가
        await this.checkStoreByStoreIdAndOwnerId(
          couponSearchDTO.storeId,
          id,
          storeId,
        );
      }
    } else {
      // storeId = 0일 경우 가게 선택 안함
      if (couponSearchDTO.storeId == 0) {
        couponSearchDTO.storeId = null;
      }
      // 매니저용 매장 검증 추가
      await this.checkStoreByStoreId(couponSearchDTO.storeId);
    }

    const couponList: Pagination<CouponEntity, IPaginationMeta> =
      await this.couponsService.findAll(couponSearchDTO);

    return new CommonSearchResponseDTO('쿠폰 리스트', couponList);
  }

  @Get('/:id')
  @ApiParam({
    example: 15,
    name: 'id',
    required: true,
    description: 'CMS 쿠폰 리스트에서 조회할 쿠폰의 id 를 입력',
  })
  @ApiOperation({ summary: '쿠폰 조회 (단건)' })
  @ApiResponse({
    type: CouponDTO,
    description: 'success',
    status: 200,
  })
  async getCoupon(
    @Param('id', ParseIntPipe) id,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const userId = currentOwner.id;
    const storeId = currentOwner.storeId;

    const coupon = await this.couponsService.findOneById(id);

    if (currentOwner.roleId > 2) {
      if (storeId !== coupon.storeId) {
        throw new UnauthorizedException('유효하지 않은 쿠폰 정보입니다.');
      }
    }
    return new CommonResponseDTO('쿠폰 조회', coupon, {});
  }

  @Post()
  @ApiOperation({ summary: '쿠폰 등록' })
  async registerCoupon(
    @Body() couponRegisterDTO: CouponRegisterDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const id = currentOwner.id;
    const storeId = currentOwner.storeId;
    if (currentOwner.roleId > 2) {
      if (!couponRegisterDTO.storeId) {
        throw new UnauthorizedException('매장ID가 필요합니다.');
      } else {
        // 점주용 매장 검증 추가
        await this.checkStoreByStoreIdAndOwnerId(
          couponRegisterDTO.storeId,
          id,
          storeId,
        );
      }
    } else {
      // 매니저용 매장 검증 추가
      await this.checkStoreByStoreId(couponRegisterDTO.storeId);
    }

    await this.couponsService.registerCoupon(couponRegisterDTO, id);

    return new CommonResponseDTO('쿠폰 등록', {}, {});
  }

  @Patch('/:id')
  @ApiParam({
    example: 15,
    name: 'id',
    required: true,
    description: 'CMS 쿠폰 리스트에서 수정할 쿠폰의 id 를 입력',
  })
  @ApiOperation({ summary: '쿠폰 수정' })
  async updateCoupon(
    @Param('id', ParseIntPipe) couponId,
    @Body() couponEditDTO: CouponEditDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const id = currentOwner.id;
    const storeId = currentOwner.storeId;
    if (currentOwner.roleId > 2) {
      if (!couponEditDTO.storeId) {
        throw new UnauthorizedException('매장ID가 필요합니다.');
      } else {
        // 점주용 매장 검증 추가
        await this.checkStoreByStoreIdAndOwnerId(
          couponEditDTO.storeId,
          id,
          storeId,
        );
      }
    } else {
      // 매니저용 매장 검증 추가
      await this.checkStoreByStoreId(couponEditDTO.storeId);
    }
    await this.couponsService.updateCoupon(couponEditDTO, couponId, id);
    return new CommonResponseDTO('쿠폰 수정', {}, {});
  }

  @Delete('/:id')
  @ApiParam({
    example: 15,
    name: 'id',
    required: true,
    description: 'CMS 쿠폰 리스트에서 삭제할 쿠폰의 id 를 입력',
  })
  @ApiOperation({ summary: '쿠폰 삭제' })
  async removeCoupon(@Param('id', ParseIntPipe) id) {
    await this.couponsService.removeCoupon(id);
    return new CommonResponseDTO('쿠폰 삭제', {}, {});
  }
  // 긴급중지
  @Patch('/:id/disable')
  @ApiParam({
    example: 15,
    name: 'id',
    required: true,
    description: 'CMS 쿠폰 상세에서 긴급 쿠폰 발행 중지할 쿠폰의 id 를 입력',
  })
  @ApiOperation({ summary: '긴급 쿠폰 발행 중지 여부' })
  async updateCouponDisable(
    @Param('id', ParseIntPipe) couponId,
    @Body() couponDisableDTO: CouponDisableDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const id = currentOwner.id;
    const storeId = currentOwner.storeId;

    if (currentOwner.roleId > 2) {
      if (!couponDisableDTO.storeId) {
        throw new UnauthorizedException('매장ID가 필요합니다.');
      } else {
        // 점주용 매장 검증 추가
        await this.checkStoreByStoreIdAndOwnerId(
          couponDisableDTO.storeId,
          id,
          storeId,
        );
      }
    }

    // disable history 추가

    // 발급된 쿠폰 회수 기능 추가 하기

    await this.couponsService.updateCouponDisable(
      couponId,
      couponDisableDTO,
      id,
    );
    return new CommonResponseDTO('긴급 쿠폰 발행 여부', {}, {});
  }

  @Get('/code/target')
  @ApiOperation({ summary: '적용대상 목록 조회' })
  @ApiResponse({
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getCouponCodeList() {
    const ref = 'target';
    let codeList = await this.codesService.findCodeListByRefAndParentId(ref, 0);

    codeList = await this.listToTree(codeList);

    return new CommonResponseDTO('코드 리스트', codeList, {});
  }

  /**
   * 매장 검증 점주용 (점주의 매장인지 확인)
   * @param storeId
   * @param ownerId
   */
  private async checkStoreByStoreIdAndOwnerId(
    storeId: number,
    ownerId: number,
    jwtStoreId: number,
  ): Promise<void> {
    // const store = 'store';
    if (!storeId || !ownerId) {
      throw new UnauthorizedException('매장 정보가 없습니다.');
    }

    if (storeId != jwtStoreId) {
      throw new UnauthorizedException('유효하지 않은 매장 정보입니다.');
    }
  }

  /**
   * 매장 검증 매니저용(매장이 유효한지 확인)
   * @param storeId
   */
  private async checkStoreByStoreId(storeId: number): Promise<void> {
    if (storeId) {
      await this.storesService.validateStore(storeId);
    }
  }

  private async listToTree(list) {
    const map = {},
      roots = [];
    let node;

    for (let i = 0; i < list.length; i += 1) {
      map[list[i].id] = i; // initialize the map
      list[i].children = []; // initialize the children
    }

    for (let i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.parentId !== 1) {
        list[map[node.parentId]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }
}
