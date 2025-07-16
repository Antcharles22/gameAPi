import axios from "axios";
import { create } from "zustand";

const API_Key = 'b75a02282f2b4b77b72eab9bbcd88ce2';

const homestore = create((set, get) => ({
  carouselGames: [],
  searchResults: [],
  query: '',
  error: null,

  setQuery: (e) => {
    set({ query: e.target.value });
    get().fetchSearchResults();
  },

  fetchCarouselGames: async () => {
    try {
      const url = `https://api.rawg.io/api/games?key=${API_Key}`;
      const res = await axios.get(url);
      const games = res.data.results.map((game) => ({
        id: game.id,
        name: game.name,
        background_image: game.background_image,
        rating: game.rating,
        released: game.released,
        genres: game.genres,         // <-- add this line
        platforms: game.platforms,
      }));
      set({ carouselGames: games, error: null });
    } catch (error) {
      set({ error: "Failed to fetch games" });
    }
  },

  fetchSearchResults: async () => {
    try {
      const query = get().query;
      const url = query
        ? `https://api.rawg.io/api/games?key=${API_Key}&search=${encodeURIComponent(query)}`
        : `https://api.rawg.io/api/games?key=${API_Key}`;
      const res = await axios.get(url);
      const games = res.data.results.map((game) => ({
        id: game.id,
        name: game.name,
        background_image: game.background_image,
        rating: game.rating,
        released: game.released,
        genres: game.genres,         // <-- add this line
        platforms: game.platforms,
      }));
      set({ searchResults: games, error: null });
    } catch (error) {
      set({ error: "Failed to fetch games" });
    }
  }
}));

export default homestore;

