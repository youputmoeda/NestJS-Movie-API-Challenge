// src/genres/dto/update-genre.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateGenreDto } from './create-genre.dto';

/**
 * Data Transfer Object (DTO) for updating an existing genre.
 * 
 * Extends `CreateGenreDto` with optional fields using `PartialType`.
 */
export class UpdateGenreDto extends PartialType(CreateGenreDto) { }
