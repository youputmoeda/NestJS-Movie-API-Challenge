// src/genres/genre.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenresService } from '../genres.service';
import { Genre } from '../entities/genre.entity';
import { CreateGenreDto } from '../dto/create-genre.dto';
import { UpdateGenreDto } from '../dto/update-genre.dto';
import { Movie } from '../../movies/entities/movie.entity';

/**
 * Test suite for the GenresService class.
 */
describe('GenresService', () => {
	let genresService: GenresService;
	let genreRepository: Repository<Genre>;
	let movieRepository: Repository<Movie>;

	/**
	 * Mock implementations for the Genre repository.
	 */
	const mockGenreRepository = {
		find: jest.fn(),
		findOne: jest.fn(),
		create: jest.fn(),
		save: jest.fn(),
		remove: jest.fn(),
	};

	/**
	 * Mock implementations for the Movie repository.
	 */
	const mockMovieRepository = {
		find: jest.fn(),
		save: jest.fn(),
	};

	/**
	 * Initialize the testing module and inject the mock repositories.
	 */
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GenresService,
				{ provide: getRepositoryToken(Genre), useValue: mockGenreRepository },
				{ provide: getRepositoryToken(Movie), useValue: mockMovieRepository },
			],
		}).compile();

		genresService = module.get<GenresService>(GenresService);
		genreRepository = module.get<Repository<Genre>>(getRepositoryToken(Genre));
		movieRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
	});

	/** Clears all mocks after each test. */
	afterEach(() => {
		jest.clearAllMocks();
	});

	/**
	 * Tests for the `ListGenres` method.
	 */
	describe('ListGenres', () => {
		it('should return all genres', async () => {
			const genres = [{ id: 1, name: 'Action' }, { id: 2, name: 'Comedy' }];
			mockGenreRepository.find.mockResolvedValue(genres);

			const result = await genresService.ListGenres();

			expect(result).toEqual(genres);
			expect(genreRepository.find).toHaveBeenCalled();
		});

		it('should return an empty list if no genres exist', async () => {
			mockGenreRepository.find.mockResolvedValue([]);

			const result = await genresService.ListGenres();

			expect(result).toEqual([]);

			expect(mockGenreRepository.find).toHaveBeenCalled();
		});
	});

	/**
	 * Tests for the `ListOneGenre` method.
	 */
	describe('ListOneGenre', () => {
		it('should return a genre by ID', async () => {
			const genre = { id: 1, name: 'Comedy' };
			mockGenreRepository.findOne.mockResolvedValue(genre);

			const result = await genresService.ListOneGenre(1);

			expect(result).toEqual(genre);
			expect(mockGenreRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
		});

		it('should throw NotFoundException if genre not found', async () => {
			mockGenreRepository.findOne.mockResolvedValue(null);

			const result = await genresService.ListOneGenre(99);

			expect(result).toBeNull();
			expect(genreRepository.findOne).toHaveBeenCalledWith({ where: { id: 99 } });
		});
	});

	/**
	 * Tests for the `AddGenre` method.
	 */
	describe('AddGenre', () => {
		it('should add a new genre', async () => {
			const createGenreDto: CreateGenreDto = { name: 'Horror' };
			const savedGenre = { id: 1, name: 'Horror' };

			mockGenreRepository.create.mockReturnValue(savedGenre);
			mockGenreRepository.save.mockResolvedValue(savedGenre);

			const result = await genresService.AddGenre(createGenreDto);

			expect(result).toEqual(savedGenre);
			expect(genreRepository.create).toHaveBeenCalledWith(createGenreDto);
			expect(genreRepository.save).toHaveBeenCalledWith(savedGenre);
		});
	});

	/**
	 * Tests for the `UpdateGenre` method.
	 */
	describe('UpdateGenre', () => {
		it('should update an existing genre', async () => {
			const updateGenreDto: UpdateGenreDto = { name: 'Thriller' };
			const existingGenre = { id: 1, name: 'Horror' };
			const updatedGenre = { ...existingGenre, ...updateGenreDto };

			mockGenreRepository.findOne.mockResolvedValue(existingGenre);
			mockGenreRepository.save.mockResolvedValue(updatedGenre);

			const result = await genresService.UpdateGenre(1, updateGenreDto);

			expect(result).toEqual(updatedGenre);
			expect(genreRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
			expect(genreRepository.save).toHaveBeenCalledWith(updatedGenre);
		});

		it('should return null if genre does not exist', async () => {
			mockGenreRepository.findOne.mockResolvedValue(null);

			const result = await genresService.UpdateGenre(99, { name: 'Thriller' });

			expect(result).toBeNull();
			expect(genreRepository.findOne).toHaveBeenCalledWith({ where: { id: 99 } });
			expect(genreRepository.save).not.toHaveBeenCalled();
		});
	});

	/**
	 * Tests for the `DeleteGenre` method.
	 */
	describe('DeleteGenre', () => {
		it('should delete a genre and remove it from all movies', async () => {
			const genreToDelete = { id: 1, name: 'Horror' };
			const movies = [
				{ id: 1, title: 'Movie 1', genres: ['Horror', 'Action'] },
				{ id: 2, title: 'Movie 2', genres: ['Horror'] },
			];
			const updatedMovies = [
				{ id: 1, title: 'Movie 1', genres: ['Action'] },
				{ id: 2, title: 'Movie 2', genres: [] },
			];

			mockGenreRepository.findOne.mockResolvedValue(genreToDelete);
			mockMovieRepository.find.mockResolvedValue(movies);
			mockMovieRepository.save.mockImplementation((movie) => Promise.resolve(movie));
			mockGenreRepository.remove.mockResolvedValue(genreToDelete);

			const result = await genresService.DeleteGenre(1);

			expect(result).toEqual(genreToDelete);
			expect(movies).toEqual(updatedMovies);
			expect(genreRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
			expect(movieRepository.find).toHaveBeenCalled();
			expect(movieRepository.save).toHaveBeenCalledTimes(2);
			expect(genreRepository.remove).toHaveBeenCalledWith(genreToDelete);
		});

		it('should throw NotFoundException if genre not found', async () => {
			mockGenreRepository.findOne.mockResolvedValue(null);

			const result = await genresService.DeleteGenre(99);

			expect(result).toBeNull();
			expect(genreRepository.findOne).toHaveBeenCalledWith({ where: { id: 99 } });
			expect(movieRepository.find).not.toHaveBeenCalled();
			expect(genreRepository.remove).not.toHaveBeenCalled();
		});
	});
});
