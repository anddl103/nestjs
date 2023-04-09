import { ImageFileEntity } from './../common/entities/image-files.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import { getConnection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageFileDto } from './dtos/image-file.dto';
import { ImageFileUploadResponseDTO } from './dtos/image-file.up.res.dto';

@Injectable()
export class ImagesService {
  private AWS_S3: AWS.S3;
  private S3_BUCKET_NAME: string;
  private ACL = 'public-read';
  private CLOUD_FRONT: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(ImageFileEntity)
    private readonly imageFilesRepository: Repository<ImageFileEntity>,
  ) {
    AWS.config.update({
      credentials: {
        accessKeyId: configService.get('AWS_S3_ACCESS_KEY'),
        secretAccessKey: configService.get('AWS_S3_SECRET_KEY'),
      },
      region: this.configService.get('AWS_S3_REGION'),
    });
    this.S3_BUCKET_NAME = this.configService.get('AWS_S3_BUCKET_NAME');
    this.AWS_S3 = new AWS.S3();
    this.CLOUD_FRONT = this.configService.get('AWS_CLOUD_FRONT');
  }

  async uploadFileToS3(
    folder: string,
    file: Express.Multer.File,
  ): Promise<ImageFileUploadResponseDTO> {
    try {
      const key = `${folder}/${uuid()}${path.extname(
        file.originalname,
      )}`.replace(/ /g, '');

      // image upload
      await this.uploadS3Object(key, file);

      // db insert
      const imageFileUploadResponseDto: ImageFileUploadResponseDTO =
        await this.imageFilesRepository.save({
          folder,
          name: file.originalname,
          url: this.getAwsCloudfrontFileUrl(key),
        });

      return imageFileUploadResponseDto;
    } catch (error) {
      throw new BadRequestException(`File upload failed : ${error}`);
    }
  }

  async findOneById(id: number): Promise<ImageFileDto> {
    try {
      const imageFile: ImageFileDto = await this.imageFilesRepository.findOne({
        id,
      });
      return imageFile;
    } catch (error) {
      throw new BadRequestException('해당하는 회원 정보가 없습니다!');
    }
  }

  async removeImageFileById(id: number): Promise<void> {
    console.log('delete image service start');
    const imageFile: ImageFileDto = await this.findOneById(id);
    if (!imageFile) throw new NotFoundException('등록되지 않은 이미지입니다.');

    try {
      const key = this.getAwsCloudfrontFileUrlToKey(imageFile.url);
      await this.deleteS3Object(key, (err, data) => {});

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(ImageFileEntity)
        .where('image_file.id = :oid', {
          oid: id,
        })
        .execute();
    } catch (error) {
      throw new BadRequestException('removeImageFileById');
    }
  }

  async uploadS3Object(
    key: string,
    file: Express.Multer.File,
  ): Promise<{ success: true }> {
    try {
      await this.AWS_S3.putObject(
        {
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ACL: this.ACL,
          ContentType: file.mimetype,
        },
        (err, data) => {
          console.log(data);
        },
      ).promise();
      return { success: true };
    } catch (error) {
      throw new BadRequestException(`File upload failed : ${error}`);
    }
  }

  async uploadS3ObjectJson(
    key: string,
    jsonDTO: any,
  ): Promise<{ success: true }> {
    try {
      await this.AWS_S3.putObject(
        {
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
          Body: JSON.stringify(jsonDTO),
          ACL: this.ACL,
          ContentType: 'application/json; charset=utf-8',
        },
        (err, data) => {
          console.log(data);
        },
      ).promise();
      return { success: true };
    } catch (error) {
      throw new BadRequestException(`File upload failed : ${error}`);
    }
  }

  async deleteS3Object(
    key: string,
    callback?: (err: AWS.AWSError, data: AWS.S3.DeleteObjectOutput) => void,
  ): Promise<{ success: true }> {
    try {
      await this.AWS_S3.deleteObject(
        {
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
        },
        callback,
      ).promise();
      return { success: true };
    } catch (error) {
      throw new BadRequestException(`Failed to delete file : ${error}`);
    }
  }

  async getS3Object(
    key: string,
    callback?: (err: AWS.AWSError, data: AWS.S3.GetObjectAclOutput) => void,
  ): Promise<{ success: true; body: any }> {
    try {
      const obj = await this.AWS_S3.getObject({
        Bucket: this.S3_BUCKET_NAME,
        Key: key,
      }).promise();
      return {
        success: true,
        body: JSON.parse(obj.Body.toString('utf-8')),
      };
    } catch (error) {
      throw new BadRequestException(`Failed to delete file : ${error}`);
    }
  }

  public getAwsS3FileUrl(objectKey: string) {
    return `https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${objectKey}`;
  }

  public getAwsCloudfrontFileUrl(objectKey: string) {
    return `${this.CLOUD_FRONT}/${objectKey}`;
  }

  public getAwsCloudfrontFileUrlToKey(objectKey: string) {
    return objectKey.replace(`${this.CLOUD_FRONT}/`, '');
  }
}
