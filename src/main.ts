import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // global endpoints prefix
  app.setGlobalPrefix('api/v1');
  // handle all user input validation globally
  // app.useGlobalPipes(new ValidateInputPipe());
  const config = new DocumentBuilder()
    .setTitle('Valhalla API')
    .setDescription('The Valhalla API description')
    .setVersion('1.0')
    // .addTag('')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('openapi', app, documentFactory);
  await app.listen(3000);
}

bootstrap();
