# 🎵 MoodSync

> *Spotify knows what you listened to. MoodSync knows how you actually feel.*

Most music apps ask you what you want to listen to.
MoodSync asks how you actually feel — and finds the song that fits that exact moment.

Not a playlist. Not an algorithm. A song that understands you.

---

##  The Problem

You've been there. It's late. Something happened — good or bad.
You open Spotify and stare at it. Nothing feels right.
You don't want a "sad playlist". You want *the* song for *this* moment.

That's what MoodSync solves.

---

##  How It Works

```
You describe how you feel → AI reads the emotion deeply
→ Finds the perfect song → Plays it right there
→ Background changes color to match your mood
```

No searching. No scrolling. Just the right song, instantly.

---

##  Live Demo

**[moodsync-eta.vercel.app](https://moodsync-eta.vercel.app)**

Try typing something like:
- *"It's 2am, I just finished something I worked on for months. I feel proud but empty."*
- *"Sunday evening, had a great day with friends, feeling alive and grateful."*
- *"Got rejected from a job I really wanted. Feeling lost."*

---

##  Features

-  **Deep emotion reading** — not just happy/sad, but the specific flavor of your feeling
-  **Mood-reactive UI** — background color shifts with your emotion in real time
-  **Embedded YouTube player** — full songs play right inside the app, free
-  **Spotify integration** — open any song in Spotify instantly
-  **Glassmorphism design** — floating music notes, smooth animations

---

##  Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 + Tailwind CSS |
| AI / Emotion | Groq API (LLaMA 3.1) |
| Music Search | iTunes Search API |
| Video Playback | YouTube Data API v3 |
| Deployment | Vercel |

---

##  Run Locally

```bash
git clone https://github.com/narendradamera23/moodsync
cd moodsync
npm install
```

Create `.env.local`:
```
GROQ_API_KEY=your_key
YOUTUBE_API_KEY=your_key
```

```bash
npm run dev
```

---

## Built by Narendra Damera