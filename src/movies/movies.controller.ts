import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { MoviesService } from "./movies.service";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";

@ApiTags('Movies')
@Controller('Movies')
export class MoviesController {
	constructor(private readonly moviesService: MoviesService) { }

	@ApiOperation({ summary: 'List all movies' })
	@Get('ListMovies')
	ListMovies() {
		return this.moviesService.ListMovies();
	};

	@ApiOperation({ summary: 'List one movie' })
	@Get('ListOneMovie\:id')
	ListOneMovie(@Param('id') id: number) {
		return this.moviesService.ListOneMovie(id);
	};

	@ApiOperation({ summary: 'List movies by genre' })
	@Get('listMoviesByGenre\:genre')
	listMoviesByGenre(@Param('genre') genre: string) {
		return this.moviesService.listMoviesByGenre(genre);
	};

	@ApiOperation({ summary: 'Search movies by filters' })
	@Get('SearchMovies')
	SearchMovies(@Query() allQueryParams: { title?: string, genre?: string }) {
		return this.moviesService.SearchMovies(allQueryParams.title, allQueryParams.genre);
	};


	@ApiOperation({ summary: 'Add a movie to the database' })
	@Post('AddMovie')
	AddMovie(@Body() createMovieDto: CreateMovieDto) {
		return this.moviesService.AddMovie(createMovieDto);
	};

	@ApiOperation({ summary: 'Update a movie from database' })
	@Patch('UpdateMovie\:id')
	UpdateMovie(@Param('id') id: number, @Body() updateMovieDto: UpdateMovieDto) {
		return this.moviesService.UpdateMovie(id, updateMovieDto);
	}

	@ApiOperation({ summary: 'Delete a movie from database' })
	@Delete('DeleteMovie\:id')
	DeleteMovie(@Param('id') id: number) {
		return this.moviesService.DeleteMovie(id);
	}
}