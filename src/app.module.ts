import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION } from './config/configuration';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/${process.env.NODE_ENV}.env`,
      isGlobal: true,
      load: [CONFIGURATION],
    }),
    S3Module,
  ],
})
export class AppModule {}
