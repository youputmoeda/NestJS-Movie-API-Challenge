import { NotFoundException } from '@nestjs/common';

/**
 * Custom exception for cases where a movie is not found.
 * 
 * Extends the NestJS NotFoundException to provide a more specific error message.
 */
export class MovieNotFoundException extends NotFoundException {
	/**
	 * Constructs the MovieNotFoundException.
	 * 
	 * @param {number} movieId - The ID of the movie that was not found.
	 */
	constructor(movieId: number) {
		super(`Movie with ID ${movieId} not found`);
	}
}
