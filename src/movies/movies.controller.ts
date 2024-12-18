// src/movies/movie.controller.ts
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { MoviesService } from "./movies.service";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { Movie } from "./entities/movie.entity";

@ApiTags('Movies')
@Controller('Movies')
export class MoviesController {
	constructor(private readonly moviesService: MoviesService) { }

	/**
	 * List all movies with optional pagination
	 * @param page Optional page number for pagination
	 * @param limit Optional limit of movies per page
	 * @returns {Promise<Movie[]>} A promise resolving to an array of movies.
	 */
	@ApiOperation({ summary: 'List all movies' })
	@ApiResponse({ status: 200, description: 'Movies retrieved successfully.' })
	@ApiResponse({ status: 400, description: 'Invalid query parameters.' })
	@Get('ListMovies')
	ListMovies(@Query('page') page?: number, @Query('limit') limit?: number): Promise<Movie[]> {
		return this.moviesService.ListMovies(page, limit);
	};

	/**
	 * Retrieve a single movie by ID
	 * @param id Movie ID to be retrieved
	 * @returns {Promise<Movie | null>} A promise resolving to the movie or null if not found.
	 */
	@ApiOperation({ summary: 'List one movie' })
	@ApiResponse({ status: 200, description: 'Movie found successfully.' })
	@ApiResponse({ status: 404, description: 'Movie not found.' })
	@ApiResponse({ status: 400, description: 'Invalid movie ID format.' })
	@Get('ListOneMovie/:id')
	ListOneMovie(@Param('id', ParseIntPipe) id: number): Promise<Movie | null> {
		return this.moviesService.ListOneMovie(id);
	};

	/**
	 * Search movies by filters: title, genre, and optional pagination
	 * @param allQueryParams Query parameters for title, genre, page, and limit
	 * @returns {Promise<Movie[]>} A promise resolving to an array of movies matching the filters.
	 */
	@ApiOperation({ summary: 'Search movies by filters' })
	@ApiResponse({ status: 200, description: 'Movies retrieved successfully based on filters.' })
	@ApiResponse({ status: 400, description: 'Invalid query parameters.' })
	@Get('SearchMovies')
	SearchMovies(@Query() allQueryParams: { title?: string, genre?: string, page?: number, limit?: number }): Promise<Movie[]> {
		return this.moviesService.SearchMovies(allQueryParams.title, allQueryParams.genre);
	};

	/**
	 * Add a new movie to the database
	 * @param createMovieDto Data transfer object containing movie details
	 * @returns {Promise<Movie>} A promise resolving to the created movie.
	 */
	@ApiOperation({ summary: 'Add a movie to the database' })
	@ApiResponse({ status: 201, description: 'Movie created successfully.' })
	@ApiResponse({ status: 400, description: 'Invalid data in request body.' })
	@Post('AddMovie')
	AddMovie(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
		return this.moviesService.AddMovie(createMovieDto);
	};

	/**
	 * Endpoint to add multiple movies to the database.
	 * 
	 * @param {CreateMovieDto[]} createMoviesDto - Array of movie details to be added.
	 * @returns {Promise<Movie[]>} A promise resolving to an array of the created movies.
	 */
	@ApiOperation({ summary: 'Add multiple movies to the database' })
	@ApiResponse({ status: 201, description: 'Movies created successfully.' })
	@ApiResponse({ status: 400, description: 'Invalid data in the request body.' })
	@Post('AddMultipleMovies')
	AddMultipleMovies(@Body() createMoviesDto: CreateMovieDto[]): Promise<Movie[]> {
		return this.moviesService.AddMultipleMovies(createMoviesDto);
	};

	/**
	 * Update details of an existing movie
	 * @param id ID of the movie to be updated
	 * @param updateMovieDto Data transfer object containing updated movie details
	 * @returns {Promise<Movie>} A promise resolving to the updated movie.
	 */
	@ApiOperation({ summary: 'Update a movie from database' })
	@ApiResponse({ status: 200, description: 'Movie updated successfully.' })
	@ApiResponse({ status: 404, description: 'Movie not found.' })
	@ApiResponse({ status: 400, description: 'Invalid movie ID or data in request body.' })
	@Patch('UpdateMovie/:id')
	UpdateMovie(@Param('id', ParseIntPipe) id: number, @Body() updateMovieDto: UpdateMovieDto): Promise<Movie> {
		return this.moviesService.UpdateMovie(id, updateMovieDto);
	}

	/**
	 * Delete a movie from the database
	 * @param id ID of the movie to be deleted
	 * @returns {Promise<Movie>} A promise resolving once the movie is deleted.
	 */
	@ApiOperation({ summary: 'Delete a movie from database' })
	@ApiResponse({ status: 200, description: 'Movie deleted successfully.' })
	@ApiResponse({ status: 404, description: 'Movie not found.' })
	@ApiResponse({ status: 400, description: 'Invalid movie ID format.' })
	@Delete('DeleteMovie/:id')
	DeleteMovie(@Param('id', ParseIntPipe) id: number): Promise<Movie> {
		return this.moviesService.DeleteMovie(id);
	}
}