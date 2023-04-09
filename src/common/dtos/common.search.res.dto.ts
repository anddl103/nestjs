import { CommonResponseDTO } from './common.res.dto';

export class CommonSearchResponseDTO extends CommonResponseDTO {
  constructor(message, data) {
    super(message, data.items, data.meta);
  }
}
