import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(configService.get<number>('PORT'), '0.0.0.0', async () => {
    console.log(`Application is running on: ${await app.getUrl()}`);
  });
}

bootstrap();
