import { ImageFileUploadRequestDto } from './dtos/image-file.up.req.dto';
import {
  Bind,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CommonResponseDTO } from 'src/common/dtos/common.res.dto';
import { OwnerDTO } from 'src/owners/dtos/owner.dto';
import { ImageFileDto } from './dtos/image-file.dto';
import { ImageFileUploadResponseDTO } from './dtos/image-file.up.res.dto';
import { ImageFileUrlResponseDTO } from './dtos/image-file.url.res';
import { ImagesService } from './images.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { multerOptions } from './common/multer.options';

@ApiTags('images')
@Controller('/api/v1/images')
export class ImagesController {
  private readonly logger = new Logger(ImagesController.name);

  // Multer upload options
  constructor(private readonly imagesService: ImagesService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '이미지 업로드',
    type: ImageFileUploadRequestDto,
  })
  @Bind(UploadedFile())
  @ApiResponse({
    type: ImageFileUploadResponseDTO,
    description: 'success',
    status: 200,
  })
  async uploadImage(image: Express.Multer.File, @Body('folder') folder) {
    const result = await this.imagesService.uploadFileToS3(folder, image);
    // const result = new ImageFileUploadResponseDTO();
    return new CommonResponseDTO('이미지 업로드', result, {});
  }

  @Get('/:id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '이미지 정보를 가져올 id 를 입력',
  })
  @ApiResponse({
    type: ImageFileDto,
    description: 'success',
    status: 200,
  })
  @ApiOperation({ summary: '이미지 url 가져오기' })
  async getImage(@Param('id', ParseIntPipe) id) {
    const imageFile = await this.imagesService.findOneById(id);
    return new CommonResponseDTO('이미지 정보 가져오기', imageFile, {});
  }

  @Get('/:id/url')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '이미지 url 정보를 가져올 id 를 입력',
  })
  @ApiResponse({
    type: ImageFileUrlResponseDTO,
    description: 'success',
    status: 200,
  })
  @ApiOperation({ summary: '이미지 url 가져오기' })
  async getImageUrl(@Param('id', ParseIntPipe) id) {
    const imageFile = await this.imagesService.findOneById(id);
    const imageFileUrlResponseDTO = new ImageFileUrlResponseDTO();
    imageFileUrlResponseDTO.url = imageFile.url;

    return new CommonResponseDTO(
      '이미지 url 가져오기',
      imageFileUrlResponseDTO,
      {},
    );
  }

  @Delete('/:id')
  @ApiParam({
    example: 1,
    name: 'id',
    required: true,
    description: '삭제할 이미지 정보의 id 를 입력',
  })
  @ApiOperation({ summary: '이미지 삭제' })
  async removeImage(
    @Param('id', ParseIntPipe) id,
    // @CurrentUser() currentOwner: OwnerDTO,
  ) {
    // const roleId = currentOwner.roleId;
    // this.logger.log('owner id: ' + currentOwner.id + ', roleId: ' + roleId);
    // if (roleId > 1)
    //   throw new UnauthorizedException('관리자만 접근할 수 있습니다.');
    await this.imagesService.removeImageFileById(id);
    return new CommonResponseDTO('이미지 삭제', {}, {});
  }
}
