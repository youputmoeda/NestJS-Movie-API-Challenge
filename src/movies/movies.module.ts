// src/movies/movies.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

/**
 * Module responsible for managing movies.
 * 
 * This module includes:
 * - TypeORM integration for the Movie entity.
 * - MoviesController for handling HTTP requests.
 * - MoviesService for business logic and database interactions.
 */
@Module({
	imports: [TypeOrmModule.forFeature([Movie])], // Imports TypeORM feature for Movie entity
	controllers: [MoviesController], // Registers the MoviesController
	providers: [MoviesService], // Registers the MoviesService
})
export class MoviesModule { }
