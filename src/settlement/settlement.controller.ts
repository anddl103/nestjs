import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OwnerRole } from '../common/enums/owner-role';
import { SettlementStatus } from '../common/enums/settlement-status';
import { SettlementService } from './settlement.service';
import { OwnerResDTO } from '../owners/dtos/owner.res.dto';
import { CommonSearchResponseDTO } from '../common/dtos/common.search.res.dto';
import { CommonResponseDTO } from '../common/dtos/common.res.dto';
import { SettlementEntity } from '../common/entities/settlements.entity';
import { SettlementSumEntity } from '../common/entities/settlement-sums.entity';
import { SettlementCalculationFormDTO } from './dtos/settlement-calculation-form.dto';
import { SettlementSumListDTO } from './dtos/settlement-sum-list.dto';
import { SettlementSumSearchDTO } from './dtos/settlement-sum-search.dto';
import { SettlementStatusFormDTO } from './dtos/settlement-status-form.dto';
import { SettlementDateFormDTO } from './dtos/settlement-date-form.dto';
import { SettlementSumStatisticsDTO } from './dtos/settlement-sum-statistics.dto';
import { SettlementDetailSearchDTO } from './dtos/settlement-detail-search.dto';
import { SettlementDetailListDTO } from './dtos/settlement-detail-list.dto';
import { SettlementDetailStatisticsDTO } from './dtos/settlement-detail-statistics.dto';
import { SettlementListDTO } from './dtos/settlement-list.dto';
import { SettlementSearchDTO } from './dtos/settlement-search.dto';
import { SettlementStatisticsDTO } from './dtos/settlement-statistics.dto';
import { SettlementDashboardSearchDTO } from './dtos/settlement-dashboard-search.dto';
import { SettlementDashboardDTO } from './dtos/settlement-dashboard.dto';
import { SettlementStoreSearchDTO } from './dtos/settlement-store-search.dto';
import { SettlementStoreListDTO } from './dtos/settlement-store-list.dto';
import { SettlementStoreStatisticsDTO } from './dtos/settlement-store-statistics.dto';
import { SettlementStoreDashboardDTO } from './dtos/settlement-store-dashboard.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('settlement')
@Controller('api/v1/settlement')
export class SettlementController {
  private readonly logger = new Logger(SettlementController.name);

  constructor(private readonly settlementService: SettlementService) {}

  @Post('stores')
  @ApiBody({ type: SettlementCalculationFormDTO })
  @ApiOperation({
    summary: '정산데이터 작성(테스트용)',
    description: '관리자 혹은 운영자',
  })
  async createSettlements(
    @Body() settlementCalculationFormDTO: SettlementCalculationFormDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }

