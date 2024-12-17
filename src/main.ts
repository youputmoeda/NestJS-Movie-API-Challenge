import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

/**
 * Bootstrap function to initialize the NestJS application.
 *
 * @async
 * @function bootstrap
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Global Validation Pipe
   *
   * Applies the `ValidationPipe` globally to validate incoming requests
   * based on DTOs (Data Transfer Objects) with class-validator decorators.
   *
   * Features:
   * - Automatic validation of request payloads
   * - Strips out properties that do not have decorators (whitelisting)
   * - Returns detailed error responses if validation fails
   */
  app.useGlobalPipes(new ValidationPipe());

  /**
   * Swagger Configuration
   *
   * Configures Swagger to generate and serve API documentation.
   * - Title: 'NestJS Movie API'
   * - Description: Describes the endpoints for managing movies and genres.
   * - Version: 1.0
   *
   * The Swagger documentation will be available at `/api`.
   */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Movie API')
    .setDescription('REST API for Movies and Genres')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  /**
  * Start the application on the specified PORT.
  *
  * - The default port is 3000 if the `PORT` environment variable is not set.
  */
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
