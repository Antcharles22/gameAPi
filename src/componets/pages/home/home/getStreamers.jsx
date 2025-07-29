import React, { useEffect, useState } from "react";
import { getTwitchToken, getTopTwitchStreams } from "../../stores/homestore";

// ...existing imports...

export default function TwitchStreams() {
  const [streams, setStreams] = useState([]);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    async function fetchStreams() {
      const token = await getTwitchToken();
      const topStreams = await getTopTwitchStreams(token);
      setStreams(topStreams);
    }
    fetchStreams();
  }, []);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
      {streams.map(stream => (
        <div
          key={stream.id}
          onMouseEnter={() => setHovered(stream.user_login)}
          onMouseLeave={() => setHovered(null)}
          onDoubleClick={() => window.open(`https://twitch.tv/${stream.user_login}`, "_blank")}
          style={{ width: 320, height: 180, position: "relative", cursor: "pointer" }}
        >
          {hovered === stream.user_login ? (
            <iframe
              src={`https://player.twitch.tv/?channel=${stream.user_login}&parent=localhost`}
              height="180"
              width="320"
              allowFullScreen
              frameBorder="0"
              title={stream.user_name}
            />
          ) : (
            <img
              src={stream.thumbnail_url.replace("{width}", "320").replace("{height}", "180")}
              alt={stream.user_name}
              width={320}
              height={180}
              style={{ borderRadius: "8px" }}
            />
          )}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            color: "#fff",
            background: "rgba(0,0,0,0.6)",
            width: "100%",
            padding: "4px"
          }}>
            {stream.user_name}
          </div>
        </div>
      ))}
    </div>
  );
}