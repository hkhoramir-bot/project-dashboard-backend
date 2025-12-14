import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// ... بقیه کد


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // حذف اسلش انتهایی از آدرس Codespace (بسیار مهم)
  const allowedOrigins = [
    'https://automatic-couscous-69q5wq9pv4gq35vj-5174.app.github.dev', // ✅ اصلاح شد (اسلش / آخر حذف شد)
    'http://localhost:5173',
    // آدرس‌های production آینده را اینجا اضافه کنید
  ];

  app.enableCors({
    // استفاده از تابع Callback برای کنترل دقیق مبدأ
    origin: (origin, callback) => {
      // اگر درخواستی از طریق ابزارهایی مانند Postman یا Curl بود (origin=undefined)
      // یا اگر origin در لیست مجاز (allowedOrigins) بود، اجازه دسترسی بده.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // اجازه داده شد
      } else {
        // برای امنیت بیشتر، در کنسول سرور لاگ می‌شود اما به کلاینت نشان داده نمی‌شود
        console.error(`CORS blocked request from origin: ${origin}`);
        callback(new Error(`Not allowed by CORS for origin: ${origin}`)); // اجازه داده نشد
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();