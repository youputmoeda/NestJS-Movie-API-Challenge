// src/movies/movie.controller.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { CreateMovieDto } from "../dto/create-movie.dto";
import { UpdateMovieDto } from "../dto/update-movie.dto";
import { MoviesController } from "../movies.controller";
import { MoviesService } from "../movies.service";
import { MovieNotFoundException } from "../exceptions/movie-not-found.exception";

/**
 * Unit tests for the MoviesController class.
 */
describe('MovieController', () => {
	let moviesController: MoviesController;
	let moviesService: MoviesService;

	/**
	 * Mock implementation of MoviesService methods.
	 */
	const mockMoviesService = {
		ListMovies: jest.fn().mockResolvedValue([]),
		ListOneMovie: jest.fn(),
		SearchMovies: jest.fn(),
		AddMovie: jest.fn(),
		UpdateMovie: jest.fn(),
		DeleteMovie: jest.fn().mockResolvedValue({ deleted: true }),
	};

	/**
	 * Setup for the testing module and dependency injection.
	 */
	beforeEach(async () => {
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			controllers: [MoviesController],
			providers: [
				{
					provide: MoviesService,
					useValue: mockMoviesService
				}
			],
		}).compile();

		moviesController = module.get<MoviesController>(MoviesController);
		moviesService = module.get<MoviesService>(MoviesService);
	});

	/**
	 * Tests for ListMovies endpoint.
	 */
	describe('ListMovie', () => {
		it('Should return a list with all the movies', async () => {
			const movieList = [{ id: 1, title: 'The Matrix', genres: ['Action'] }];
			mockMoviesService.ListMovies.mockResolvedValue(movieList);

			const result = await moviesController.ListMovies();
			expect(result).toEqual(movieList);
			expect(moviesService.ListMovies).toHaveBeenCalled();
		});

		it('should return an empty list if no movies exist', async () => {
			mockMoviesService.ListMovies.mockReturnValue([]);

			const result = await moviesController.ListMovies();
			expect(result).toEqual([]);
			expect(moviesService.ListMovies).toHaveBeenCalled();
		});
	});

	/**
	 * Tests for ListOneMovie endpoint.
	 */
	describe('ListOneMovie', () => {
		it('should return a movie by ID', async () => {
			const movie = { id: 1, title: 'The Matrix', genres: ['Action'] };
			mockMoviesService.ListOneMovie.mockReturnValue(movie);

			const result = await moviesController.ListOneMovie(1);
			expect(result).toEqual(movie);
			expect(moviesService.ListOneMovie).toHaveBeenCalledWith(1);
		});

		it('should handle null response from service gracefully', async () => {
			mockMoviesService.ListOneMovie.mockResolvedValue(null);

			const result = await moviesController.ListOneMovie(1);
			expect(result).toBeNull();
			expect(moviesService.ListOneMovie).toHaveBeenCalledWith(1);
		});

		it('should throw MovieNotFoundException if movie does not exist', async () => {
			mockMoviesService.ListOneMovie = jest.fn().mockRejectedValue(new MovieNotFoundException(99));

			await expect(moviesController.ListOneMovie(99)).rejects.toThrow(new MovieNotFoundException(99));
			expect(moviesService.ListOneMovie).toHaveBeenCalledWith(99);
		});

		it('should throw an error if provided ID is negative', async () => {
			mockMoviesService.ListOneMovie = jest.fn().mockRejectedValue(new Error('Invalid ID'));

			await expect(moviesController.ListOneMovie(-1)).rejects.toThrow('Invalid ID');
			expect(moviesService.ListOneMovie).toHaveBeenCalledWith(-1);
		});
	});

	/**
	 * Tests for SearchMovies endpoint.
	 */
	describe('SearchMovies', () => {
		it('should throw an error if service throws an exception', async () => {
			jest.spyOn(moviesService, 'SearchMovies').mockRejectedValue(new Error('Service error'));

			await expect(
				moviesController.SearchMovies({ title: 'Inception', genre: 'Sci-Fi' }),
			).rejects.toThrow('Service error');

			expect(moviesService.SearchMovies).toHaveBeenCalledWith('Inception', 'Sci-Fi');
		});

		it('should throw an error if invalid query parameters are provided', async () => {
			jest.spyOn(moviesService, 'SearchMovies').mockRejectedValue(new Error('Invalid pagination parameters'));

			await expect(
				moviesController.SearchMovies({ page: -1, limit: -10 }),
			).rejects.toThrow('Invalid pagination parameters');

			expect(moviesService.SearchMovies).toHaveBeenCalledWith(undefined, undefined);
		});
	});

	/**
	 * Tests for AddMovie endpoint.
	 */
	describe('AddMovie', () => {
		it('should add a new movie', async () => {
			const createMovieDto: CreateMovieDto = {
				title: 'Inception',
				description: 'A mind-bending thriller',
				releaseDate: '2010-07-16',
				genres: ['Sci-Fi', 'Action'],
			};
			const savedMovie = { id: 1, ...createMovieDto };
			mockMoviesService.AddMovie.mockReturnValue(savedMovie);

			const result = await moviesController.AddMovie(createMovieDto);
			expect(result).toEqual(savedMovie);
			expect(moviesService.AddMovie).toHaveBeenCalledWith(createMovieDto);
		});

		it('should throw an error if invalid data is provided', async () => {
			const invalidMovieDto: CreateMovieDto = {
				title: '', // Invalid title
				description: 'Invalid movie',
				releaseDate: 'invalid-date',
				genres: [],
			};
			mockMoviesService.AddMovie = jest.fn().mockRejectedValue(new Error('Invalid data'));

			await expect(moviesController.AddMovie(invalidMovieDto)).rejects.toThrow('Invalid data');
			expect(moviesService.AddMovie).toHaveBeenCalledWith(invalidMovieDto);
		});
	});

	/**
	 * Tests for UpdateMovie endpoint.
	 */
	describe('UpdateMovie', () => {
		it('should update an existing movie', async () => {
			const updateMovieDto: UpdateMovieDto = {
				title: 'The Matrix Reloaded',
			};
			const updatedMovie = { id: 1, ...updateMovieDto };
			mockMoviesService.UpdateMovie.mockReturnValue(updatedMovie);

			const result = await moviesController.UpdateMovie(1, updateMovieDto);
			expect(result).toEqual(updatedMovie);
			expect(moviesService.UpdateMovie).toHaveBeenCalledWith(1, updateMovieDto);
		});

		it('should throw MovieNotFoundException if movie to update does not exist', async () => {
			const updateMovieDto: UpdateMovieDto = {
				title: 'Non-existent Movie',
			};
			mockMoviesService.UpdateMovie = jest.fn().mockRejectedValue(new MovieNotFoundException(99));

			await expect(moviesController.UpdateMovie(99, updateMovieDto)).rejects.toThrow(MovieNotFoundException);
			expect(moviesService.UpdateMovie).toHaveBeenCalledWith(99, updateMovieDto);
		});

		it('should throw an error if provided ID is negative', async () => {
			const updateMovieDto: UpdateMovieDto = {
				title: 'Invalid Update',
			};
			mockMoviesService.UpdateMovie = jest.fn().mockRejectedValue(new Error('Invalid ID'));

			await expect(moviesController.UpdateMovie(-1, updateMovieDto)).rejects.toThrow('Invalid ID');
			expect(moviesService.UpdateMovie).toHaveBeenCalledWith(-1, updateMovieDto);
		});
	});

	/**
	 * Tests for DeleteMovie endpoint.
	 */
	describe('DeleteMovie', () => {
		it('should delete a movie by ID', async () => {
			const result = await moviesController.DeleteMovie(1);
			expect(result).toEqual({ deleted: true });
			expect(moviesService.DeleteMovie).toHaveBeenCalledWith(1);
		});

		it('should throw MovieNotFoundException if movie to delete does not exist', async () => {
			mockMoviesService.DeleteMovie = jest.fn().mockRejectedValue(new MovieNotFoundException(99));

			await expect(moviesController.DeleteMovie(99)).rejects.toThrow(MovieNotFoundException);
			expect(moviesService.DeleteMovie).toHaveBeenCalledWith(99);
		});

		it('should throw an error if provided ID is negative', async () => {
			mockMoviesService.DeleteMovie = jest.fn().mockRejectedValue(new Error('Invalid ID'));

			await expect(moviesController.DeleteMovie(-1)).rejects.toThrow('Invalid ID');
			expect(moviesService.DeleteMovie).toHaveBeenCalledWith(-1);
		});
	});
});