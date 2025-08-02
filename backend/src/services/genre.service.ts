import { Genre, IGenre } from "../models/genre.model";

export class GenreService {
  // Create a new genre
  async createGenre(genreData: Partial<IGenre>): Promise<IGenre> {
    const genre = new Genre(genreData);
    return await genre.save();
  }

  // Get all genres with pagination
  async getAllGenres(
    page: number = 1,
    limit: number = 10,
    activeOnly: boolean = true
  ) {
    const skip = (page - 1) * limit;
    const filter = activeOnly ? { isActive: true } : {};

    const [genres, total] = await Promise.all([
      Genre.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
      Genre.countDocuments(filter),
    ]);

    return {
      genres,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get genre by ID
  async getGenreById(id: string): Promise<IGenre | null> {
    return await Genre.findById(id);
  }

  // Get genre by slug
  async getGenreBySlug(slug: string): Promise<IGenre | null> {
    return await Genre.findOne({ slug, isActive: true });
  }

  // Update genre
  async updateGenre(
    id: string,
    updateData: Partial<IGenre>
  ): Promise<IGenre | null> {
    return await Genre.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  // Delete genre (soft delete by setting isActive to false)
  async deleteGenre(id: string): Promise<boolean> {
    const result = await Genre.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    return !!result;
  }

  // Hard delete genre
  async hardDeleteGenre(id: string): Promise<boolean> {
    const result = await Genre.findByIdAndDelete(id);
    return !!result;
  }

  // Get genres by IDs
  async getGenresByIds(ids: string[]): Promise<IGenre[]> {
    return await Genre.find({ _id: { $in: ids }, isActive: true });
  }

  // Search genres
  async searchGenres(query: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(query, "i");
    const filter = {
      $or: [{ name: searchRegex }, { description: searchRegex }],
      isActive: true,
    };

    const [genres, total] = await Promise.all([
      Genre.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
      Genre.countDocuments(filter),
    ]);

    return {
      genres,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get popular genres (can be extended based on content count)
  async getPopularGenres(limit: number = 10): Promise<IGenre[]> {
    return await Genre.find({ isActive: true })
      .sort({ name: 1 })
      .limit(limit)
      .lean();
  }

  // Check if genre exists
  async genreExists(id: string): Promise<boolean> {
    const genre = await Genre.findById(id);
    return !!genre;
  }

  // Get all active genres (for dropdowns, etc.)
  async getActiveGenres(): Promise<IGenre[]> {
    return await Genre.find({ isActive: true }).sort({ name: 1 }).lean();
  }
}
