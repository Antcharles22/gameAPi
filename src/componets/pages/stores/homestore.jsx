import axios from "axios";
import { create } from "zustand";

const API_Key = '64a66ea3c1624447bfeb3bcd7f094e6a';

let debounceTimeout;

const homestore = create((set, get) => ({
  carouselGames: [],
  searchResults: [],
  query: '',
  error: null,

  setQuery: (e) => {
    const value = e.target.value;
    set({ query: value });

    // Debounce search
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      get().fetchSearchResults();
    }, 320); // 320ms debounce delay
  },


  fetchCarouselGames: async () => {
  try {
    const url = `http://localhost:4000/api/games?ordering=-added&page_size=9`;
    const res = await axios.get(url);
    const games = res.data.results.map((game) => ({
      id: game.id,
      name: game.name,
      background_image: game.background_image,
      rating: game.rating,
      released: game.released,
      genres: game.genres,
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
    ? `http://localhost:4000/api/games?search=${encodeURIComponent(query)}&page_size=8`
    : `http://localhost:4000/api/games?ordering=-rating&page_size=8`;
    const res = await axios.get(url);
    const games = res.data.results.map((game) => ({
      id: game.id,
      name: game.name,
      background_image: game.background_image,
      rating: game.rating,
      released: game.released,
      genres: game.genres,
      platforms: game.platforms,
    }));
    set({ searchResults: games, error: null });
  } catch (error) {
    set({ error: "Failed to fetch games" });
  }
}

}));


  export const getTwitchToken = async () => {
  const res = await axios.post('https://id.twitch.tv/oauth2/token', null, {
    params: {
      client_id: 'blx0jcj934ddhtx33o3xlecoilwsly',
      client_secret: 'v8wbpolgagtaws17yrqjitsl9pcejm',
      grant_type: 'client_credentials'
    }
  });
  return res.data.access_token;
};
export const getTopTwitchStreams = async (token) => {
  const res = await axios.get('https://api.twitch.tv/helix/streams', {
    headers: {
      'Client-ID': 'blx0jcj934ddhtx33o3xlecoilwsly',
      'Authorization': `Bearer ${token}`
    },
    params: {
      first: 12, // Number of streams to fetch
      language: 'en' // Optional: filter by language
    }
  });
  return res.data.data; // Each stream has a thumbnail_url
};



export default homestore;

