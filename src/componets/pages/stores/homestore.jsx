import axios from "axios";
import { create } from "zustand";

const API_Key = 'b75a02282f2b4b77b72eab9bbcd88ce2';

const homestore = create((set, get) => ({
  games: [],
  query: '',
  error: null,

  setQuery: (e) => {
    set({ query: e.target.value });
    get().fetchGames(); // Fetch games based on the query
  },

  fetchGames: async () => {
    try {
      const query = get().query;
      // Add the search parameter if query is not empty
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
      }));

      set({ games, error: null }); // Update the state with the fetched games
    } catch (error) {
      console.error("Error fetching games:", error);
      set({ error: "Failed to fetch games" });
    }
    console.log("Games fetched:", get().games);
  }


  
}));


export default homestore;

