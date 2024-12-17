// src/genres/entities/genre.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Genre {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string; // Campo "Name" (String, required)
}
