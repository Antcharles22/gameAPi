import axios from "axios";
import { create } from "zustand";

const API_Key = '69bv29xgmh1t0x9ccrnqgj74waasjb'

const homestore = create((set, get) => ({
    games: [],
    trending: [],
    query: '',
    error: null,

    setQuery (e) => {
        set({ query: e.target.value });
        get().fetchGames();
    }


    const res = await axios.get('https://api.igdb.com/v4/{games}', {
    headers: {
        'Client_ID': 'blx0jcj934ddhtx33o3xlecoilwsly',
        'client_secret': API_Key,
        'Authorization': `Bearer`,
    },
}); 


