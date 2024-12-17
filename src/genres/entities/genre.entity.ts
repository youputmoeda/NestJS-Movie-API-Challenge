// src/genres/entities/genre.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Represents the Genre entity stored in the database.
 * 
 * - `id`: Auto-generated primary key.
 * - `name`: Name of the genre.
 */
@Entity()
export class Genre {
	/**
	 * Unique identifier for the genre (auto-incremented).
	 */
	@PrimaryGeneratedColumn()
	id: number;

	/**
	 * Name of the genre.
	 */
	@Column({ type: 'varchar', length: 255, nullable: false })
	name: string; // Field  "Name" (String, required)
}
