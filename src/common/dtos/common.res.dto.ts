export class CommonResponseDTO {
  message: string;
  data: object | [];
  pageInfo: object;

  constructor(message, data, pageInfo) {
    this.message = message;
    this.data = data;
    this.pageInfo = pageInfo;
  }
}
