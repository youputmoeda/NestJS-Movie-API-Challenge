// src/genres/dto/create-genre.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateGenreDto {
	@ApiProperty({ description: 'Nome do gênero', example: 'Action' })
	@IsString()
	@IsNotEmpty()
	name: string;
}
