import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import compression from 'compression';
import helmet from 'helmet';
import type { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';

const logger = new Logger('Bootstrap');

function resolvePort(config: ConfigService): number {
  const apiPort = config.get<string>('API_PORT');
  const port = config.get<string>('PORT');
  const parsed = Number(apiPort ?? port);
  if (!Number.isNaN(parsed) && parsed > 0) return parsed;
  return process.env.NODE_ENV === 'production' ? 3001 : 4000;
}

function registerProcessHandlers(app: Awaited<ReturnType<typeof NestFactory.create>>): void {
  process.on('uncaughtException', (error: Error) => {
    logger.error(`Uncaught exception: ${error.message}`, error.stack);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: unknown) => {
    logger.error(`Unhandled rejection: ${String(reason)}`);
  });

  const shutdown = async (signal: string) => {
    logger.log(`Received ${signal}, shutting down gracefully...`);
    try {
      await app.close();
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown', error instanceof Error ? error.stack : String(error));
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production'
      ? ['error', 'warn', 'log']
      : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  registerProcessHandlers(app);
  app.enableShutdownHooks();

  const config = app.get(ConfigService);
  const expressApp = app.getHttpAdapter().getInstance();

  // Root health (no auth, no prefix) — used by load balancers / PM2 probes
  expressApp.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use(helmet());
  app.use(compression());
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      logger.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
    });
    next();
  });

  const corsOrigins = config.get<string>('CORS_ORIGINS', '');
  const allowedOrigins = [
    config.get('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
    'http://localhost:3000',
    ...corsOrigins.split(',').map((o) => o.trim()).filter(Boolean),
  ];

  const isAllowedOrigin = (origin: string | undefined): boolean => {
    if (!origin) return true;
    if (allowedOrigins.includes(origin)) return true;
    if (origin.endsWith('.vercel.app')) return true;
    return false;
  };

  app.enableCors({
    origin: (origin, callback) => {
      callback(null, isAllowedOrigin(origin));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    maxAge: 86400,
  });

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Shirkat Gah Platform API')
    .setDescription('Enterprise digital platform API for Shirkat Gah')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const host = config.get<string>('API_HOST', '0.0.0.0');
  const port = resolvePort(config);

  await app.listen(port, host);
  logger.log(`Shirkat Gah API listening on http://${host}:${port}`);
  logger.log(`Health: http://${host}:${port}/health`);
  logger.log(`API health: http://${host}:${port}/api/health`);
  logger.log(`Swagger: http://${host}:${port}/api/docs`);
}

bootstrap().catch((error: unknown) => {
  logger.error('Failed to start application', error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
