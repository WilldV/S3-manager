import { ApiProperty } from '@nestjs/swagger';

export class GetBucketURLResponseDto {
  @ApiProperty({
    example: 'https://YOUR_BUCKET.s3.amazonaws.com',
    description: 'Base URL of the S3 bucket to access files',
  })
  bucketUrl: string;
}
