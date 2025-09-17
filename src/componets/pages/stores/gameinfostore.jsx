import axios from "axios";
import { create } from "zustand";


const API_Key = '64a66ea3c1624447bfeb3bcd7f094e6a';

const showStore = create((set) => ({
    game: null,

    fetchdata: async (id) => {
        const response = await axios.get(`https://api.rawg.io/api/games/${id}?key=${API_Key}`);
        set({ game: response.data });

        
    }
}));



export default showStore;


