import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { HttpApiExceptionFilter } from './common/exceptions/http-api-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

class Application {
  protected logger = new Logger(Application.name);
  protected DEV_MODE: boolean;
  protected PORT: string;
  private corsOriginList: string[];
  private SWAGGER_USER: string;
  private SWAGGER_PASSWORD: string;

  constructor(protected server: NestExpressApplication) {
    this.server = server;

    if (!process.env.SECRET_KEY) this.logger.error('Set "SECRET" env');
    this.DEV_MODE = process.env.NODE_ENV === 'prod' ? false : true;
    this.PORT = process.env.PORT;
    this.corsOriginList = process.env.CORS_ORIGIN_LIST
      ? process.env.CORS_ORIGIN_LIST.split(',').map((origin) => origin.trim())
      : ['*'];
    this.SWAGGER_USER = process.env.SWAGGER_USER;
    this.SWAGGER_PASSWORD = process.env.SWAGGER_PASSWORD;
  }

  private setUpBasicAuth() {
    this.server.use(
      ['/api/v1/docs', '/api/v1/docs-json'],
      expressBasicAuth({
        challenge: true,
        users: {
          [this.SWAGGER_USER]: this.SWAGGER_PASSWORD,
        },
      }),
    );
  }

  private setUpOpenAPIMidleware() {
    SwaggerModule.setup(
      'api/v1/docs',
      this.server,
      SwaggerModule.createDocument(
        this.server,
        new DocumentBuilder()
          .setTitle('동네가게 CMS API')
          .setDescription('동네가게 CMS API 문서 겸 시뮬레이터')
          .setVersion('1.0.1')
          .addBearerAuth(
            {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
              name: 'JWT',
              description: 'JWT 를 입력하세요.',
              in: 'header',
            },
            'accessToken',
          )
          .build(),
      ),
      { swaggerOptions: { defaultModelsExpandDepth: -1 } },
    );
  }

  private async setUpGlobalMiddleware() {
    this.corsOriginList.push('http://localhost:8080');
    this.corsOriginList.push('http://dev.owner.dngg.kr');
    this.corsOriginList.push('https://dev.owner.dngg.kr');
    this.corsOriginList.push('http://owner.dngg.kr');
    this.corsOriginList.push('https://owner.dngg.kr');
    this.corsOriginList.push('https://cms-admin.run.goorm.io');
    this.server.enableCors({
      origin: this.corsOriginList,
      credentials: true,
    });
    this.server.use(cookieParser());
    //this.setUpBasicAuth();
    this.setUpOpenAPIMidleware();
    this.server.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    this.server.use(passport.initialize());
    this.server.use(passport.session());
    this.server.useGlobalInterceptors(
      new ClassSerializerInterceptor(this.server.get(Reflector)),
    );
    this.server.useGlobalFilters(new HttpApiExceptionFilter());
  }

  async boostrap() {
    await this.setUpGlobalMiddleware();
    await this.server.listen(this.PORT);
  }

  startLog() {
    if (this.DEV_MODE) {
      this.logger.log(`✅ Server on http://localhost:${this.PORT}`);
    } else {
      this.logger.log(`✅ Server on port ${this.PORT}...`);
    }
  }

  errorLog(error: string) {
    this.logger.error(`🆘 Server error ${error}`);
  }
}

async function init(): Promise<void> {
  const server = await NestFactory.create<NestExpressApplication>(AppModule);

  server.useGlobalInterceptors(new LoggingInterceptor());
  server.useGlobalInterceptors(new TransformInterceptor());

  const app = new Application(server);
  await app.boostrap();
  app.startLog();
}

init().catch((error) => {
  new Logger('init').error(error);
});
