import { ApiProperty } from '@nestjs/swagger';

export class DeleteFileResponseDto {
  @ApiProperty({
    example: 'File deleted',
    description: 'Success message after deleting a file',
  })
  message: string;
}
