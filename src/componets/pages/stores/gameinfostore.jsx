import axios from "axios";
import { create } from "zustand";

const API_Key = 'b75a02282f2b4b77b72eab9bbcd88ce2';

const showStore = create((set) => ({
    game: null,

    fetchdata: async (id) => {
        const response = await axios.get(`https://api.rawg.io/api/games/${id}?key=${API_Key}`);
        set({ game: response.data });

        
    }
}));

export default showStore;


