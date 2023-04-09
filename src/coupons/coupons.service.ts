import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CouponEntity } from 'src/common/entities/coupons.entity';
import { getConnection, Repository, getRepository, getManager } from 'typeorm';
import { CouponDTO } from './dtos/coupon.dto';
import { CouponEditDTO } from './dtos/coupon-edit.dto';
import { CouponRegisterDTO } from './dtos/coupon-reg.dto';
import { CouponDisableDTO } from './dtos/coupon-disable.dto';
import { CouponDisabledHistoryEntity } from 'src/common/entities/coupon-disabled-history.entity';
import { paginate, Pagination, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { CouponSearchDTO } from './dtos/coupon-search.dto';
import { CouponTargetEntity } from 'src/common/entities/coupon-target.entity';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(CouponEntity)
    private readonly couponsRepository: Repository<CouponEntity>,
    @InjectRepository(CouponTargetEntity)
    private readonly couponTargetsRepository: Repository<CouponTargetEntity>,
  ) {}

  async findAll(
    couponSearchDTO: CouponSearchDTO,
  ): Promise<Pagination<CouponEntity, IPaginationMeta>> {
    const queryBuilder = this.couponsRepository.createQueryBuilder('c');
    queryBuilder.where('1=1');
    // 검색 조건
    if (couponSearchDTO.storeId) {
      queryBuilder.andWhere('c.storeId = :sid', {
        sid: couponSearchDTO.storeId,
      });
    } else {
      queryBuilder.andWhere('c.storeId is null');
    }

    if (couponSearchDTO.name) {
      queryBuilder.andWhere('c.name like :name', {
        name: '%' + couponSearchDTO.name + '%',
      });
    }
    // 기본 정렬 순서
    queryBuilder.orderBy('c.created_at', 'DESC');

    const aaa = paginate<CouponEntity>(
      queryBuilder,
      couponSearchDTO.getIPaginationOptions(),
    );
    return aaa;
  }

  async findOneById(id: number): Promise<CouponDTO> {
    try {
      const coupon = await this.couponsRepository.findOne({ id });
      const couponDto = new CouponDTO();
      couponDto.id = coupon.id;
      couponDto.name = coupon.name;
      couponDto.openedAt = coupon.openedAt;
      couponDto.startedAt = coupon.startedAt;
      couponDto.endedAt = coupon.endedAt;
      couponDto.isDuplicate = coupon.isDuplicate;
      couponDto.benefit = coupon.benefit;
      couponDto.minPrice = coupon.minPrice;
      couponDto.discountRate = coupon.discountRate;
      couponDto.maxDiscountPrice = coupon.maxDiscountPrice;
      couponDto.discountPrice = coupon.discountPrice;
      couponDto.issuedCount = coupon.issuedCount;
      couponDto.limitCount = coupon.limitCount;
      couponDto.downloadCount = coupon.downloadCount;
      couponDto.isDisabled = coupon.isDisabled;
      couponDto.storeId = coupon.storeId;
      couponDto.createdAt = coupon.createdAt;
      couponDto.createdBy = coupon.createdBy;
      couponDto.deletedAt = coupon.deletedAt;

      const couponTargets = await this.findCouponTargetById(id);
      couponDto.codeIds = couponTargets.map((item) => item.codeId);

      return couponDto;
    } catch (error) {
      throw new BadRequestException('해당하는 쿠폰 정보가 없습니다!');
    }
  }

  async registerCoupon(
    couponRegisterDTO: CouponRegisterDTO,
    id: number,
  ): Promise<void> {
    const now = this.getDateNow();
    if (couponRegisterDTO.openedAt <= now) {
      throw new UnauthorizedException(
        '오픈 일자를 현재 시간 보다 이 후로 설정해 주세요.',
      );
    }

    const {
      name,
      openedAt,
      startedAt,
      endedAt,
      isDuplicate,
      benefit,
      minPrice,
      discountRate,
      maxDiscountPrice,
      discountPrice,
      issuedCount,
      limitCount,
      downloadCount,
      isDisabled,
      storeId,
      codeIds,
    } = couponRegisterDTO;

    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        const coupon = await transactionalEntityManager
          .getRepository(CouponEntity)
          .save({
            name,
            openedAt,
            startedAt,
            endedAt,
            isDuplicate,
            benefit,
            minPrice,
            discountRate,
            maxDiscountPrice,
            discountPrice,
            issuedCount,
            limitCount,
            downloadCount,
            isDisabled,
            createdBy: id,
            storeId,
          });

        const couponId = coupon.id;
        const targetLength = codeIds.length;
        for (let i = 0; i < codeIds.length; i++) {}
        // 쿠폰 적용 대상 저장
        if (targetLength > 0) {
          for (let i = 0; i < targetLength; i++) {
            const codeId: number = codeIds[i];
            await transactionalEntityManager
              .getRepository(CouponTargetEntity)
              .save({
                couponId,
                codeId,
              });
          }
        }
      });
    } catch (error) {
      throw new BadRequestException('registerCoupon');
    }
  }

  async updateCoupon(
    couponEditDTO: CouponEditDTO,
    couponId: number,
    id: number,
  ): Promise<void> {
    const coupon: CouponDTO = await this.findOneById(couponId);
    if (!coupon) throw new NotFoundException('등록되지 않은 쿠폰입니다.');
    const now = this.getDateNow();

    if (couponEditDTO.openedAt <= now) {
      throw new UnauthorizedException(
        '오픈 일자를 현재 시간 보다 이 후로 설정해 주세요.',
      );
    }

    if (coupon.openedAt <= now) {
      throw new UnauthorizedException('이미 오픈된 쿠폰은 수정할 수 없습니다.');
    }

    const {
      name,
      openedAt,
      startedAt,
      endedAt,
      isDuplicate,
      benefit,
      minPrice,
      discountRate,
      maxDiscountPrice,
      discountPrice,
      issuedCount,
      limitCount,
      codeIds,
    } = couponEditDTO;
    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from(CouponTargetEntity)
          .where('coupon_target.coupon_id = :oid', {
            oid: couponId,
          })
          .execute();

        await transactionalEntityManager
          .createQueryBuilder()
          .update(CouponEntity)
          .set({
            name,
            openedAt,
            startedAt,
            endedAt,
            isDuplicate,
            benefit,
            minPrice,
            discountRate,
            maxDiscountPrice,
            discountPrice,
            issuedCount,
            limitCount,
            updatedBy: id,
          })
          .where('coupon.id = :oid', {
            oid: couponId,
          })
          .execute();

        const targetLength = codeIds.length;
        for (let i = 0; i < codeIds.length; i++) {}
        // 쿠폰 적용 대상 저장
        if (targetLength > 0) {
          for (let i = 0; i < targetLength; i++) {
            const codeId: number = codeIds[i];
            await transactionalEntityManager
              .getRepository(CouponTargetEntity)
              .save({
                couponId,
                codeId,
              });
          }
        }
      });
    } catch (error) {
      throw new BadRequestException('updateCouponById');
    }
  }

  async updateCouponDisable(
    couponId: number,
    couponDisableDTO: CouponDisableDTO,
    id: number,
  ) {
    const coupon: CouponDTO = await this.findOneById(couponId);
    if (!coupon) throw new NotFoundException('등록되지 않은 쿠폰입니다.');

    const { isDisabled, storeId } = couponDisableDTO;

    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager
          .createQueryBuilder()
          .update(CouponEntity)
          .set({
            isDisabled: isDisabled,
            updatedBy: id,
          })
          .where('coupon.id = :oid', {
            oid: couponId,
          })
          .execute();

        await transactionalEntityManager
          .createQueryBuilder()
          .insert()
          .into(CouponDisabledHistoryEntity)
          .values({
            couponId,
            isDisabled: isDisabled,
            createdBy: id,
          })
          .execute();
      });
    } catch (error) {
      throw new BadRequestException('updateCouponById');
    }
  }

  async removeCoupon(couponId: number): Promise<void> {
    const coupon: CouponDTO = await this.findOneById(couponId);
    console.log(coupon);
    if (!coupon) throw new NotFoundException('등록되지 않은 쿠폰입니다.');
    const now = this.getDateNow();
    if (coupon.openedAt <= now) {
      throw new UnauthorizedException('이미 오픈된 쿠폰은 삭제할 수 없습니다.');
    }
    try {
      await getManager().transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager
          .createQueryBuilder()
          .softDelete()
          .from(CouponEntity)
          .where('coupon.id = :oid', {
            oid: couponId,
          })
          .execute();

        await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from(CouponTargetEntity)
          .where('coupon_target.coupon_id = :oid', {
            oid: couponId,
          })
          .execute();
      });
    } catch (error) {
      throw new BadRequestException('removeCouponById');
    }
  }

  /**
   * 현재시간 (한국 시간 가져오기)
   * @returns date
   */
  private getDateNow(): Date {
    const curr = new Date();
    const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;
    return new Date(utc + 9 * 60 * 60 * 1000);
  }

  async findCouponTargetById(couponId: number): Promise<CouponTargetEntity[]> {
    try {
      const couponTarget = await this.couponTargetsRepository.find({
        couponId,
      });
      return couponTarget;
    } catch (error) {
      throw new BadRequestException('해당하는 쿠폰 정보가 없습니다!');
    }
  }
}
