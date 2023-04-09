import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../../common/entities/users.entity';

export class UserDTO extends OmitType(UserEntity, ['password'] as const) {}
