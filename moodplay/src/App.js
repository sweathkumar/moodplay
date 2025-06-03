import React, { useState } from "react";
import axios from "axios";

const backendURL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [mood, setMood] = useState("");
  const [tracks, setTracks] = useState([]);

  const fetchToken = async () => {
    try {
      const response = await axios.get(`${backendURL}/token`);
      return response.data.access_token;
    } catch (err) {
      console.error("Failed to get access token:", err.message);
      return null;
    }
  };

  const searchTracks = async () => {
    const token = await fetchToken();
    if (!token) return;

    try {
      const result = await axios.get(
        `https://api.spotify.com/v1/search?q=${mood}&type=track&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTracks(result.data.tracks.items);
    } catch (err) {
      console.error("Spotify search error:", err.message);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
        color: "white",
      }}
    >
      {/* Header */}
      <header className="py-3 text-center bg-dark text-white shadow">
        <h1>MoodPlay 🎧</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow-1 d-flex justify-content-center align-items-center py-4 px-3">
        <div className="container">
          <div className="row g-4">
            {/* Left Input Card */}
            <div className="col-md-4">
              <div className="card shadow-lg">
                <div className="card-body">
                  <h4 className="card-title mb-3 text-primary">
                    🎵 What's your mood?
                  </h4>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="e.g., happy, sad, chill"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                  />
                  <button
                    className="btn btn-primary w-100"
                    onClick={searchTracks}
                  >
                    Generate Playlist
                  </button>
                </div>
              </div>
            </div>

            {/* Right Playlist Card */}
            <div className="col-md-8">
              <div className="card shadow-lg" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <div className="card-body bg-light text-dark">
                  <h5 className="mb-3">🎧 Recommended Tracks</h5>
                  {tracks.length === 0 ? (
                    <p className="text-muted">Your songs will appear here after search.</p>
                  ) : (
                    <ul className="list-group">
                      {tracks.map((track) => (
                        <li
                          className="list-group-item d-flex align-items-center justify-content-between flex-wrap"
                          key={track.id}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={track.album.images[2]?.url}
                              alt="thumb"
                              className="rounded"
                              width="50"
                              height="50"
                            />
                            <div>
                              <div className="fw-semibold">{track.name}</div>
                              <small className="text-muted">
                                {track.artists[0].name}
                              </small>
                            </div>
                          </div>
                          <div className="text-end">
                            {track.preview_url ? (
                              <audio controls src={track.preview_url} style={{ width: "150px" }} />
                            ) : (
                              <small>No preview</small>
                            )}
                            <div>
                              <a
                                href={track.external_urls.spotify}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-success mt-1"
                              >
                                Open
                              </a>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-2 text-center bg-dark text-white small">
        Built with 💙 by Sweathkumar projects @ 2025
      </footer>
    </div>
  );
}

export default App;
