// src/movies/movies.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
import { Movie } from 'src/movies/entities/movie.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Genre, Movie]),],
	controllers: [GenresController],
	providers: [GenresService],
})
export class GenresModule { }
