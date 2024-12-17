// src/movies/movie.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Movie } from "./entities/movie.entity";
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from "./dto/update-movie.dto";

@Injectable()
export class MoviesService {
	constructor(
		@InjectRepository(Movie)
		private readonly movieRepository: Repository<Movie>,
	) { }

	ListMovies(page = 1, limit = 10) {
		const skip = (page - 1) * limit;
		return this.movieRepository.createQueryBuilder('movie')
			.skip(skip)
			.take(limit)
			.getMany();
	}

	ListOneMovie(id: number) {
		return this.movieRepository.findOne({ where: { id } });
	}

	async SearchMovies(title?: string, genre?: string, page = 1, limit = 10) {
		const queryDbContext = this.movieRepository.createQueryBuilder('movie');

		if (title) {
			queryDbContext.where('LOWER(movie.title) LIKE :title', {
				title: `%${title.toLowerCase()}`
			});
		}

		if (genre) {
			title ?
				queryDbContext.andWhere("CONCAT(',', movie.genres, ',') LIKE :pattern", {
					pattern: `%,${genre},%`
				})
				:
				queryDbContext.where("CONCAT(',', movie.genres, ',') LIKE :pattern", {
					pattern: `%,${genre},%`
				})
		}

		const skip = (page - 1) * limit;

		queryDbContext.take(limit)
		queryDbContext.skip(skip);

		return queryDbContext.getMany();
	}

	AddMovie(createMovieDto: CreateMovieDto) {
		const movie = this.movieRepository.create(createMovieDto);
		return this.movieRepository.save(movie);
	}

	async UpdateMovie(id: number, updateMovieDto: UpdateMovieDto) {
		const movieToUpdate = await this.ListOneMovie(id);

		if (!movieToUpdate)
			return null;

		Object.assign(movieToUpdate, updateMovieDto);
		return this.movieRepository.save(movieToUpdate);
	}

	async DeleteMovie(id: number) {
		const movieToDelete = await this.ListOneMovie(id);

		if (!movieToDelete)
			return null;

		return this.movieRepository.remove(movieToDelete);
	}
}