import { PartialType } from '@nestjs/swagger';
import { MenuEntity } from '../../common/entities/menus.entity';

export class MenuDTO extends PartialType(MenuEntity) {}
