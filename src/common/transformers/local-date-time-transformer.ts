import { ValueTransformer } from 'typeorm';

export class LocalDateTimeTransformer implements ValueTransformer {
  // entity -> db로 넣을때 ( UTC 기준 > 한국시간 -9 hour )
  to(entityValue: Date): Date {
    if (entityValue !== null && entityValue !== undefined) {
      console.log('entityValue: ' + entityValue.toString());
      const toDate = new Date(
        entityValue.getTime() + entityValue.getTimezoneOffset() * 60000,
      );
      //console.log('toDate: ' + toDate.toString());
      return toDate;
    }
    return null;
  }

  // db -> entity로 가져올때 ( 한국시간 기준 > UTC +9 hour )
  from(databaseValue: Date): String {
    if (databaseValue !== null && databaseValue !== undefined) {
      //console.log('databaseValue: ' + databaseValue.toDateString());
      const localDateTime = new Date(
        databaseValue.getTime() - databaseValue.getTimezoneOffset() * 60000,
      );
      const year = localDateTime.getFullYear();
      const month = ('0' + (localDateTime.getMonth() + 1)).slice(-2);
      const dayOfMonth = ('0' + localDateTime.getDate()).slice(-2);
      const hour = ('0' + localDateTime.getHours()).slice(-2);
      const minute = ('0' + localDateTime.getMinutes()).slice(-2);
      const second = ('0' + localDateTime.getSeconds()).slice(-2);
      const fromDate =
        year +
        '-' +
        month +
        '-' +
        dayOfMonth +
        ' ' +
        hour +
        ':' +
        minute +
        ':' +
        second;
      //console.log('fromDate: ' + fromDate);
      return fromDate;
    }
    return null;
  }
}
