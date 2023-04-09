import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export const multerOptions = {
  // Enable file size limits
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new BadRequestException(
          `지원되지 않는 파일 형식입니다. ${extname(file.originalname)}`,
        ),
        false,
      );
    }
  },
};
