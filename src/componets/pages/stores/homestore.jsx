import axios from "axios";
import { create } from "zustand";

const API_Key = 'b75a02282f2b4b77b72eab9bbcd88ce2';

const homestore = create((set) => ({
    games: [],

    fetchGames: async () => {
        const res = await axios.get(`https://api.rawg.io/api/games?key=${API_Key}`);

        const games = res.data.results.map((game) => ({
            id: game.id,
            name: game.name,
            background_image: game.background_image,
            rating: game.rating,
            released: game.released,
        }));

        set({ games }); // Update the state with the fetched games

       (console.log(res.data))// Return the data from the API response
    },
}));

export default homestore;

