// src/genres/genre.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { GenresService } from "./genres.service";
import { CreateGenreDto } from "./dto/create-genre.dto";
import { UpdateGenreDto } from "./dto/update-genre.dto";

@ApiTags('Genres')
@Controller('Genres')
export class GenresController {
	constructor(private readonly genresService: GenresService) { }

	@ApiOperation({ summary: 'List all genres' })
	@Get('ListGenres')
	ListGenres() {
		return this.genresService.ListGenres();
	};

	@ApiOperation({ summary: 'List one genre' })
	@Get('ListOneGenre\:id')
	ListOneGenre(@Param('id') id: number) {
		return this.genresService.ListOneGenre(id);
	};

	@ApiOperation({ summary: 'Add a genre to the database' })
	@Post('AddGenre')
	AddGenre(@Body() createMovieDto: CreateGenreDto) {
		return this.genresService.AddGenre(createMovieDto);
	};

	@ApiOperation({ summary: 'Update a genre from database' })
	@Patch('UpdateGenre\:id')
	UpdateGenre(@Param('id') id: number, @Body() updateMovieDto: UpdateGenreDto) {
		return this.genresService.UpdateGenre(id, updateMovieDto);
	}

	@ApiOperation({ summary: 'Delete a genre from database' })
	@Delete('DeleteGenre\:id')
	DeleteGenre(@Param('id') id: number) {
		return this.genresService.DeleteGenre(id);
	}
}