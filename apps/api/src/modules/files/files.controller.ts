import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { User } from '../../common/decorators/user.decorator';

@ApiTags('files')
@Controller('files')
@ApiBearerAuth()
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post('upload-url')
  @ApiOperation({ summary: 'Get presigned upload URL' })
  getUploadUrl(
    @User('sub') userId: string,
    @Body() body: { filename: string; mimeType: string; projectId?: string },
  ) {
    return this.filesService.getUploadUrl(userId, body.filename, body.mimeType, body.projectId);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm file upload completion' })
  confirmUpload(@Param('id') id: string, @Body() body: { size: number }) {
    return this.filesService.confirmUpload(id, body.size);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Get presigned download URL' })
  getDownloadUrl(@Param('id') id: string) {
    return this.filesService.getDownloadUrl(id);
  }

  @Get()
  @ApiOperation({ summary: 'List files' })
  listFiles(
    @Query('projectId') projectId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.filesService.listFiles({ projectId, page, limit });
  }
}
