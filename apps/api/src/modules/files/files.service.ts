import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PrismaService } from '../../prisma/prisma.service';
import { randomUUID } from 'crypto';
import type {
  UploadUrlResponse,
  FileRecordItem,
  DownloadUrlResponse,
  PaginatedResponse,
  FileListItem,
} from '../../common/types';

export interface FileListQuery {
  projectId?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class FilesService {
  private s3: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    const endpoint = config.get('S3_ENDPOINT');

    this.bucket = config.get('S3_BUCKET', 'shirkat-gah');
    this.publicUrl =
      config.get('CDN_URL') ||
      config.get('S3_PUBLIC_URL') ||
      `https://${this.bucket}.s3.${config.get('S3_REGION', 'ap-south-1')}.amazonaws.com`;

    this.s3 = new S3Client({
      region: config.get('S3_REGION', 'ap-south-1'),
      ...(endpoint && {
        endpoint,
        forcePathStyle: true,
        credentials: {
          accessKeyId: config.get('S3_ACCESS_KEY', ''),
          secretAccessKey: config.get('S3_SECRET_KEY', ''),
        },
      }),
    });
  }

  private mapFile(file: {
    id: string;
    name: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    key: string;
    folderId: string | null;
    projectId: string | null;
    dataEntryId: string | null;
    uploadedBy: string;
    status: string;
    version: number;
    movTags: string[];
    metadata: unknown;
    downloadCount: number;
    createdAt: Date;
    updatedAt: Date;
  }): FileRecordItem {
    return {
      id: file.id,
      name: file.name,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      url: file.url,
      key: file.key,
      folderId: file.folderId,
      projectId: file.projectId,
      dataEntryId: file.dataEntryId,
      uploadedBy: file.uploadedBy,
      status: file.status,
      version: file.version,
      movTags: file.movTags,
      metadata: file.metadata,
      downloadCount: file.downloadCount,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    };
  }

  async getUploadUrl(
    userId: string,
    filename: string,
    mimeType: string,
    projectId?: string,
  ): Promise<UploadUrlResponse> {
    const key = `uploads/${projectId ?? 'general'}/${randomUUID()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: mimeType,
      ServerSideEncryption: 'AES256',
    });
    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 3600 });

    const file = await this.prisma.file.create({
      data: {
        name: filename,
        originalName: filename,
        mimeType,
        size: 0,
        url: `${this.publicUrl}/${key}`,
        key,
        projectId,
        uploadedBy: userId,
        status: 'UPLOADING',
      },
    });

    return { uploadUrl, fileId: file.id, key };
  }

  async confirmUpload(fileId: string, size: number): Promise<FileRecordItem> {
    const file = await this.prisma.file.update({
      where: { id: fileId },
      data: { size, status: 'ACTIVE' },
    });
    return this.mapFile(file);
  }

  async getDownloadUrl(fileId: string): Promise<DownloadUrlResponse> {
    const file = await this.prisma.file.findUnique({ where: { id: fileId } });
    if (!file) throw new NotFoundException('File not found');

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: file.key,
    });
    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });

    await this.prisma.file.update({
      where: { id: fileId },
      data: { downloadCount: { increment: 1 } },
    });

    return { url, file: this.mapFile(file) };
  }

  async listFiles(query: FileListQuery): Promise<PaginatedResponse<FileListItem>> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const where = { status: 'ACTIVE' as const, ...(query.projectId && { projectId: query.projectId }) };

    const [rows, total] = await Promise.all([
      this.prisma.file.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { uploader: { select: { firstName: true, lastName: true } } },
      }),
      this.prisma.file.count({ where }),
    ]);

    const data: FileListItem[] = rows.map((f) => ({
      ...this.mapFile(f),
      uploader: f.uploader,
    }));

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}
