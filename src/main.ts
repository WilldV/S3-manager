import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { API_KEY_HEADER } from './common/const';
import { AllExceptionsFilter } from './exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const configService = app.get(ConfigService);

  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('S3 Manager')
    .setVersion('1.0')
    .setDescription(
      'API to manage basic interaction with an [S3](https://aws.amazon.com/s3) Bucket. Build with [NestJS](https://nestjs.com) for practice purpose and reuse in another projects. [Source code](https://github.com/WilldV/S3-manager)',
    )
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: API_KEY_HEADER,
        description: 'Defined API KEY',
      },
      API_KEY_HEADER,
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document, {
    customSiteTitle: 'S3 Manager',
  });

  await app.listen(configService.get<number>('PORT'), '0.0.0.0', async () => {
    console.log(`Application is running on: ${await app.getUrl()}`);
  });
}

bootstrap();
