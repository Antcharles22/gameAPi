import React from "react";
import showStore from "../stores/gameinfostore";
import { useParams } from "react-router-dom";

export default function GameInfo() {
    const store = showStore();
    const params = useParams();

    React.useEffect(() => {
        store.fetchdata(params.id);
    }, [params.id, store]);

    const game = store.game;

    return (
        <div>
            <h2>About the Game</h2>
            {game ? (
                <div>
                    <h3>{game.name}</h3>
                    <img src={game.background_image} alt={game.name} style={{ width: "400px" }} />
                    <p><strong>Released:</strong> {game.released}</p>
                    <p><strong>Rating:</strong> {game.rating}</p>
                    <p><strong>Genres:</strong> {game.genres && game.genres.map(g => g.name).join(", ")}</p>
                    <p><strong>Platforms:</strong> {game.platforms && game.platforms.map(p => p.platform.name).join(", ")}</p>
                    <p><strong>Publishers:</strong> {game.publishers && game.publishers.map(p => p.name).join(", ")}</p>
                    <p><strong>Description:</strong> {game.description_raw}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}