import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Genre } from "./entities/genre.entity";
import { CreateGenreDto } from "./dto/create-genre.dto";
import { UpdateGenreDto } from "./dto/update-genre.dto";
import { Movie } from "src/movies/entities/movie.entity";

@Injectable()
export class GenresService {
	constructor(
		@InjectRepository(Genre)
		private readonly genreRepository: Repository<Genre>,
		@InjectRepository(Movie)
		private readonly movieRepository: Repository<Movie>,
	) { }

	ListGenres() {
		return this.genreRepository.find();
	}

	ListOneGenre(id: number) {
		return this.genreRepository.findOne({ where: { id } });
	}

	AddGenre(createGenreDto: CreateGenreDto) {
		const genre = this.genreRepository.create(createGenreDto);
		return this.genreRepository.save(genre);
	}

	async UpdateGenre(id: number, updateGenreDto: UpdateGenreDto) {
		const genreToUpdate = await this.genreRepository.findOne({ where: { id } });

		if (!genreToUpdate)
			return null;

		Object.assign(genreToUpdate, updateGenreDto);
		return this.genreRepository.save(genreToUpdate);
	}

	async DeleteGenre(id: number) {
		const genreToDelete = await this.genreRepository.findOne({ where: { id } });

		if (!genreToDelete)
			return null;

		const genreName = genreToDelete.name;
		const allMovies = await this.movieRepository.find();

		for (const movie of allMovies) {
			if (movie.genres.includes(genreName)) {
				movie.genres = movie.genres.filter(g => g !== genreName);
				await this.movieRepository.save(movie)
			}
		}

		return this.genreRepository.remove(genreToDelete);
	}
}