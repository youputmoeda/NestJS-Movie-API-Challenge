// src/genres/dto/create-genre.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateGenreDto {
	@ApiProperty({ description: 'Name of genre', example: 'Action' })
	@IsString()
	@IsNotEmpty()
	name: string;
}
