// src/movies/movie.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Movie } from "./entities/movie.entity";
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { MovieNotFoundException } from "./exceptions/movie-not-found.exception";

/**
 * Service responsible for managing movie-related operations.
 * Provides methods for listing, searching, creating, updating, and deleting movies.
 */
@Injectable()
export class MoviesService {
	constructor(
		@InjectRepository(Movie)
		private readonly movieRepository: Repository<Movie>,
	) { }

	/**
	 * Retrieves a paginated list of movies.
	 * 
	 * @param {number} page - The page number for pagination (default is 1).
	 * @param {number} limit - The number of items per page (default is 10).
	 * @returns {Promise<Movie[]>} A list of movies within the specified page.
	 */
	async ListMovies(page = 1, limit = 10) {
		const skip = (page - 1) * limit;
		return await this.movieRepository.createQueryBuilder('movie')
			.skip(skip)
			.take(limit)
			.getMany();
	}

	/**
	 * Retrieves a specific movie by its ID.
	 * 
	 * @param {number} id - The unique identifier of the movie.
	 * @returns {Promise<Movie>} The movie with the specified ID.
	 * @throws {Error} If the provided ID is negative.
	 * @throws {MovieNotFoundException} If no movie is found with the given ID.
	 */
	async ListOneMovie(id: number) {
		if (id < 0)
			throw new Error("Id can't be negative");

		const movie = await this.movieRepository.findOne({ where: { id } });
		if (!movie) {
			throw new MovieNotFoundException(id);
		}
		return movie;
	}

	/**
	 * Searches for movies based on title, genre, and pagination.
	 * 
	 * @param {string} [title] - The partial or full title of the movie to search for.
	 * @param {string} [genre] - The genre to filter the movies.
	 * @param {number} page - The page number for pagination (default is 1).
	 * @param {number} limit - The number of items per page (default is 10).
	 * @returns {Promise<Movie[]>} A list of movies matching the search criteria.
	 * @throws {Error} If pagination parameters are invalid (page or limit <= 0).
	 */
	async SearchMovies(title?: string, genre?: string, page = 1, limit = 10) {
		if (page <= 0 || limit <= 0) {
			throw new Error('Invalid pagination parameters');
		}

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

	/**
	 * Adds a new movie to the database.
	 * 
	 * @param {CreateMovieDto} createMovieDto - The data transfer object containing movie details.
	 * @returns {Promise<Movie>} The newly created movie.
	 * @throws {Error} If required movie fields are missing.
	 */
	async AddMovie(createMovieDto: CreateMovieDto) {
		if (!createMovieDto.title || !createMovieDto.description || !createMovieDto.releaseDate) {
			throw new Error('Invalid data');
		}

		const movie = this.movieRepository.create(createMovieDto);
		return await this.movieRepository.save(movie);
	}

	/**
	 * Updates an existing movie's details.
	 * 
	 * @param {number} id - The unique identifier of the movie to update.
	 * @param {UpdateMovieDto} updateMovieDto - The data transfer object containing updated movie details.
	 * @returns {Promise<Movie>} The updated movie details.
	 * @throws {Error} If the provided ID is negative.
	 * @throws {MovieNotFoundException} If no movie is found with the given ID.
	 */
	async UpdateMovie(id: number, updateMovieDto: UpdateMovieDto) {
		if (id < 0)
			throw new Error("Id can't be negative");

		const movieToUpdate = await this.ListOneMovie(id);

		if (!movieToUpdate)
			throw new MovieNotFoundException(id);

		Object.assign(movieToUpdate, updateMovieDto);
		return this.movieRepository.save(movieToUpdate);
	}

	/**
	 * Deletes a movie from the database.
	 * 
	 * @param {number} id - The unique identifier of the movie to delete.
	 * @returns {Promise<Movie>} The deleted movie details.
	 * @throws {Error} If the provided ID is negative.
	 * @throws {NotFoundException} If no movie is found with the given ID.
	 */
	async DeleteMovie(id: number) {
		if (id < 0)
			throw new Error("Id can't be negative");

		const movieToDelete = await this.ListOneMovie(id);

		if (!movieToDelete)
			throw new NotFoundException(id);

		return this.movieRepository.remove(movieToDelete);
	}
}