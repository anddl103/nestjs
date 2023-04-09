import { PartialType } from '@nestjs/swagger';
import { PaymentSnapshotEntity } from '../../common/entities/payment-snapshots.entity';

export class PaymentSnapshotDTO extends PartialType(PaymentSnapshotEntity) {}
