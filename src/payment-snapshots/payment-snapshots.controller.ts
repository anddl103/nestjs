import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
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
import { PaymentSnapshotsService } from './payment-snapshots.service';
import { PaymentSnapshotSearchDTO } from './dtos/payment-snapshot-search.dto';
import { PaymentSnapshotListDTO } from './dtos/payment-snapshot-list.dto';
import { PaymentSnapshotDetailDTO } from './dtos/payment-snapshot-detail.dto';
import { OwnerResDTO } from '../owners/dtos/owner.res.dto';
import { CommonSearchResponseDTO } from '../common/dtos/common.search.res.dto';
import { CommonResponseDTO } from '../common/dtos/common.res.dto';
import { PaymentSnapshotEntity } from '../common/entities/payment-snapshots.entity';
import { PaymentSnapshotStatus } from 'src/common/enums/payment-snapshot-status';
import { PaymentSnapshotFormDTO } from './dtos/payment-snapshot-form.dto';
import { PaymentSnapshotStatisticsDTO } from './dtos/payment-snapshot-statistics.dto';
import { PaymentSnapshotDashboardSearchDTO } from './dtos/payment-snapshot-dashboard-search.dto';
import { PaymentSnapshotDashboardDTO } from './dtos/payment-snapshot-dashboard.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('payment-snapshots')
@Controller('api/v1/payment-snapshots')
export class PaymentSnapshotsController {
  private readonly logger = new Logger(PaymentSnapshotsController.name);

  constructor(
    private readonly paymentSnapshotsService: PaymentSnapshotsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '결제현황 리스트',
    description:
      '관리자 혹은 운영자<br>결제현황 구분(paid:결제완료, cancelled:결제취소)<br>status 값이 없을 경우 전체<br>status > paid 일 경우 isCancelled 파라미터 추가',
  })
  @ApiResponse({
    type: PaymentSnapshotListDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getPaymentSnapshotList(
    @Query() paymentSnapshotSearchDTO: PaymentSnapshotSearchDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // 결제현황 리스트
    const paymentSnapshotList: Pagination<
      PaymentSnapshotEntity,
      IPaginationMeta
    > = await this.paymentSnapshotsService.getPaymentSnapshotList(
      paymentSnapshotSearchDTO,
    );

    return new CommonSearchResponseDTO('결제현황 리스트', paymentSnapshotList);
  }

  @Get('statistics')
  @ApiOperation({
    summary: '결제현황 통계',
    description:
      '관리자 혹은 운영자<br>결제현황 구분(paid:결제완료, cancelled:결제취소)<br>status 값이 없을 경우 전체',
  })
  @ApiResponse({
    type: PaymentSnapshotStatisticsDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getPaymentSnapshotStatistics(
    @Query() paymentSnapshotSearchDTO: PaymentSnapshotSearchDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // 결제현황 통계
    const paymentSnapshotStatistics =
      await this.paymentSnapshotsService.getPaymentSnapshotStatistics(
        paymentSnapshotSearchDTO,
      );

    return new CommonResponseDTO(
      '결제현황 통계',
      paymentSnapshotStatistics,
      {},
    );
  }

  @Get(':id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '결제현황 리스트에서 원하는 결제현황의 id 를 입력',
  })
  @ApiOperation({
    summary: '결제현황 상세',
    description: '관리자 혹은 운영자, 점주일 경우 본인 가게',
  })
  @ApiResponse({
    type: PaymentSnapshotDetailDTO,
    isArray: true,
    description: 'success',
    status: 200,
  })
  async getPaymentSnapshotDetail(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    const ownerStoreId = currentOwner.storeId;
    // 결제현황 아이디 체크
    await this.paymentSnapshotsService.getValidatedPaymentSnapshotById(id);
    // 결제현황 상세
    const paymentSnapshotDetail =
      await this.paymentSnapshotsService.getPaymentSnapshotDetail(id);
    // 점주일 경우
    if (roleId === OwnerRole.Store) {
      const storeId = paymentSnapshotDetail.order.storeId;
      if (ownerStoreId !== storeId) {
        throw new UnauthorizedException(
          `본인 가게의 결제현황이 아닙니다. paymentSnapshotId : ${id}`,
        );
      }
    }

    return new CommonResponseDTO('결제현황 상세', paymentSnapshotDetail, {});
  }

  @Post(':id/cancel')
  @ApiBody({ type: PaymentSnapshotFormDTO })
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '결제현황 리스트에서 원하는 결제현황의 id 를 입력',
  })
  @ApiOperation({
    summary: '결제현황 주문취소',
    description: '관리자 혹은 운영자',
  })
  async cancelOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() paymentSnapshotFormDTO: PaymentSnapshotFormDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const ownerId = currentOwner.id;
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // 결제현황 아이디 체크
    const paymentSnapshot =
      await this.paymentSnapshotsService.getValidatedPaymentSnapshotById(id);
    // 취소 상태인지 체크
    if (paymentSnapshot.status === PaymentSnapshotStatus.Cancelled) {
      throw new BadRequestException('이미 취소된 결제 정보입니다.');
    }
    // 결제현황 주문취소
    await this.paymentSnapshotsService.updateOrderCancel(
      ownerId,
      paymentSnapshot.orderId,
      paymentSnapshotFormDTO.reason,
    );

    return new CommonResponseDTO('결제현황 주문취소', {}, {});
  }

  @Get('dashboard/statistics')
  @ApiOperation({
    summary: '결제현황 대시보드 통계 및 차트',
    description: '관리자 혹은 운영자',
  })
  @ApiResponse({
    type: PaymentSnapshotDashboardDTO,
    description: 'success',
    status: 200,
  })
  async getPaymentSnapshotDashboard(
    @Query()
    dashboardSearchDTO: PaymentSnapshotDashboardSearchDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    //this.logger.log(roleId);
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager) {
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );
    }
    // 결제현황 대시보드 통계 및 차트
    const paymentSnapshotDashboard =
      await this.paymentSnapshotsService.getPaymentSnapshotDashboard(
        dashboardSearchDTO,
      );

    return new CommonResponseDTO(
      '결제현황 대시보드 통계 및 차트',
      paymentSnapshotDashboard,
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
    summary: '점주 결제현황 대시보드 통계 및 차트',
    description: '관리자 혹은 운영자, 점주일 경우 본인 가게',
  })
  @ApiResponse({
    type: PaymentSnapshotDashboardDTO,
    description: 'success',
    status: 200,
  })
  async getPaymentSnapshotStoreDashboard(
    @Param('storeId', ParseIntPipe) storeId,
    @Query()
    dashboardSearchDTO: PaymentSnapshotDashboardSearchDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    //this.logger.log(roleId);
    const ownerStoreId = currentOwner.storeId;
    if (roleId === OwnerRole.Store && ownerStoreId !== storeId)
      throw new UnauthorizedException(
        `본인의 가게 Id 를 입력해 주세요. 입력된 가게 storeId : ${storeId}`,
      );
    // 점주 결제현황 대시보드 통계 및 차트
    const paymentSnapshotStoreDashboard =
      await this.paymentSnapshotsService.getPaymentSnapshotStoreDashboard(
        storeId,
        dashboardSearchDTO,
      );

    return new CommonResponseDTO(
      '점주 결제현황 대시보드 통계 및 차트',
      paymentSnapshotStoreDashboard,
      {},
    );
  }
}
