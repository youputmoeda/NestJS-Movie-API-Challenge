// src/genres/genre.controller.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { GenresController } from "../genres.controller";
import { GenresService } from "../genres.service";
import { GenreNotFoundException } from "../exceptions/genre-not-found.exception";
import { CreateGenreDto } from "../dto/create-genre.dto";
import { UpdateGenreDto } from "../dto/update-genre.dto";

/**
 * Unit tests for the GenreController class.
 */
describe('GenreController', () => {
	let genresController: GenresController;
	let genresService: GenresService;

	const mockGenresService = {
		ListGenres: jest.fn().mockResolvedValue([]),
		ListOneGenre: jest.fn(),
		AddGenre: jest.fn(),
		AddMultipleGenres: jest.fn(),
		UpdateGenre: jest.fn(),
		DeleteGenre: jest.fn().mockResolvedValue({ deleted: true }),
	};

	/**
	 * Initializes the testing module and injects the mock GenresService.
	 */
	beforeEach(async () => {
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			controllers: [GenresController],
			providers: [
				{
					provide: GenresService,
					useValue: mockGenresService
				}
			],
		}).compile();

		genresController = module.get<GenresController>(GenresController);
		genresService = module.get<GenresService>(GenresService);
	});

	/**
	 * Tests for the `ListGenres` method.
	 */
	describe('ListGenre', () => {
		it('Should return a list with all the genres', async () => {
			const genreList = [
				{ id: 1, name: 'Action' },
				{ id: 2, name: 'Sci-Fi' },
			];
			mockGenresService.ListGenres.mockResolvedValue(genreList);

			const result = await genresController.ListGenres();
			expect(result).toEqual(genreList);
			expect(genresService.ListGenres).toHaveBeenCalled();
		});

		it('should return an empty list if no genres exist', async () => {
			mockGenresService.ListGenres.mockReturnValue([]);

			const result = await genresController.ListGenres();
			expect(result).toEqual([]);
			expect(genresService.ListGenres).toHaveBeenCalled();
		});
	});

	/**
	 * Tests for the `ListOneGenre` method.
	 */
	describe('ListOneGenre', () => {
		it('should return a genre by ID', async () => {
			const genre = ['Action'];
			mockGenresService.ListOneGenre.mockReturnValue(genre);

			const result = await genresController.ListOneGenre(1);
			expect(result).toEqual(genre);
			expect(genresService.ListOneGenre).toHaveBeenCalledWith(1);
		});

		it('should handle null response from service gracefully', async () => {
			mockGenresService.ListOneGenre.mockResolvedValue(null);

			const result = await genresController.ListOneGenre(1);
			expect(result).toBeNull();
			expect(genresService.ListOneGenre).toHaveBeenCalledWith(1);
		});

		it('should throw GenreNotFoundException if genre does not exist', async () => {
			mockGenresService.ListOneGenre = jest.fn().mockRejectedValue(new GenreNotFoundException(99));

			await expect(genresController.ListOneGenre(99)).rejects.toThrow(new GenreNotFoundException(99));
			expect(genresService.ListOneGenre).toHaveBeenCalledWith(99);
		});

		it('should throw an error if provided ID is negative', async () => {
			mockGenresService.ListOneGenre = jest.fn().mockRejectedValue(new Error('Invalid ID'));

			await expect(genresController.ListOneGenre(-1)).rejects.toThrow('Invalid ID');
			expect(genresService.ListOneGenre).toHaveBeenCalledWith(-1);
		});
	});

	/**
	 * Tests for the `AddGenre` method.
	 */
	describe('AddGenre', () => {
		it('should add a new genre', async () => {
			const createGenreDto: CreateGenreDto = { name: 'Sci-Fi' };
			const savedGenre = { id: 1, name: 'Sci-Fi' };

			mockGenresService.AddGenre.mockResolvedValueOnce(savedGenre);

			const result = await genresController.AddGenre(createGenreDto);
			expect(result).toEqual(savedGenre);
			expect(genresService.AddGenre).toHaveBeenCalledWith(createGenreDto);
		});

		it('should throw an error if invalid data is provided', async () => {
			const invalidGenreDto: CreateGenreDto = {
				name: '', // Invalid genre
			};
			mockGenresService.AddGenre = jest.fn().mockRejectedValue(new Error('Invalid data'));

			await expect(genresController.AddGenre(invalidGenreDto)).rejects.toThrow('Invalid data');
			expect(genresService.AddGenre).toHaveBeenCalledWith(invalidGenreDto);
		});
	});

	/**
	 * Tests for the `AddMultipleGenres` method.
	 */
	describe('AddMultipleGenres', () => {
		it('should add multiple genres successfully', async () => {
			const createGenresDto: CreateGenreDto[] = [
				{ name: 'Action' },
				{ name: 'Drama' },
			];
			const expectedGenres = [
				{ id: 1, name: 'Action' },
				{ id: 2, name: 'Drama' },
			];

			mockGenresService.AddMultipleGenres.mockResolvedValue(expectedGenres);

			const result = await genresController.AddMultipleGenres(createGenresDto);
			expect(result).toEqual(expectedGenres);
			expect(genresService.AddMultipleGenres).toHaveBeenCalledWith(createGenresDto);
		});

		it('should throw an error if service fails', async () => {
			const createGenresDto: CreateGenreDto[] = [
				{ name: 'Invalid Genre' },
			];

			mockGenresService.AddMultipleGenres.mockRejectedValue(new Error('Service error'));

			await expect(genresController.AddMultipleGenres(createGenresDto)).rejects.toThrow('Service error');
			expect(genresService.AddMultipleGenres).toHaveBeenCalledWith(createGenresDto);
		});
	});

	/**
	 * Tests for the `UpdateGenre` method.
	 */
	describe('UpdateGenre', () => {
		it('should update an existing genre', async () => {
			const updateGenreDto: UpdateGenreDto = {
				name: 'Action',
			};
			const updatedGenre = { id: 1, ...updateGenreDto };
			mockGenresService.UpdateGenre.mockReturnValue(updatedGenre);

			const result = await genresController.UpdateGenre(1, updateGenreDto);
			expect(result).toEqual(updatedGenre);
			expect(genresService.UpdateGenre).toHaveBeenCalledWith(1, updateGenreDto);
		});

		it('should throw GenreNotFoundException if genre to update does not exist', async () => {
			const updateGenreDto: UpdateGenreDto = {
				name: 'Non-existent Genre',
			};
			mockGenresService.UpdateGenre = jest.fn().mockRejectedValue(new GenreNotFoundException(99));

			await expect(genresController.UpdateGenre(99, updateGenreDto)).rejects.toThrow(GenreNotFoundException);
			expect(genresService.UpdateGenre).toHaveBeenCalledWith(99, updateGenreDto);
		});

		it('should throw an error if provided ID is negative', async () => {
			const updateGenreDto: UpdateGenreDto = {
				name: 'Invalid Update',
			};
			mockGenresService.UpdateGenre = jest.fn().mockRejectedValue(new Error('Invalid ID'));

			await expect(genresController.UpdateGenre(-1, updateGenreDto)).rejects.toThrow('Invalid ID');
			expect(genresService.UpdateGenre).toHaveBeenCalledWith(-1, updateGenreDto);
		});
	});

	/**
	 * Tests for the `DeleteGenre` method.
	 */
	describe('DeleteGenre', () => {
		it('should delete a genre by ID', async () => {
			const result = await genresController.DeleteGenre(1);
			expect(result).toEqual({ deleted: true });
			expect(genresService.DeleteGenre).toHaveBeenCalledWith(1);
		});

		it('should throw GenreNotFoundException if genre to delete does not exist', async () => {
			mockGenresService.DeleteGenre = jest.fn().mockRejectedValue(new GenreNotFoundException(99));

			await expect(genresController.DeleteGenre(99)).rejects.toThrow(GenreNotFoundException);
			expect(genresService.DeleteGenre).toHaveBeenCalledWith(99);
		});

		it('should throw an error if provided ID is negative', async () => {
			mockGenresService.DeleteGenre = jest.fn().mockRejectedValue(new Error('Invalid ID'));

			await expect(genresController.DeleteGenre(-1)).rejects.toThrow('Invalid ID');
			expect(genresService.DeleteGenre).toHaveBeenCalledWith(-1);
		});
	});
});