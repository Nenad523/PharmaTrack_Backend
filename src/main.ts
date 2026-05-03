/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filters';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import session from 'express-session';
import passport from 'passport';
import helmet from 'helmet';
import { randomBytes } from 'crypto';

const config = new DocumentBuilder()
  .setTitle('PharmaTrack API')
  .setDescription('API documentation')
  .setVersion('1.0')
  .build();

const ALLOWED_HOSTS = (process.env.ALLOWED_HOSTS || 'api.pharmatrack.me')
  .split(',')
  .map(h => h.trim());

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(helmet());

  // HTTPS redirect with host header validation to prevent open redirect
  if (isProduction) {
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https') {
        
        const host = req.header('host');
        if (!host || !ALLOWED_HOSTS.includes(host)) {
          return res.status(400).json({ error: 'Invalid host header', code: 'INVALID_HOST' });
        }
        return res.redirect(301, `https://${host}${req.url}`);
      }
      next();
    });
  }

  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true
    }),
  );

  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? 'super-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 1800000,
        domain: isProduction ? '.pharmatrack.me' : undefined,
        path: '/',
      },
    }),
  );

  // Generate CSRF token per session
  app.use((req: any, _res: any, next: any) => {
    if (!req.session.csrfToken) {
      req.session.csrfToken = randomBytes(32).toString('hex');
    }
    next();
  });

  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalFilters(new GlobalExceptionFilter());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(Number(process.env.PORT) || 3001, '0.0.0.0');
}

void bootstrap();