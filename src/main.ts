import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // === ۱. تنظیم پیشوند سراسری API ===
  app.setGlobalPrefix('api/v1');

  // === ۲. تنظیم اعتبارسنجی جهانی DTOها ===
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // فقط فیلدهای تعریف شده در DTO پذیرفته می‌شوند
      transform: true, // تبدیل داده‌های ورودی به نوع صحیح
    }),
  );

  // === ۳. تنظیمات CORS ===
  const allowedOrigins = [
    'https://automatic-couscous-69q5wq9pv4gq35vj-5173.app.github.dev', // Codespace
    'http://localhost:5173', // لوکال
    // 'https://your-production-frontend.com', // در صورت استقرار پرو덕شن
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // اگر origin undefined باشد (مثلاً Postman) یا در لیست مجاز باشد، قبول کن
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS blocked request from origin: ${origin}`);
        callback(new Error(`Not allowed by CORS for origin: ${origin}`));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // برای ارسال کوکی یا authorization
  });

  // === ۴. شروع سرور روی پورت Render یا پیش‌فرض 3000 ===
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  await app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

bootstrap();
