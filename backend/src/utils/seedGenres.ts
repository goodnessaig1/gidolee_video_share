import { connectDB } from "../config/db";
import { Genre } from "../models/genre.model";

const initialGenres = [
  {
    name: "Comedy",
    description: "Funny and entertaining content",
    slug: "comedy",
  },
  {
    name: "Drama",
    description: "Serious and emotional content",
    slug: "drama",
  },
  {
    name: "Action",
    description: "High-energy and exciting content",
    slug: "action",
  },
  {
    name: "Romance",
    description: "Love and relationship content",
    slug: "romance",
  },
  {
    name: "Horror",
    description: "Scary and thrilling content",
    slug: "horror",
  },
  {
    name: "Sci-Fi",
    description: "Science fiction and futuristic content",
    slug: "sci-fi",
  },
  {
    name: "Documentary",
    description: "Educational and informative content",
    slug: "documentary",
  },
  {
    name: "Music",
    description: "Musical performances and content",
    slug: "music",
  },
  {
    name: "Sports",
    description: "Athletic and sports-related content",
    slug: "sports",
  },
  {
    name: "Travel",
    description: "Travel and adventure content",
    slug: "travel",
  },
  {
    name: "Food",
    description: "Cooking and culinary content",
    slug: "food",
  },
  {
    name: "Technology",
    description: "Tech reviews and tutorials",
    slug: "technology",
  },
  {
    name: "Fashion",
    description: "Style and fashion content",
    slug: "fashion",
  },
  {
    name: "Gaming",
    description: "Video games and gaming content",
    slug: "gaming",
  },
  {
    name: "Education",
    description: "Learning and educational content",
    slug: "education",
  },
];

async function seedGenres() {
  try {
    await connectDB();
    console.log("Connected to database");

    // Clear existing genres
    await Genre.deleteMany({});
    console.log("Cleared existing genres");

    // Insert new genres
    const genres = await Genre.insertMany(initialGenres);
    console.log(`Seeded ${genres.length} genres:`);

    genres.forEach((genre) => {
      console.log(`- ${genre.name} (${genre.slug})`);
    });

    console.log("Genre seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding genres:", error);
    process.exit(1);
  }
}

seedGenres();
