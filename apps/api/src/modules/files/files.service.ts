import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PrismaService } from '../../prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class FilesService {
  private s3: S3Client;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.s3 = new S3Client({
      endpoint: config.get('S3_ENDPOINT'),
      region: config.get('S3_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: config.get('S3_ACCESS_KEY', ''),
        secretAccessKey: config.get('S3_SECRET_KEY', ''),
      },
      forcePathStyle: true,
    });
  }

  async getUploadUrl(userId: string, filename: string, mimeType: string, projectId?: string) {
    const key = `uploads/${projectId ?? 'general'}/${randomUUID()}-${filename}`;
    const bucket = this.config.get('S3_BUCKET', 'shirkat-gah');

    const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: mimeType });
    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 3600 });

    const file = await this.prisma.file.create({
      data: {
        name: filename,
        originalName: filename,
        mimeType,
        size: 0,
        url: `${this.config.get('S3_PUBLIC_URL')}/${key}`,
        key,
        projectId,
        uploadedBy: userId,
        status: 'UPLOADING',
      },
    });

    return { uploadUrl, fileId: file.id, key };
  }

  async confirmUpload(fileId: string, size: number) {
    return this.prisma.file.update({
      where: { id: fileId },
      data: { size, status: 'ACTIVE' },
    });
  }

  async getDownloadUrl(fileId: string) {
    const file = await this.prisma.file.findUnique({ where: { id: fileId } });
    if (!file) throw new Error('File not found');

    const command = new GetObjectCommand({
      Bucket: this.config.get('S3_BUCKET'),
      Key: file.key,
    });
    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });

    await this.prisma.file.update({
      where: { id: fileId },
      data: { downloadCount: { increment: 1 } },
    });

    return { url, file };
  }

  async listFiles(query: { projectId?: string; page?: number; limit?: number }) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const where = { status: 'ACTIVE' as const, ...(query.projectId && { projectId: query.projectId }) };

    const [data, total] = await Promise.all([
      this.prisma.file.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { uploader: { select: { firstName: true, lastName: true } } },
      }),
      this.prisma.file.count({ where }),
    ]);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}
