import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as Minio from 'minio';
import { randomUUID } from 'crypto';
import * as path from 'path';

const BUCKET = 'bellat-products';
// MinIO public endpoint — update MINIO_ENDPOINT env var in production (e.g. your S3 URL)
const ENDPOINT = process.env.MINIO_ENDPOINT ?? 'localhost';
const PORT = Number(process.env.MINIO_PORT ?? 9000);
const ACCESS_KEY = process.env.MINIO_ACCESS_KEY ?? 'minioadmin';
const SECRET_KEY = process.env.MINIO_SECRET_KEY ?? 'minioadmin';

@Injectable()
export class UploadService implements OnModuleInit {
  private readonly logger = new Logger(UploadService.name);
  private readonly client = new Minio.Client({
    endPoint: ENDPOINT,
    port: PORT,
    useSSL: false,
    accessKey: ACCESS_KEY,
    secretKey: SECRET_KEY,
  });

  async onModuleInit() {
    try {
      const exists = await this.client.bucketExists(BUCKET);
      if (!exists) {
        await this.client.makeBucket(BUCKET);
        // Set public read policy so uploaded images are accessible without auth
        const policy = JSON.stringify({
          Version: '2012-10-17',
          Statement: [{
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${BUCKET}/*`],
          }],
        });
        await this.client.setBucketPolicy(BUCKET, policy);
        this.logger.log(`Bucket "${BUCKET}" created with public read policy`);
      }
    } catch (err) {
      // Log but don't crash — uploads will fail gracefully if MinIO is unavailable
      this.logger.warn(`MinIO init failed: ${err instanceof Error ? err.message : err}`);
    }
  }

  async uploadImage(buffer: Buffer, originalName: string, mimeType: string): Promise<string> {
    const ext = path.extname(originalName) || '.jpg';
    const filename = `products/${randomUUID()}${ext}`;

    await this.client.putObject(BUCKET, filename, buffer, buffer.length, {
      'Content-Type': mimeType,
    });

    return `http://${ENDPOINT}:${PORT}/${BUCKET}/${filename}`;
  }
}
