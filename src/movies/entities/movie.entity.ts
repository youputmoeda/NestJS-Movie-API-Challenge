// src/movies/entities/movie.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Movie {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string; // (String, required)

	@Column()
	description: string; // (String, required)

	@Column({ type: 'date' })
	releaseDate: Date; // (Date, required)

	// To store an array of string genres:
	@Column('simple-array')
	genres: string[]; // (Array of strings, required)
}
