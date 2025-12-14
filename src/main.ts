async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
'https://automatic-couscous-69q5wq9pv4gq35vj-5173.app.github.dev', 
    'http://localhost:5173',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // اگر در لیست مجاز بود یا درخواستی از طریق ابزارهایی مانند Postman بود (که origin ندارند)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}