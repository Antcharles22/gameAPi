import api from "../../../lib/api";
import { create } from "zustand";

let debounceTimeout;

const mapGame = (game) => ({
  id: game.id,
  name: game.name,
  background_image: game.background_image,
  rating: game.rating,
  released: game.released,
  genres: game.genres,
  platforms: game.platforms,
});

const fetchGamesFromBackend = async (params) => {
  const res = await api.get("/api/games", { params });
  return (res.data?.results || []).map(mapGame);
};

const homestore = create((set, get) => ({
  carouselGames: [],
  searchResults: [],
  query: "",
  error: null,

  setQuery: (e) => {
    const value = e.target.value;
    set({ query: value });
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => get().fetchSearchResults(), 320);
  },

  fetchCarouselGames: async () => {
    try {
      const games = await fetchGamesFromBackend({ ordering: "-added", page_size: 9 });
      set({ carouselGames: games, error: null });
    } catch (err) {
      console.error("fetchCarouselGames error:", err?.response?.data || err.message);
      set({ error: "Failed to fetch games", carouselGames: [] });
    }
  },

  fetchSearchResults: async () => {
    try {
      const query = get().query;
      const params = query ? { search: query, page_size: 8 } : { ordering: "-rating", page_size: 8 };
      const games = await fetchGamesFromBackend(params);
      set({ searchResults: games, error: null });
    } catch (err) {
      console.error("fetchSearchResults error:", err?.response?.data || err.message);
      set({ error: "Failed to fetch games", searchResults: [] });
    }
  },
}));

export default homestore;