    const paymentDate = settlementCalculationFormDTO.paymentDate;
    const month = parseInt(paymentDate.substring(5, 7));
    let lastDay = 31;
    if (month === 2) {
      lastDay = 28;
    }
    if (month === 4 || month === 6 || month === 9 || month === 11) {
      lastDay = 30;
    }
    const now = new Date();
    const kstNow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours() + 9,
    );
    // 같은 달일 경우 당일 정산실행일시까지만 생성(당일 결제현황 데이터는 익일 정산스케줄러로 실행)
    if (kstNow.getMonth() + 1 === month) {
      lastDay = kstNow.getDate();
    }
    // 정산실행일시 : 스케줄러와 같이 UTC 기준 전일 18시, KST 기준 당일 3시로 설정
    // UTC(2022, 7, 0, 18)의 경우 KST 2022년 8월 1일 3시
    const status = settlementCalculationFormDTO.status;
    for (let i = 0; i < lastDay; i++) {
      const targetDate = new Date(
        parseInt(paymentDate.substring(0, 4)),
        month - 1,
        i,
        18,
        0,
        0,
        0,
      );
      // 정산데이터 생성 및 정산합계 아이디 리스트 리턴
      const settlementSumIds: number[] =
        await this.settlementService.createSettlementDatasByDate(targetDate);
      // 정산완료일은 일주일 후로 세팅
      const doneDate = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate() + 7,
        targetDate.getHours(),
        0,
        0,
        0,
      );
      // 정산완료 처리(원래는 수동 처리, 정산 통계 및 차트 확인을 위한 테스트 데이터 생성)
      if (status === SettlementStatus.Done) {
        await this.settlementService.updateSettlementDoneStatusAndDate(
          settlementSumIds,
          doneDate,
        );
      }
    }

    return new CommonResponseDTO('정산데이터 작성', {}, {});
  }

  @Get('stores')
  @ApiOperation({
    summary: '가게별 정산 리스트',
    description:
      '관리자 혹은 운영자<br>정산관리 가게별 보기 구분(status: [ready:정산대기, done:정산완료, pending:정산보류])<br>status 값이 없을 경우 전체',
  })
  @ApiResponse({
    type: SettlementSumListDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getSettlementStoreList(
    @Query() settlementSumSearchDTO: SettlementSumSearchDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // 가게별 정산 리스트
    const settlementSumList: Pagination<SettlementSumEntity, IPaginationMeta> =
      await this.settlementService.getSettlementSumList(settlementSumSearchDTO);

    return new CommonSearchResponseDTO('가게별 정산 리스트', settlementSumList);
  }

  @Get('stores/statistics')
  @ApiOperation({
    summary: '가게별 정산 통계',
    description:
      '관리자 혹은 운영자<br>정산관리 가게별 보기 구분(status: [ready:정산대기, done:정산완료, pending:정산보류])<br>status 값이 없을 경우 전체',
  })
  @ApiResponse({
    type: SettlementSumStatisticsDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getSettlementStoreStatistics(
    @Query() settlementSumSearchDTO: SettlementSumSearchDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // 가게별 정산 통계
    const settlementSumStatistics =
      await this.settlementService.getSettlementSumStatistics(
        settlementSumSearchDTO,
      );

    return new CommonResponseDTO(
      '가게별 정산 통계',
      settlementSumStatistics,
      {},
    );
  }

  @Patch('stores/status')
  @ApiOperation({
    summary: '가게별 정산 리스트 정산상태 수정',
    description: '관리자 또는 운영자',
  })
  async updateSettlementStatus(
    @Body() settlementStatusFormDTO: SettlementStatusFormDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }

    await this.settlementService.updateSettlementStatus(
      settlementStatusFormDTO,
    );

    return new CommonResponseDTO('가게별 정산 리스트 정산상태 수정', {}, {});
  }

  @Patch('stores/date')
  @ApiOperation({
    summary: '가게별 정산 리스트 정산예정일 수정',
    description: '관리자 또는 운영자',
  })
  async updateSettlementDate(
    @Body() settlementDateFormDTO: SettlementDateFormDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }

    await this.settlementService.updateSettlementDate(settlementDateFormDTO);

    return new CommonResponseDTO('가게별 정산 리스트 정산예정일 수정', {}, {});
  }

  @Get('store-details')
  @ApiOperation({
    summary: '정산상세 리스트',
    description:
      '관리자 혹은 운영자<br>결제수단[samsung: 삼성페이, card: 신용카드, trans: 계좌이체, vbank: 가상계좌, phone: 휴대폰, cultureland: 문화상품권,<br>smartculture: 스마트문상, booknlife: 도서문화상품권, happymoney: 해피머니, point: 포인트, ssgpay: SSGPAY,<br>lpay: LPAY, payco: 페이코, kakaopay: 카카오페이, tosspay: 토스, naverpay: 네이버페이]<br>payMethod 값이 없을 경우 전체',
  })
  @ApiResponse({
    type: SettlementDetailListDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getSettlementDetailList(
    @Query() settlementDetailSearchDTO: SettlementDetailSearchDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // 정산상세 리스트
    const settlementDetailList: Pagination<SettlementEntity, IPaginationMeta> =
      await this.settlementService.getSettlementDetailList(
        settlementDetailSearchDTO,
      );

    return new CommonSearchResponseDTO('정산상세 리스트', settlementDetailList);
  }

  @Get('store-details/statistics')
  @ApiOperation({
    summary: '정산상세 통계',
    description: '관리자 혹은 운영자',
  })
  @ApiResponse({
    type: SettlementDetailStatisticsDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getSettlementDetailStatistics(
    @Query() settlementDetailSearchDTO: SettlementDetailSearchDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // 정산합계 아이디
    const settlementSumId = settlementDetailSearchDTO.id;
    // 정산상세 통계
    const settlementDetailStatistics =
      await this.settlementService.getSettlementDetailStatistics(
        settlementSumId,
        settlementDetailSearchDTO,
      );

    return new CommonResponseDTO(
      '정산상세 통계',
      settlementDetailStatistics,
      {},
    );
  }

  @Get('orders')
  @ApiOperation({
    summary: '주문별 정산 리스트',
    description:
      '관리자 혹은 운영자<br>정산관리 주문별 보기 구분(status: [ready:정산대기, done:정산완료, pending:정산보류])<br>status 값이 없을 경우 전체',
  })
  @ApiResponse({
    type: SettlementListDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getSettlementOrderList(
    @Query() settlementSearchDTO: SettlementSearchDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // 주문별 정산 리스트
    const settlementList: Pagination<SettlementEntity, IPaginationMeta> =
      await this.settlementService.getSettlementList(settlementSearchDTO);

    return new CommonSearchResponseDTO('주문별 정산 리스트', settlementList);
  }

  @Get('orders/statistics')
  @ApiOperation({
    summary: '주문별 정산 통계',
    description:
      '관리자 혹은 운영자<br>정산관리 주문별 보기 구분(status: [ready:정산대기, done:정산완료, pending:정산보류])<br>status 값이 없을 경우 전체',
  })
  @ApiResponse({
    type: SettlementStatisticsDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getSettlementOrderStatistics(
    @Query() settlementSearchDTO: SettlementSearchDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // 주문별 정산 통계
    const settlementStatistics =
      await this.settlementService.getSettlementStatistics(settlementSearchDTO);

    return new CommonResponseDTO('주문별 정산 통계', settlementStatistics, {});
  }

  @Get('stores/:storeId/orders')
  @ApiParam({
    example: 27,
    name: 'storeId',
    required: true,
    description: '매장 아이디를 입력',
  })
  @ApiOperation({
    summary: '점주 정산 리스트',
    description:
      '관리자 혹은 운영자, 점주일 경우 본인 가게<br>기준(dateType: [expectedDate:정산예정일, doneDate:정산완료일])<br>dateType 값이 없을 경우 전체',
  })
  @ApiResponse({
    type: SettlementStoreListDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getSettlementStoreOrderList(
    @Param('storeId', ParseIntPipe) storeId,
    @Query() settlementStoreSearchDTO: SettlementStoreSearchDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    if (roleId === OwnerRole.Store && ownerStoreId !== storeId)
      throw new UnauthorizedException(
        `본인의 가게 Id 를 입력해 주세요. 입력된 가게 storeId : ${storeId}`,
      );
    const settlementStoreList: Pagination<SettlementEntity, IPaginationMeta> =
      await this.settlementService.getSettlementStoreList(
        settlementStoreSearchDTO,
      );

    return new CommonSearchResponseDTO('점주 정산 리스트', settlementStoreList);
  }

  @Get('stores/:storeId/orders/statistics')
  @ApiParam({
    example: 27,
    name: 'storeId',
    required: true,
    description: '매장 아이디를 입력',
  })
  @ApiOperation({
    summary: '점주 정산 통계',
    description:
      '관리자 혹은 운영자, 점주일 경우 본인 가게<br>기준(dateType: [expectedDate:정산예정일, doneDate:정산완료일])<br>dateType 값이 없을 경우 전체',
  })
  @ApiResponse({
    type: SettlementStoreStatisticsDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getSettlementStoreOrderStatistics(
    @Param('storeId', ParseIntPipe) storeId,
    @Query() settlementStoreSearchDTO: SettlementStoreSearchDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    if (roleId === OwnerRole.Store && ownerStoreId !== storeId)
      throw new UnauthorizedException(
        `본인의 가게 Id 를 입력해 주세요. 입력된 가게 storeId : ${storeId}`,
      );
    // 점주 정산 통계
    const settlementStoreStatistics =
      await this.settlementService.getSettlementStoreStatistics(
        settlementStoreSearchDTO,
      );

    return new CommonResponseDTO(
      '점주 정산 통계',
      settlementStoreStatistics,
      {},
    );
  }

  @Get('dashboard/statistics')
  @ApiOperation({
    summary: '정산 대시보드 통계 및 차트',
    description: '관리자 혹은 운영자',
  })
  @ApiResponse({
    type: SettlementDashboardDTO,
    description: 'success',
    status: 200,
  })
  async getSettlementDashboard(
    @Query()
    dashboardSearchDTO: SettlementDashboardSearchDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    //this.logger.log(roleId);
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // 정산 대시보드 통계 및 차트
    const settlementDashboard =
      await this.settlementService.getSettlementDashboard(dashboardSearchDTO);

    return new CommonResponseDTO(
      '정산 대시보드 통계 및 차트',
      settlementDashboard,
      {},
    );
  }

  @Get('stores/:storeId/dashboard/statistics')
  @ApiParam({
    example: 27,
    name: 'storeId',
    required: true,
    description: '매장 아이디를 입력',
  })
  @ApiOperation({
    summary: '점주 정산 대시보드 통계 및 차트',
    description: '관리자 혹은 운영자, 점주일 경우 본인 가게',
  })
  @ApiResponse({
    type: SettlementStoreDashboardDTO,
    description: 'success',
    status: 200,
  })
  async getSettlementStoreDashboard(
    @Param('storeId', ParseIntPipe) storeId,
    @Query()
    dashboardSearchDTO: SettlementDashboardSearchDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    //this.logger.log(roleId);
    const ownerStoreId = currentOwner.storeId;
    if (roleId === OwnerRole.Store && ownerStoreId !== storeId)
      throw new UnauthorizedException(
        `본인의 가게 Id 를 입력해 주세요. 입력된 가게 storeId : ${storeId}`,
      );
    // 점주 정산 대시보드 통계 및 차트
    const settlementStoreDashboard =
      await this.settlementService.getSettlementStoreDashboard(
        storeId,
        dashboardSearchDTO,
      );

    return new CommonResponseDTO(
      '점주 정산 대시보드 통계 및 차트',
      settlementStoreDashboard,
      {},
    );
  }
}
