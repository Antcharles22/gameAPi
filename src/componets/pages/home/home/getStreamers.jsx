import React, { useEffect, useState } from "react";
import api from "../../../../lib/api";

export default function TwitchStreams({ gameId = null }) {
  const [streams, setStreams] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchStreams() {
      setLoading(true);
      setError(null);
      try {
        const params = gameId ? { game_id: gameId, first: 9 } : { first: 9 };
        const res = await api.get("/api/twitch/streams", { params });
        if (mounted) setStreams(res.data || []);
      } catch (err) {
        const backendMessage = err?.response?.data?.message || err?.response?.data || err?.message;
        console.error("Failed to load twitch streams:", backendMessage);
        if (mounted) setError(typeof backendMessage === "string" ? backendMessage : JSON.stringify(backendMessage));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchStreams();
    return () => { mounted = false; };
  }, [gameId]);

  if (loading) return <div>Loading Twitch streams...</div>;
  if (error) return <div style={{ color: "orange" }}>Twitch unavailable: {error}</div>;
  if (!streams.length) return <div>No live streams found.</div>;

  const parentHost = window.location.hostname.split(":")[0];

  return (
    <>
      <h2>Twitch Streams</h2>
      <div className="twitch-streams" style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginLeft: "200px", marginTop: "100px" }}>
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
              src={`https://player.twitch.tv/?channel=${stream.user_login}&parent=${parentHost}`}
              height="180"
              width="320"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              frameBorder="0"
              title={stream.user_name}
            />
          ) : (
            <img
              src={stream.thumbnail_url?.replace("{width}", "320")?.replace("{height}", "180")}
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
    </>
  );
  
}