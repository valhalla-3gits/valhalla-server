import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  // Set required environment variables for RceEngineService
  process.env.RCE_ENGINE_HOST = 'http://localhost:8080';
  process.env.RCE_TOKEN = 'dummy-token';

  const app = await NestFactory.create(AppModule);

  // Set up Swagger
  const config = new DocumentBuilder()
    .setTitle('Valhalla API')
    .setDescription('The Valhalla API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'bearerAuth',
    )
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Tasks', 'Task management endpoints')
    .addTag('Ranks', 'Rank management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Ensure the docs directory exists
  const docsDir = path.join(process.cwd(), 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  // Write the OpenAPI spec to a file
  fs.writeFileSync(
    path.join(docsDir, 'api-v1.json'),
    JSON.stringify(document, null, 2),
  );

  console.log('OpenAPI specification has been generated at docs/api-v1.json');

  await app.close();
}

bootstrap();
