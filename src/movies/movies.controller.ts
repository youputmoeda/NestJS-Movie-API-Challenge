// src/movies/movie.controller.ts
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { MoviesService } from "./movies.service";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";

@ApiTags('Movies')
@Controller('Movies')
export class MoviesController {
	constructor(private readonly moviesService: MoviesService) { }

	/**
	 * List all movies with optional pagination
	 * @param page Optional page number for pagination
	 * @param limit Optional limit of movies per page
	 */
	@ApiOperation({ summary: 'List all movies' })
	@ApiResponse({ status: 200, description: 'Movies retrieved successfully.' })
	@ApiResponse({ status: 400, description: 'Invalid query parameters.' })
	@Get('ListMovies')
	ListMovies(@Query('page') page?: number, @Query('limit') limit?: number) {
		return this.moviesService.ListMovies(page, limit);
	};

	/**
	 * Retrieve a single movie by ID
	 * @param id Movie ID to be retrieved
	 */
	@ApiOperation({ summary: 'List one movie' })
	@ApiResponse({ status: 200, description: 'Movie found successfully.' })
	@ApiResponse({ status: 404, description: 'Movie not found.' })
	@ApiResponse({ status: 400, description: 'Invalid movie ID format.' })
	@Get('ListOneMovie/:id')
	ListOneMovie(@Param('id', ParseIntPipe) id: number) {
		return this.moviesService.ListOneMovie(id);
	};

	/**
	 * Search movies by filters: title, genre, and optional pagination
	 * @param allQueryParams Query parameters for title, genre, page, and limit
	 */
	@ApiOperation({ summary: 'Search movies by filters' })
	@ApiResponse({ status: 200, description: 'Movies retrieved successfully based on filters.' })
	@ApiResponse({ status: 400, description: 'Invalid query parameters.' })
	@Get('SearchMovies')
	SearchMovies(@Query() allQueryParams: { title?: string, genre?: string, page?: number, limit?: number }) {
		return this.moviesService.SearchMovies(allQueryParams.title, allQueryParams.genre);
	};

	/**
	 * Add a new movie to the database
	 * @param createMovieDto Data transfer object containing movie details
	 */
	@ApiOperation({ summary: 'Add a movie to the database' })
	@ApiResponse({ status: 201, description: 'Movie created successfully.' })
	@ApiResponse({ status: 400, description: 'Invalid data in request body.' })
	@Post('AddMovie')
	AddMovie(@Body() createMovieDto: CreateMovieDto) {
		return this.moviesService.AddMovie(createMovieDto);
	};

	/**
	 * Update details of an existing movie
	 * @param id ID of the movie to be updated
	 * @param updateMovieDto Data transfer object containing updated movie details
	 */
	@ApiOperation({ summary: 'Update a movie from database' })
	@ApiResponse({ status: 200, description: 'Movie updated successfully.' })
	@ApiResponse({ status: 404, description: 'Movie not found.' })
	@ApiResponse({ status: 400, description: 'Invalid movie ID or data in request body.' })
	@Patch('UpdateMovie/:id')
	UpdateMovie(@Param('id', ParseIntPipe) id: number, @Body() updateMovieDto: UpdateMovieDto) {
		return this.moviesService.UpdateMovie(id, updateMovieDto);
	}

	/**
	 * Delete a movie from the database
	 * @param id ID of the movie to be deleted
	 */
	@ApiOperation({ summary: 'Delete a movie from database' })
	@ApiResponse({ status: 200, description: 'Movie deleted successfully.' })
	@ApiResponse({ status: 404, description: 'Movie not found.' })
	@ApiResponse({ status: 400, description: 'Invalid movie ID format.' })
	@Delete('DeleteMovie/:id')
	DeleteMovie(@Param('id', ParseIntPipe) id: number) {
		return this.moviesService.DeleteMovie(id);
	}
}