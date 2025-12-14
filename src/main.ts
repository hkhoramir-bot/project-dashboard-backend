import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // ایمپورت برای اعتبارسنجی داده‌ها

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // === ۱. تنظیم مسیردهی ===
  // تعریف پیشوند سراسری 'api/v1' برای تمامی مسیرها.
  // این خط برای رفع خطای 404 ضروری است.
  app.setGlobalPrefix('api/v1'); 
  
  // تنظیمات اعتبارسنجی سراسری برای DTOها (مانند RegisterUserDto)
  app.useGlobalPipes(new ValidationPipe({
      whitelist: true, // فقط فیلدهای تعریف شده در DTO را قبول می‌کند
      transform: true, // اطمینان از تبدیل داده‌های ورودی به نوع صحیح
  }));

  // === ۲. تنظیمات CORS ===
  const allowedOrigins = [
    // آدرس Codespace شما (بدون اسلش انتهایی)
    'https://automatic-couscous-69q5wq9pv4gq35vj-5174.app.github.dev', 
    // آدرس لوکال برای توسعه
    'http://localhost:5174',
    // آدرس فرانت‌اند استقرار یافته (Production) را اینجا اضافه کنید
    // 'https://your-production-frontend.com', 
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // اگر از Postman یا Curl درخواست آمد (origin undefined است) یا در لیست مجاز بود، قبول کن.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); 
      } else {
        console.error(`CORS blocked request from origin: ${origin}`);
        callback(new Error(`Not allowed by CORS for origin: ${origin}`));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // === ۳. شروع گوش دادن سرور ===
  await app.listen(process.env.PORT || 3000);
}
bootstrap();