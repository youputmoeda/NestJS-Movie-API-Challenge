// src/movies/dto/update-movie.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';

/**
 * Data Transfer Object (DTO) for updating an existing movie.
 * 
 * Inherits all fields from CreateMovieDto, but makes them optional.
 */
export class UpdateMovieDto extends PartialType(CreateMovieDto) { }
