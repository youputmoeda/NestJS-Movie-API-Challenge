import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { MoviesService } from "./movies.service";
import { CreateMovieDto } from "./dto/create-movie.dto";

@ApiTags('Movies')
@Controller('Movies')
export class MoviesController {
	constructor(private readonly moviesService: MoviesService) { }

	@ApiOperation({ summary: 'List all movies' })
	@Get()
	ListMovies() {
		return this.moviesService.ListMovies();
	};

	@ApiOperation({ summary: 'Add a movie to the database' })
	@Post()
	AddMovie(@Body() createMovieDto: CreateMovieDto) {
		return this.moviesService.AddMovie(createMovieDto);
	};
}