import { NotFoundException } from '@nestjs/common';

/**
 * Exception thrown when a genre with the specified ID is not found.
 */
export class GenreNotFoundException extends NotFoundException {

	/**
	 * Constructs a new GenreNotFoundException.
	 * 
	 * @param genreId - The ID of the genre that was not found.
	 * @example throw new GenreNotFoundException(1);
	 */
	constructor(genreId: number) {
		super(`Genre with ID ${genreId} not found`);
	}
}
