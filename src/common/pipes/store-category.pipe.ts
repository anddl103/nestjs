import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class StoreCategoryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (parseInt(value)) {
      if (value < 1 || value > 7) {
        return 0;
      } else {
        return value;
      }
    }
    return 0;
  }
}
