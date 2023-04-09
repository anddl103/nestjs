import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class StoreSortingPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (
      value == 'default' ||
      value == 'discount' ||
      value == 'bottom' ||
      value == 'coupon'
    ) {
      return value;
    } else {
      return 'default';
    }
  }
}
