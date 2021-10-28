export default {
  prefix: '!',
  token: process.env.DISCORD_TOKEN,
  activityType: 'PLAYING',
  activity: process.env.BOT_ACTIVITY,
  yt_api_key: process.env.YOUTUBE_API_KEY,
  yt_uri: "https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=",
  yt_generic: "https://www.youtube.com/watch?v=",
  spotify_uri: "https://api.spotify.com/v1/playlists/",
  spotify_client_id: process.env.SPOTIFY_CLIENT_ID,
  spotify_client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  spotify_base64_token: process.env.SPOTIFY_BASE64_TOKEN
}