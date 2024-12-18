// src/movies/movie.service.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { UpdateMovieDto } from "../dto/update-movie.dto";
import { CreateMovieDto } from "../dto/create-movie.dto";
import { MoviesService } from "../movies.service";
import { Movie } from "../entities/movie.entity";
import { MovieNotFoundException } from "../exceptions/movie-not-found.exception";

/**
 * Unit tests for the MoviesService class.
 * 
 * This file ensures that all service methods function correctly, 
 * including edge cases and exception handling.
 */
describe('MovieService', () => {
	let moviesService: MoviesService;
	let movieRepository: Repository<Movie>;

	/**
	 * Mock implementation of TypeORM's QueryBuilder.
	 */
	const queryBuilderMock = {
		where: jest.fn().mockReturnThis(),
		andWhere: jest.fn().mockReturnThis(),
		skip: jest.fn().mockReturnThis(),
		take: jest.fn().mockReturnThis(),
		getMany: jest.fn().mockResolvedValue([]),
	};

	/**
	 * Mock implementation of TypeORM repository.
	 */
	const mockMovieRepository = {
		createQueryBuilder: jest.fn(() => queryBuilderMock),
		findOne: jest.fn(),
		create: jest.fn(),
		save: jest.fn(),
		remove: jest.fn(),
	};

	/**
	 * Sets up the testing module and injects the MoviesService and Repository.
	 */
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MoviesService,
				{
					provide: getRepositoryToken(Movie),
					useValue: mockMovieRepository,
				},
			],
		}).compile();

		moviesService = module.get<MoviesService>(MoviesService);
		movieRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
	});

	/**
	 * Clears all mocks after each test.
	 */
	afterEach(() => {
		jest.clearAllMocks();
	});

	/**
	 * Tests for the ListMovies method.
	 */
	describe('ListMovie', () => {
		it('should return a paginated list of movies', async () => {
			const expectedMovies = Array.from({ length: 10 }, (_, index) => ({
				id: index + 1,
				title: `Movie ${index + 1}`,
				genres: ['Action', 'Sci-Fi'],
			}));

			mockMovieRepository.createQueryBuilder().getMany.mockResolvedValue(expectedMovies);

			const result = await moviesService.ListMovies(1, 10);

			expect(result).toEqual(expectedMovies);
			expect(mockMovieRepository.createQueryBuilder).toHaveBeenCalled();
			expect(queryBuilderMock.skip).toHaveBeenCalledWith(0);
			expect(queryBuilderMock.take).toHaveBeenCalledWith(10);
			expect(queryBuilderMock.getMany).toHaveBeenCalled();
		});

		it('should return an empty list if no movies exist', async () => {
			mockMovieRepository.createQueryBuilder().getMany.mockResolvedValue([]);

			const spy = jest.spyOn(moviesService, 'ListMovies');

			const result = await moviesService.ListMovies();

			expect(result).toEqual([]);
			expect(spy).toHaveBeenCalled();

			expect(mockMovieRepository.createQueryBuilder).toHaveBeenCalled();
			expect(mockMovieRepository.createQueryBuilder().getMany).toHaveBeenCalled();

			spy.mockRestore();
		});
	});

	/**
	 * Tests for the ListOneMovie method.
	 */
	describe('ListOneMovie', () => {
		it('should return a movie by ID', async () => {
			const movie = { id: 1, title: 'The Matrix', genres: ['Action'] };
			mockMovieRepository.findOne.mockResolvedValue(movie);

			const result = await moviesService.ListOneMovie(1);
			expect(result).toEqual(movie);
			expect(mockMovieRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
		});

		it('should throw MovieNotFoundException if movie not found', async () => {
			mockMovieRepository.findOne.mockResolvedValue(null);

			await expect(moviesService.ListOneMovie(99)).rejects.toThrow(MovieNotFoundException);
		});

		it('should throw an error if ID is negative', async () => {
			await expect(moviesService.ListOneMovie(-1)).rejects.toThrow("Id can't be negative");
		});
	});

	/**
	 * Tests for the SearchMovies method.
	 */
	describe('SearchMovies', () => {
		it('should return movies filtered by title and genre', async () => {
			const movies = [{ id: 1, title: 'Inception', genres: ['Sci-Fi'] }];
			mockMovieRepository.createQueryBuilder().getMany.mockResolvedValue(movies);

			const result = await moviesService.SearchMovies('Inception', 'Sci-Fi', 1, 10);
			expect(result).toEqual(movies);
			expect(movieRepository.createQueryBuilder).toHaveBeenCalled();
		});

		it('should throw an error if database query fails', async () => {
			mockMovieRepository.createQueryBuilder.mockImplementation(() => {
				throw new Error('Database error');
			});

			await expect(moviesService.SearchMovies('Inception', 'Sci-Fi')).rejects.toThrow('Database error');
			expect(mockMovieRepository.createQueryBuilder).toHaveBeenCalled();
		});

		it('should throw an error if invalid parameters are provided', async () => {
			await expect(moviesService.SearchMovies(undefined, undefined, -1, -10)).rejects.toThrow(
				'Invalid pagination parameters',
			);
		});
	});

	/**
	 * Tests for the AddMovie method.
	 */
	describe('AddMovie', () => {
		it('should add a new movie successfully', async () => {
			const createMovieDto: CreateMovieDto = {
				title: 'Inception',
				description: 'A mind-bending thriller',
				releaseDate: '2010-07-16',
				genres: ['Sci-Fi'],
			};

			const savedMovie = { id: 1, ...createMovieDto };
			mockMovieRepository.create.mockReturnValue(savedMovie);
			mockMovieRepository.save.mockResolvedValue(savedMovie);

			const result = await moviesService.AddMovie(createMovieDto);
			expect(result).toEqual(savedMovie);
			expect(movieRepository.create).toHaveBeenCalledWith(createMovieDto);
			expect(movieRepository.save).toHaveBeenCalledWith(savedMovie);
		});

		it('should throw an error if invalid data is provided', async () => {
			const invalidMovieDto: CreateMovieDto = {
				title: '', // Invalid title
				description: '',
				releaseDate: '',
				genres: [],
			};

			await expect(moviesService.AddMovie(invalidMovieDto)).rejects.toThrow('Invalid data');
			expect(mockMovieRepository.create).not.toHaveBeenCalled();
			expect(mockMovieRepository.save).not.toHaveBeenCalled();
		});
	});

	/**
	 * Tests for the AddMultipleMovies method.
	 */
	describe('AddMultipleMovies', () => {
		it('should add multiple movies to the database', async () => {
			const createMoviesDto: CreateMovieDto[] = [
				{
					title: 'Inception',
					description: 'A mind-bending thriller',
					releaseDate: '2010-07-16',
					genres: ['Sci-Fi', 'Action'],
				},
				{
					title: 'The Matrix',
					description: 'A dystopian future thriller',
					releaseDate: '1999-03-31',
					genres: ['Sci-Fi', 'Action'],
				},
			];

			const savedMovies = createMoviesDto.map((movie, index) => ({
				id: index + 1,
				...movie,
			}));

			mockMovieRepository.create.mockImplementation((dto) => dto);
			mockMovieRepository.save.mockResolvedValue(savedMovies);

			const result = await moviesService.AddMultipleMovies(createMoviesDto);

			expect(result).toEqual(savedMovies);
			expect(mockMovieRepository.create).toHaveBeenCalledTimes(createMoviesDto.length);
			expect(mockMovieRepository.save).toHaveBeenCalledWith(expect.any(Array));
		});

		it('should throw an error if any movie data is invalid', async () => {
			const invalidMoviesDto: CreateMovieDto[] = [
				{ title: '', description: '', releaseDate: '', genres: [] }, // Invalid movie
			];

			mockMovieRepository.create.mockImplementation((dto) => dto);

			await expect(moviesService.AddMultipleMovies(invalidMoviesDto)).rejects.toThrow('Invalid data');
			expect(mockMovieRepository.create).not.toHaveBeenCalled();
			expect(mockMovieRepository.save).not.toHaveBeenCalled(); // Ensure save is not called
		});
	});

	/**
	 * Tests for the UpdateMovie method.
	 */
	describe('UpdateMovie', () => {
		it('should update a movie successfully', async () => {
			const updateMovieDto: UpdateMovieDto = { title: 'Updated Title' };
			const existingMovie = {
				id: 1,
				title: 'Old Title',
				description: 'Old description',
				releaseDate: new Date('1999-03-31'),
				genres: ['Sci-Fi']
			};
			const updatedMovie = { ...existingMovie, ...updateMovieDto };

			jest.spyOn(moviesService, 'ListOneMovie').mockResolvedValue(existingMovie);
			mockMovieRepository.save.mockResolvedValue(updatedMovie);

			const result = await moviesService.UpdateMovie(1, updateMovieDto);
			expect(result).toEqual(updatedMovie);
			expect(moviesService.ListOneMovie).toHaveBeenCalledWith(1);
			expect(mockMovieRepository.save).toHaveBeenCalledWith(updatedMovie);
		});

		it('should throw MovieNotFoundException if movie to update does not exist', async () => {
			const updateMovieDto: UpdateMovieDto = { title: 'Non-existent Movie' };

			jest.spyOn(moviesService, 'ListOneMovie').mockRejectedValue(new MovieNotFoundException(99));

			await expect(moviesService.UpdateMovie(99, updateMovieDto)).rejects.toThrow(MovieNotFoundException);
			expect(moviesService.ListOneMovie).toHaveBeenCalledWith(99);
			expect(mockMovieRepository.save).not.toHaveBeenCalled();
		});

		it('should throw an error if provided ID is negative', async () => {
			const updateMovieDto: UpdateMovieDto = { title: 'Invalid ID Movie' };

			await expect(moviesService.UpdateMovie(-1, updateMovieDto)).rejects.toThrow("Id can't be negative");
			expect(mockMovieRepository.save).not.toHaveBeenCalled();
		});
	});

	/**
	 * Tests for the DeleteMovie method.
	 */
	describe('DeleteMovie', () => {
		it('should delete a movie by ID', async () => {
			const movie = {
				id: 1,
				title: 'The Matrix',
				description: 'A science fiction movie',
				releaseDate: new Date('1999-03-31'),
				genres: ['Action', 'Sci-Fi'],
				createdAt: new Date('2023-01-01'),
				updatedAt: new Date('2023-01-01'),
			};

			jest.spyOn(moviesService, 'ListOneMovie').mockResolvedValue(movie);
			mockMovieRepository.remove.mockResolvedValue(movie);

			const result = await moviesService.DeleteMovie(1);

			expect(result).toEqual(movie);
			expect(moviesService.ListOneMovie).toHaveBeenCalledWith(1);
			expect(mockMovieRepository.remove).toHaveBeenCalledWith(movie);
		});

		it('should throw MovieNotFoundException if movie does not exist', async () => {
			jest.spyOn(moviesService, 'ListOneMovie').mockRejectedValue(new MovieNotFoundException(99));

			await expect(moviesService.DeleteMovie(99)).rejects.toThrow(MovieNotFoundException);
			expect(moviesService.ListOneMovie).toHaveBeenCalledWith(99);
			expect(mockMovieRepository.remove).not.toHaveBeenCalled();
		});

		it('should throw an error if provided ID is negative', async () => {
			await expect(moviesService.DeleteMovie(-1)).rejects.toThrow("Id can't be negative");
			expect(mockMovieRepository.remove).not.toHaveBeenCalled();
		});
	});
});