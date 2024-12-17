import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Movie } from "./entities/movie.entity";
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
	constructor(
		@InjectRepository(Movie)
		private readonly movieRepository: Repository<Movie>,
	) { }

	ListMovies() {
		return this.movieRepository.find();
	}

	AddMovie(createMovieDto: CreateMovieDto) {
		const movie = this.movieRepository.create(createMovieDto);
		return this.movieRepository.save(movie);
	}
}