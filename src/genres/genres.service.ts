// src/genres/genre.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Genre } from "./entities/genre.entity";
import { CreateGenreDto } from "./dto/create-genre.dto";
import { UpdateGenreDto } from "./dto/update-genre.dto";
import { Movie } from "../movies/entities/movie.entity";

/**
 * Service responsible for handling Genre operations.
 * 
 * This service interacts with the Genre and Movie repositories to:
 * - List genres
 * - Retrieve a single genre
 * - Add a new genre
 * - Update an existing genre
 * - Delete a genre and clean up associated movies
 */
@Injectable()
export class GenresService {
	/**
	 * @param genreRepository - Injected repository for Genre entity.
	 * @param movieRepository - Injected repository for Movie entity.
	 */
	constructor(
		@InjectRepository(Genre)
		private readonly genreRepository: Repository<Genre>,
		@InjectRepository(Movie)
		private readonly movieRepository: Repository<Movie>,
	) { }

	/**
	 * Retrieves a list of all genres from the database.
	 * 
	 * @returns A promise that resolves to an array of genres.
	 * @example
	 * const genres = await genresService.ListGenres();
	 * console.log(genres); // [{ id: 1, name: 'Action' }, { id: 2, name: 'Comedy' }]
	 */
	ListGenres() {
		return this.genreRepository.find();
	}

	/**
	 * Retrieves a single genre based on its ID.
	 * 
	 * @param id - The ID of the genre to retrieve.
	 * @returns A promise that resolves to the genre object or `null` if not found.
	 * @example
	 * const genre = await genresService.ListOneGenre(1);
	 * console.log(genre); // { id: 1, name: 'Action' }
	 */
	ListOneGenre(id: number) {
		return this.genreRepository.findOne({ where: { id } });
	}

	/**
	 * Adds a new genre to the database.
	 * 
	 * @param createGenreDto - Data transfer object containing the genre details.
	 * @returns A promise that resolves to the saved genre object.
	 * @example
	 * const newGenre = { name: 'Horror' };
	 * const result = await genresService.AddGenre(newGenre);
	 * console.log(result); // { id: 3, name: 'Horror' }
	 */
	AddGenre(createGenreDto: CreateGenreDto) {
		const genre = this.genreRepository.create(createGenreDto);
		return this.genreRepository.save(genre);
	}

	/**
	 * Updates an existing genre in the database.
	 * 
	 * @param id - The ID of the genre to update.
	 * @param updateGenreDto - Data transfer object containing the updated genre details.
	 * @returns A promise that resolves to the updated genre object or `null` if not found.
	 * @example
	 * const updateGenreDto = { name: 'Adventure' };
	 * const result = await genresService.UpdateGenre(1, updateGenreDto);
	 * console.log(result); // { id: 1, name: 'Adventure' }
	 */
	async UpdateGenre(id: number, updateGenreDto: UpdateGenreDto) {
		const genreToUpdate = await this.genreRepository.findOne({ where: { id } });

		if (!genreToUpdate)
			return null;

		Object.assign(genreToUpdate, updateGenreDto);
		return this.genreRepository.save(genreToUpdate);
	}

	/**
	 * Deletes a genre and removes it from all associated movies.
	 * 
	 * @param id - The ID of the genre to delete.
	 * @returns A promise that resolves to the deleted genre object or `null` if not found.
	 * @example
	 * const deletedGenre = await genresService.DeleteGenre(2);
	 * console.log(deletedGenre); // { id: 2, name: 'Comedy' }
	 */
	async DeleteGenre(id: number) {
		const genreToDelete = await this.genreRepository.findOne({ where: { id } });

		if (!genreToDelete)
			return null;

		const genreName = genreToDelete.name;

		// Retrieve all movies to clean up genres
		const allMovies = await this.movieRepository.find();

		for (const movie of allMovies) {
			// If a movie contains the genre to delete, remove it from the genres list
			if (movie.genres.includes(genreName)) {
				movie.genres = movie.genres.filter(g => g !== genreName);
				await this.movieRepository.save(movie)
			}
		}

		return this.genreRepository.remove(genreToDelete);
	}
}