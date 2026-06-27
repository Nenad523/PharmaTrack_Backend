/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filters';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import session from 'express-session';
import MySQLStoreFactory from 'express-mysql-session';
import passport from 'passport';
import helmet from 'helmet';
import { randomBytes } from 'crypto' ;

const config = new DocumentBuilder()
  .setTitle('PharmaTrack API')
  .setDescription('API documentation')
  .setVersion('1.0')
  .addApiKey({ type: 'apiKey', in: 'header', name: 'X-CSRF-Token' }, 'csrf-token')
  .addSecurityRequirements('csrf-token')
  .build();

const ALLOWED_HOSTS = (process.env.ALLOWED_HOSTS || 'api.pharmatrack.me')
  .split(',')
  .map(h => h.trim());

function isLocalOrigin(origin: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
}

function isPrivateNetworkHost(hostname: string): boolean {
  return (
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
    /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(hostname)
  );
}

function isPrivateNetworkOrigin(origin: string): boolean {
  try {
    const parsedOrigin = new URL(origin);
    return parsedOrigin.protocol === 'http:' && isPrivateNetworkHost(parsedOrigin.hostname);
  } catch {
    return false;
  }
}

function isDevelopmentOrigin(origin: string): boolean {
  return isLocalOrigin(origin) || isPrivateNetworkOrigin(origin);
}

function parseBooleanEnv(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() === 'true';
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const isProduction = process.env.NODE_ENV === 'production';

  // Railway (and most cloud platforms) terminate SSL at the edge and forward
  // requests internally as HTTP. Without this, req.secure = false and
  // express-session won't send the Set-Cookie header when secure: true.
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];
  const hasRemoteOrigins = allowedOrigins.some((origin) => !isDevelopmentOrigin(origin));
  const sessionCookieSecure = parseBooleanEnv(
    process.env.SESSION_COOKIE_SECURE,
    isProduction || hasRemoteOrigins,
  );
  const sessionCookieSameSite = (process.env.SESSION_COOKIE_SAMESITE ??
    (sessionCookieSecure ? 'none' : 'lax')) as 'lax' | 'none' | 'strict';

  if (isProduction || sessionCookieSecure) {
    app.getHttpAdapter().getInstance().set('trust proxy', 1);
  }

  app.use(helmet());

  // HTTPS redirect with host header validation to prevent open redirect
  if (isProduction) {
    const allowedPaths = ['/api/v1/', '/swagger']; // Whitelist safe paths

app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
        const host = req.header('host');
        
        if (!host || !ALLOWED_HOSTS.includes(host)) {
          return res.status(400).json({ error: 'Invalid host header', code: 'INVALID_HOST' });
        }
        
        // Only redirect safe paths, reject query strings with suspicious patterns
        const path = req.path;
        if (!allowedPaths.some(allowed => path.startsWith(allowed))) {
          return res.status(400).json({ error: 'Invalid request path' });
        }
        
        // Reconstruct URL safely without user-controlled parts
        const safeUrl = `https://${host}${path}`;
        
        // Additional validation: reject URLs with @ or encoded characters
        if (safeUrl.includes('@') || /%/.test(decodeURIComponent(req.url))) {
          return res.status(400).json({ error: 'Invalid URL format' });
        }
        
        return res.redirect(301, safeUrl);
      }

      next();
    });
  }

  app.enableCors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        (!isProduction && isDevelopmentOrigin(origin))
      ) {
        callback(null, true);
        return;
      }

      callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
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

  const MySQLStore = MySQLStoreFactory(session);
  const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 1800000,
    createDatabaseTable: true,
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? 'super-secret',
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        httpOnly: true,
        secure: sessionCookieSecure,
        sameSite: sessionCookieSameSite,
        maxAge: 1800000,
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
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      withCredentials: true,
    },
  });

  await app.listen(Number(process.env.PORT) || 3001, '0.0.0.0');
}

void bootstrap();
