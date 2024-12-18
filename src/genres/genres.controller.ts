// src/genres/genre.controller.ts
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GenresService } from "./genres.service";
import { CreateGenreDto } from "./dto/create-genre.dto";
import { UpdateGenreDto } from "./dto/update-genre.dto";
import { Genre } from "./entities/genre.entity";

@ApiTags('Genres')
@Controller('Genres')
export class GenresController {
	constructor(private readonly genresService: GenresService) { }

	/**
	 * List all genres in the database
	 * @returns {Promise<Genre[]>} A promise resolving to an array of genres.
	 */
	@ApiOperation({ summary: 'List all genres' })
	@ApiResponse({ status: 200, description: 'Genres retrieved successfully.' })
	@ApiResponse({ status: 500, description: 'Internal server error.' })
	@Get('ListGenres')
	ListGenres(): Promise<Genre[]> {
		return this.genresService.ListGenres();
	};

	/**
	 * Retrieve a specific genre by ID
	 * @param id Genre ID to retrieve
	 * @returns {Promise<Genre | null>} A promise resolving to the genre or null if not found.
	 */
	@ApiOperation({ summary: 'List one genre by ID' })
	@ApiResponse({ status: 200, description: 'Genre found successfully.' })
	@ApiResponse({ status: 404, description: 'Genre not found.' })
	@ApiResponse({ status: 400, description: 'Invalid genre ID format.' })
	@Get('ListOneGenre/:id')
	ListOneGenre(@Param('id', ParseIntPipe) id: number): Promise<Genre | null> {
		return this.genresService.ListOneGenre(id);
	};

	/**
	 * Add a new genre to the database
	 * @param createGenreDto Data transfer object containing genre details
	 * @returns {Promise<Genre>} A promise resolving to the created genre.
	 */
	@ApiOperation({ summary: 'Add a genre to the database' })
	@ApiResponse({ status: 201, description: 'Genre created successfully.' })
	@ApiResponse({ status: 400, description: 'Invalid data in request body.' })
	@Post('AddGenre')
	AddGenre(@Body() createMovieDto: CreateGenreDto): Promise<Genre> {
		return this.genresService.AddGenre(createMovieDto);
	};

	/**
	 * Add multiple genres to the database.
	 * @param createGenresDto Array of genre details to be added.
	 * @returns {Promise<Genre[]>} A promise resolving to an array of created genres.
	 */
	@ApiOperation({ summary: 'Add multiple genres to the database' })
	@ApiResponse({ status: 201, description: 'Genres created successfully.' })
	@ApiResponse({ status: 400, description: 'Invalid data in the request body.' })
	@Post('AddMultipleGenres')
	AddMultipleGenres(@Body() createGenresDto: CreateGenreDto[]): Promise<Genre[]> {
		return this.genresService.AddMultipleGenres(createGenresDto);
	}

	/**
	 * Update an existing genre in the database
	 * @param id Genre ID to update
	 * @param updateGenreDto Data transfer object containing updated genre details
	 * @returns {Promise<Genre | null>} A promise resolving to the updated genre or null if not found.
	 */
	@ApiOperation({ summary: 'Update a genre in the database' })
	@ApiResponse({ status: 200, description: 'Genre updated successfully.' })
	@ApiResponse({ status: 404, description: 'Genre not found.' })
	@ApiResponse({ status: 400, description: 'Invalid data or genre ID.' })
	@Patch('UpdateGenre/:id')
	UpdateGenre(@Param('id', ParseIntPipe) id: number, @Body() updateMovieDto: UpdateGenreDto): Promise<Genre | null> {
		return this.genresService.UpdateGenre(id, updateMovieDto);
	}

	/**
	 * Delete a genre by ID from the database
	 * The genre should also be removed from all movies associated with it
	 * @param id Genre ID to delete
	 * @returns {Promise<Genre>} A promise resolving once the genre is deleted.
	 */
	@ApiOperation({ summary: 'Delete a genre from the database' })
	@ApiResponse({ status: 200, description: 'Genre deleted successfully.' })
	@ApiResponse({ status: 404, description: 'Genre not found.' })
	@ApiResponse({ status: 400, description: 'Invalid genre ID format.' })
	@Delete('DeleteGenre/:id')
	DeleteGenre(@Param('id', ParseIntPipe) id: number): Promise<Genre> {
		return this.genresService.DeleteGenre(id);
	}
}