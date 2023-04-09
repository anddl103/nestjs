import { registerDecorator, ValidationOptions } from 'class-validator';
import * as dayjs from 'dayjs';

export function IsOnlyDate(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsOnlyDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'yyyy-MM-dd(예: 2022-09-01) 형식으로 입력해 주십시오.',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          const regex =
            /^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/;
          // return typeof value === 'string' && regex.test(value);
          return (
            typeof value === 'string' &&
            regex.test(value) &&
            dayjs(value).isValid()
          );
        },
      },
    });
  };
}
