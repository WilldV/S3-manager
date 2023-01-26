import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {
  @ApiProperty({
    example: 'uploads/images/ingredient-1.png',
    description: 'File key in S3',
  })
  key: string;

  @ApiProperty({
    example:
      'https://YOUR_BUCKET.s3.amazonaws.com/uploads/images/ingredient-1.png',
    description:
      'File URL in S3 or CloudFront. Configured S3_URL in .env + key',
  })
  fileUrl: string;
}
