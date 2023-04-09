import { OmitType } from '@nestjs/swagger';
import { OwnerEntity } from '../../common/entities/owners.entity';

export class OwnerDTO extends OmitType(OwnerEntity, ['password'] as const) {}
