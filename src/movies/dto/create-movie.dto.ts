// src/movies/dto/create-movie.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsArray } from 'class-validator';

/**
 * Data Transfer Object (DTO) for creating a new movie.
 * 
 * Includes validation rules and Swagger documentation.
 */
export class CreateMovieDto {
	/**
	 * The title of the movie.
	 * 
	 * @example "Inception"
	 */
	@ApiProperty({ description: 'Movie title' })
	@IsString()
	@IsNotEmpty()
	title: string;

	/**
	 * The description or synopsis of the movie.
	 * 
	 * @example "A mind-bending thriller about dreams within dreams."
	 */
	@ApiProperty({ description: 'Movie description' })
	@IsString()
	@IsNotEmpty()
	description: string;

	/**
	 * The release date of the movie in YYYY-MM-DD format.
	 * 
	 * @example "2010-07-16"
	 */
	@ApiProperty({ description: 'Release date (YYYY-MM-DD)' })
	@IsDateString()
	releaseDate: string;

	/**
	 * A list of genres associated with the movie.
	 * 
	 * @example ["Action", "Sci-Fi"]
	 */
	@ApiProperty({ description: 'List of genres (array of strings)', type: [String] })
	@IsArray()
	@IsString({ each: true })
	genres: string[];
}
