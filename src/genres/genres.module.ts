// src/genres/genre.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
import { Movie } from '../movies/entities/movie.entity';

/**
 * GenresModule is responsible for grouping all genre-related components.
 * 
 * - Imports TypeORM repositories for `Genre` and `Movie`.
 * - Provides `GenresController` for handling HTTP requests.
 * - Provides `GenresService` for handling business logic.
 */
@Module({
	imports: [TypeOrmModule.forFeature([Genre, Movie]),],
	controllers: [GenresController],
	providers: [GenresService],
})
export class GenresModule { }
