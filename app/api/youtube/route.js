import axios from "axios";

export async function POST(request) {
  try {
    const { query } = await request.json();

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: query,
          type: "video",
          videoCategoryId: "10",
          maxResults: 1,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    const video = response.data.items[0];
    const videoId = video.id.videoId;

    return Response.json({ videoId });
  } catch (err) {
    console.error("YouTube error:", err.message);
    return Response.json({ videoId: null });
  }
}