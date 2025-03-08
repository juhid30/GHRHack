import { useState } from "react";

const SpotifyPlayer = () => {
  const [songName, setSongName] = useState("");
  const [trackId, setTrackId] = useState(null);
  const [error, setError] = useState("");

  const fetchSong = async () => {
    setError(""); // Clear previous errors
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/search_song?song=${encodeURIComponent(songName)}`
      );
      const data = await response.json();

      if (data.track_id) {
        setTrackId(data.track_id);
      } else {
        setError("Song not found!");
      }
    } catch (error) {
      console.error("Error fetching song:", error);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-bold">Spotify Song Player</h2>
      <input
        type="text"
        className="border p-2 m-2 rounded"
        placeholder="Enter song name"
        value={songName}
        onChange={(e) => setSongName(e.target.value)}
      />
      <button
        className="bg-green-500 text-white p-2 rounded"
        onClick={fetchSong}
      >
        Play Song
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {trackId && (
        <iframe
          src={`https://open.spotify.com/embed/track/${trackId}`}
          width="300"
          height="80"
          frameBorder="0"
          allow="encrypted-media"
          className="mt-4"
        ></iframe>
      )}
    </div>
  );
};

export default SpotifyPlayer;
