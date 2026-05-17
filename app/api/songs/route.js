import axios from "axios";

export async function POST(request) {
  try {
    const { searchQuery } = await request.json();

    const response = await axios.get("https://itunes.apple.com/search", {
      params: {
        term: searchQuery,
        media: "music",
        limit: 5,
      },
    });

    const tracks = response.data.results.map((track) => ({
      id: track.trackId,
      name: track.trackName,
      artist: track.artistName,
      album: track.collectionName,
      image: track.artworkUrl100,
      previewUrl: track.previewUrl,
      spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent(track.trackName + " " + track.artistName)}`,
      youtubeQuery: `${track.trackName} ${track.artistName} official`,
    }));

    return Response.json({ tracks });
  } catch (err) {
    console.error("Songs error:", err.message);
    return Response.json({ tracks: [] });
  }
}