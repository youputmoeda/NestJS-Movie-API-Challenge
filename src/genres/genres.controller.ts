// src/genres/genre.controller.ts
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GenresService } from "./genres.service";
import { CreateGenreDto } from "./dto/create-genre.dto";
import { UpdateGenreDto } from "./dto/update-genre.dto";

@ApiTags('Genres')
@Controller('Genres')
export class GenresController {
	constructor(private readonly genresService: GenresService) { }

	/**
	 * List all genres in the database
	 */
	@ApiOperation({ summary: 'List all genres' })
	@ApiResponse({ status: 200, description: 'Genres retrieved successfully.' })
	@ApiResponse({ status: 500, description: 'Internal server error.' })
	@Get('ListGenres')
	ListGenres() {
		return this.genresService.ListGenres();
	};

	/**
	 * Retrieve a specific genre by ID
	 * @param id Genre ID to retrieve
	 */
	@ApiOperation({ summary: 'List one genre by ID' })
	@ApiResponse({ status: 200, description: 'Genre found successfully.' })
	@ApiResponse({ status: 404, description: 'Genre not found.' })
	@ApiResponse({ status: 400, description: 'Invalid genre ID format.' })
	@Get('ListOneGenre/:id')
	ListOneGenre(@Param('id', ParseIntPipe) id: number) {
		return this.genresService.ListOneGenre(id);
	};

	/**
	 * Add a new genre to the database
	 * @param createGenreDto Data transfer object containing genre details
	 */
	@ApiOperation({ summary: 'Add a genre to the database' })
	@ApiResponse({ status: 201, description: 'Genre created successfully.' })
	@ApiResponse({ status: 400, description: 'Invalid data in request body.' })
	@Post('AddGenre')
	AddGenre(@Body() createMovieDto: CreateGenreDto) {
		return this.genresService.AddGenre(createMovieDto);
	};

	/**
	 * Update an existing genre in the database
	 * @param id Genre ID to update
	 * @param updateGenreDto Data transfer object containing updated genre details
	 */
	@ApiOperation({ summary: 'Update a genre in the database' })
	@ApiResponse({ status: 200, description: 'Genre updated successfully.' })
	@ApiResponse({ status: 404, description: 'Genre not found.' })
	@ApiResponse({ status: 400, description: 'Invalid data or genre ID.' })
	@Patch('UpdateGenre/:id')
	UpdateGenre(@Param('id', ParseIntPipe) id: number, @Body() updateMovieDto: UpdateGenreDto) {
		return this.genresService.UpdateGenre(id, updateMovieDto);
	}

	/**
	 * Delete a genre by ID from the database
	 * The genre should also be removed from all movies associated with it
	 * @param id Genre ID to delete
	 */
	@ApiOperation({ summary: 'Delete a genre from the database' })
	@ApiResponse({ status: 200, description: 'Genre deleted successfully.' })
	@ApiResponse({ status: 404, description: 'Genre not found.' })
	@ApiResponse({ status: 400, description: 'Invalid genre ID format.' })
	@Delete('DeleteGenre/:id')
	DeleteGenre(@Param('id', ParseIntPipe) id: number) {
		return this.genresService.DeleteGenre(id);
	}
}