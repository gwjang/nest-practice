import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('should return a movie', () => {
      service.create({ title: 'Test Movie', genres: ['test'], year: 2000 });
      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    });
    it('should throw 404 error', () => {
      try {
        service.getOne(999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Movie 999 not found');
        expect(error.status).toEqual(404);
      }
    });
  });

  describe('deleteOne', () => {
    it('deletes a movie', () => {
      service.create({ title: 'Test Movie', genres: ['test'], year: 2000 });
      const allMoviesCount = service.getAll().length;
      service.deleteOne(1);
      const afterDeleteCount = service.getAll().length;
      expect(afterDeleteCount).toBeLessThan(allMoviesCount);
    });
    it('should throw 404 error', () => {
      try {
        service.deleteOne(999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Movie 999 not found');
        expect(error.status).toEqual(404);
      }
    });
  });

  describe('create', () => {
    it('should create a movie', () => {
      const beforeCreateCount = service.getAll().length;
      service.create({ title: 'Test Movie', genres: ['test'], year: 2000 });
      const afterCreateCount = service.getAll().length;
      expect(afterCreateCount).toBeGreaterThan(beforeCreateCount);
    });
  });

  describe('updateh', () => {
    it('should update a movie', () => {
      service.create({ title: 'Test Movie', genres: ['test'], year: 2000 });
      service.update(1, {
        title: 'Test Movie 2',
        genres: ['test'],
        year: 2000,
      });
      const movie = service.getOne(1);
      expect(movie.title).toEqual('Test Movie 2');
    });
    it('should throw a NotFoundException', () => {
      try {
        service.update(999, {});
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.status).toEqual(404);
      }
    });
  });
});
