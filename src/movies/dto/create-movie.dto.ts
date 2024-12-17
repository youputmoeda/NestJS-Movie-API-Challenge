// src/movies/dto/create-movie.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsArray } from 'class-validator';

export class CreateMovieDto {
	@ApiProperty({ description: 'Movie title' })
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty({ description: 'Movie description' })
	@IsString()
	@IsNotEmpty()
	description: string;

	@ApiProperty({ description: 'Release date (YYYY-MM-DD)' })
	@IsDateString()
	releaseDate: string;

	@ApiProperty({ description: 'List of genres (array of strings)', type: [String] })
	@IsArray()
	@IsString({ each: true })
	genres: string[];
}
