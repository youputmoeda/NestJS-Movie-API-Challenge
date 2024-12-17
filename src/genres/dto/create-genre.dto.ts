// src/genres/dto/create-genre.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object (DTO) for creating a new genre.
 * 
 * Validates the input data when creating a genre:
 * - `name`: Must be a non-empty string.
 */
export class CreateGenreDto {

	/**
	 * Name of the genre.
	 * @example "Action"
	 */
	@ApiProperty({ description: 'Name of genre', example: 'Action' })
	@IsString()
	@IsNotEmpty()
	name: string;
}
