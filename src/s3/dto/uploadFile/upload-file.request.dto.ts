import { ApiProperty } from '@nestjs/swagger';

export class UploadFileRequestDto {
  @ApiProperty({
    example: 'uploads/images',
    description: 'Folder where the file will be stored',
  })
  folder: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  file: any;
}
