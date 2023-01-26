import { ApiProperty } from '@nestjs/swagger';

export class DeleteFileRequestDto {
  @ApiProperty({
    example: 'uploads/images/ingredient-1.png',
    description: 'File key in S3',
  })
  key: string;
}
