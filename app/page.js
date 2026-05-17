"use client";
import { useState, useEffect } from "react";

const floatingNotes = ["🎵", "🎶", "🎼", "🎸", "🎹", "🎺", "🎻", "🥁"];

export default function Home() {
  const [situation, setSituation] = useState("");
  const [loading, setLoading] = useState(false);
  const [emotion, setEmotion] = useState(null);
  const [songs, setSongs] = useState([]);
  const [videoIds, setVideoIds] = useState({});
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: floatingNotes[Math.floor(Math.random() * floatingNotes.length)],
      left: Math.random() * 100,
      duration: 8 + Math.random() * 10,
      delay: Math.random() * 5,
      size: 16 + Math.random() * 20,
    }));
    setNotes(generated);
  }, []);

  async function getYoutubeId(query, songId) {
    try {
      const res = await fetch("/api/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.videoId) {
        setVideoIds((prev) => ({ ...prev, [songId]: data.videoId }));
      }
    } catch (err) {
      console.error("YouTube fetch error:", err);
    }
  }

  async function handleAnalyze() {
    if (!situation.trim()) return;
    setLoading(true);
    setEmotion(null);
    setSongs([]);
    setVideoIds({});

    try {
      const emotionRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation }),
      });
      const emotionData = await emotionRes.json();
      setEmotion(emotionData);

      const songsRes = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchQuery: emotionData.searchQuery,
          energyLevel: emotionData.energyLevel,
        }),
      });
      const songsData = await songsRes.json();
      setSongs(songsData.tracks);

      songsData.tracks.forEach((song) => {
        getYoutubeId(song.youtubeQuery, song.id);
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  const bgColor = emotion?.colorMood || "#0f0f0f";

  return (
    <>
      <style>{`
        @keyframes float {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.2; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.1); }
          50% { box-shadow: 0 0 40px rgba(255,255,255,0.25); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .float-note {
          position: fixed;
          animation: float linear infinite;
          pointer-events: none;
          z-index: 0;
          user-select: none;
        }
        .fade-slide-up {
          animation: fadeSlideUp 0.6s ease forwards;
        }
        .glass {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .glass-input {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .glow-btn {
          animation: pulse-glow 2s ease-in-out infinite;
          transition: all 0.3s ease;
        }
        .glow-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(29, 185, 84, 0.5) !important;
        }
        .song-card {
          animation: fadeSlideUp 0.5s ease forwards;
          opacity: 0;
        }
        .song-card:nth-child(1) { animation-delay: 0.1s; }
        .song-card:nth-child(2) { animation-delay: 0.2s; }
        .song-card:nth-child(3) { animation-delay: 0.3s; }
        .song-card:nth-child(4) { animation-delay: 0.4s; }
        .song-card:nth-child(5) { animation-delay: 0.5s; }
        .loading-dots::after {
          content: '';
          animation: dots 1.5s steps(4, end) infinite;
        }
        @keyframes dots {
          0%, 20% { content: ''; }
          40% { content: '.'; }
          60% { content: '..'; }
          80%, 100% { content: '...'; }
        }
      `}</style>

      <main
        className="min-h-screen flex flex-col items-center justify-start p-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${bgColor}ee 0%, ${bgColor}99 50%, #000000 100%)`,
          transition: "background 2s ease",
        }}
      >
        {/* Floating Notes */}
        {notes.map((note) => (
          <span
            key={note.id}
            className="float-note"
            style={{
              left: `${note.left}%`,
              fontSize: `${note.size}px`,
              animationDuration: `${note.duration}s`,
              animationDelay: `${note.delay}s`,
            }}
          >
            {note.emoji}
          </span>
        ))}

        <div className="w-full max-w-2xl relative z-10">
          {/* Header */}
          <div className="text-center mb-10 mt-8 fade-slide-up">
            <div className="text-6xl mb-4">🎵</div>
            <h1
              className="text-6xl font-black text-white mb-3 tracking-tight"
              style={{ textShadow: "0 0 40px rgba(255,255,255,0.3)" }}
            >
              MoodSync
            </h1>
            <p className="text-white text-opacity-60 text-lg font-light">
              Tell me how you feel. I will find your perfect song.
            </p>
          </div>

          {/* Input Card */}
          <div className="glass rounded-3xl p-6 mb-6 fade-slide-up">
            <textarea
              className="w-full bg-transparent text-white placeholder-white placeholder-opacity-40 text-lg outline-none resize-none leading-relaxed"
              rows={4}
              placeholder="Describe your mood... It's 2am, I just finished a project I worked on for months. Everyone's asleep. I feel proud but also empty..."
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="mt-4 w-full py-4 rounded-2xl text-white font-bold text-lg glow-btn"
              style={{
                background: loading
                  ? "rgba(255,255,255,0.2)"
                  : "linear-gradient(135deg, #1db954, #17a349)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <span className="loading-dots">Finding your perfect song</span>
              ) : (
                "Find My Song 🎵"
              )}
            </button>
          </div>

          {/* Emotion Card */}
          {emotion && (
            <div className="glass rounded-3xl p-6 mb-6 fade-slide-up">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: emotion.colorMood, boxShadow: `0 0 10px ${emotion.colorMood}` }}
                />
                <h2 className="text-2xl font-bold text-white capitalize">
                  {emotion.primaryEmotion}
                </h2>
              </div>
              <p className="text-white text-opacity-70 mb-4 leading-relaxed">
                {emotion.reason}
              </p>
              <div className="flex flex-wrap gap-2">
                {emotion.subEmotions.map((e) => (
                  <span
                    key={e}
                    className="px-3 py-1 rounded-full text-sm text-white font-medium"
                    style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Song Cards */}
          {songs.length > 0 && (
            <div className="flex flex-col gap-5">
              {songs.map((song) => (
                <div key={song.id} className="glass rounded-3xl p-5 song-card">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={song.image}
                      alt={song.name}
                      className="w-16 h-16 rounded-2xl"
                      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-lg truncate">
                        {song.name}
                      </h3>
                      <p className="text-white text-opacity-60 text-sm truncate">
                        {song.artist}
                      </p>
                      <p className="text-white text-opacity-40 text-xs truncate">
                        {song.album}
                      </p>
                    </div>
                    <a
                      href={song.spotifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-shrink-0 px-4 py-2 rounded-xl text-xs text-white font-bold"
                      style={{
                        background: "linear-gradient(135deg, #1db954, #17a349)",
                        boxShadow: "0 4px 15px rgba(29,185,84,0.3)",
                      }}
                    >
                      Spotify
                    </a>
                  </div>

                  {videoIds[song.id] ? (
                    <div
                      className="rounded-2xl overflow-hidden"
                      style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }}
                    >
                      <iframe
                        width="100%"
                        height="215"
                        src={`https://www.youtube.com/embed/${videoIds[song.id]}?autoplay=0`}
                        title={song.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div
                      className="rounded-2xl h-20 flex items-center justify-center"
                      style={{ background: "rgba(0,0,0,0.3)" }}
                    >
                      <p className="text-white text-opacity-40 text-sm">
                        Loading player...
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="h-12" />
        </div>
      </main>
    </>
  );
}