// src/movies/entities/movie.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Represents a Movie entity in the database.
 * 
 * Properties:
 * - `id`: Unique identifier for the movie (auto-generated).
 * - `title`: Title of the movie.
 * - `description`: Detailed description of the movie.
 * - `releaseDate`: Date when the movie was released.
 * - `genres`: List of genres associated with the movie.
 */
@Entity()
export class Movie {
	/**
	 * Auto-incremented unique ID of the movie.
	 */
	@PrimaryGeneratedColumn()
	id: number;

	/**
	 * Title of the movie.
	 */
	@Column({ type: 'varchar', length: 255, nullable: false })
	title: string; // (String, required)

	/**
	 * Description or synopsis of the movie.
	 */
	@Column({ type: 'text', nullable: false })
	description: string; // (String, required)

	/**
	 * Release date of the movie in the format YYYY-MM-DD.
	 */
	@Column({ type: 'date', nullable: false })
	releaseDate: Date; // (Date, required)

	/**
	 * List of genres (as an array of strings) the movie belongs to.
	 */
	@Column({ type: 'simple-array', nullable: false })
	genres: string[]; // (Array of strings, required)
}
