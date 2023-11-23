import axios from 'axios'
import ytdl from 'ytdl-core'
import config from '../config/default.js'
const {
  yt_uri,
  yt_api_key,
  spotify_client_id,
  spotify_client_secret,
  spotify_uri,
} = config
import qs from 'qs'

const getSpotifyToken = async () => {
  try {
    return await axios
      .post(
        'https://accounts.spotify.com/api/token',
        qs.stringify({
          grant_type: 'client_credentials',
        }),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            // eslint-disable-next-line no-undef
            Authorization: `Basic ${Buffer.from(
              `${spotify_client_id}:${spotify_client_secret}`
            ).toString('base64')}`,
          },
        }
      )
      .then((res) => {
        return res.data.access_token
      })
  } catch (error) {
    console.log(error)
  }
}

export const getSong = async (interaction) => {
  const query = interaction.options.getString('input') || 'Default input'

  // Dev playlists
  // https://open.spotify.com/playlist/73Y4s2rMeug9gX0jWEBqvh?si=2f125daa45f04ee0
  //

  const spotifyPlaylist = await getSpotifyPlaylist(query)
  console.log('spotifyPlaylist', spotifyPlaylist)
  if (spotifyPlaylist) return spotifyPlaylist

  const spotifySong = await getSpotifySong(query)
  console.log('spotifySong', spotifySong)
  if (spotifySong) return spotifySong

  const youtubePlaylist = await getYoutubePlaylist(query)
  console.log('youtubePlaylist', youtubePlaylist)
  if (youtubePlaylist) return youtubePlaylist

  const youtubeSong = await searchVideo(query)
  console.log('youtubeSong', youtubeSong)
  if (youtubeSong) return [youtubeSong.id.videoId]

  return ['Fire inc Nowhere fast']
}

export const getSongs = async (interaction) => {
  const query = interaction.options.getString('input') || 'Default query'

  // Dev playlists
  // https://open.spotify.com/playlist/73Y4s2rMeug9gX0jWEBqvh?si=2f125daa45f04ee0
  //

  const spotifyPlaylist = await getSpotifyPlaylist(query)
  console.log('spotifyPlaylist', spotifyPlaylist)
  if (spotifyPlaylist) return spotifyPlaylist

  const spotifySong = await getSpotifySong(query)
  console.log('spotifySong', spotifySong)
  if (spotifySong) return spotifySong

  const youtubePlaylist = await getYoutubePlaylist(query)
  console.log('youtubePlaylist', youtubePlaylist)
  if (youtubePlaylist) return youtubePlaylist

  const youtubeSong = await searchVideo(query)
  console.log('youtubeSong', youtubeSong)
  if (youtubeSong) return [youtubeSong.id.videoId]

  return ['Fire inc Nowhere fast']
}

export const getSpotifyPlaylist = async (query) => {
  const pattern = /https.+spotify.com\/playlist\/(.+?)[\?|\/].+/
  const spotifyListId = query.match(pattern) ? query.replace(pattern, '$1') : ''

  if (!spotifyListId) return

  try {
    return await axios
      .get(
        `${spotify_uri}playlists/${spotifyListId}?fields=tracks.items(track(name,artists.name))`,
        {
          headers: { Authorization: `Bearer ${await getSpotifyToken()}` },
        }
      )
      .then(async (res) => {
        return res.data.tracks.items.map(
          ({ track }) => `${track.artists[0].name} ${track.name}`
        )
      })
  } catch (error) {
    console.log(error)
    return
  }
}

export const getSpotifySong = async (query) => {
  const pattern = /.+open.spotify.com\/track\/(.+)\?si=.+/
  const spotifyId = query.match(pattern) ? query.replace(pattern, '$1') : ''
  if (!spotifyId) return

  try {
    return await axios
      .get(`${spotify_uri}tracks/${spotifyId}`, {
        headers: { Authorization: `Bearer ${await getSpotifyToken()}` },
      })
      .then(async ({ data }) => [`${data.artists[0].name} ${data.name}`])
  } catch (error) {
    console.log(error)
  }
}

export const getYoutubePlaylist = async (query) => {
  const pattern = /.+youtube.com\/.+[&|?]list=(.+)/
  const youtubeListId = query.match(pattern) ? query.replace(pattern, '$1') : ''

  if (!youtubeListId) return

  console.log('youtubeListId', youtubeListId)

  try {
    return await axios
      .get(
        `${yt_uri}playlistItems?part=snippet%2CcontentDetails&maxResults=25&playlistId=${youtubeListId}&key=${yt_api_key}`
      )
      .then(async ({ data }) => {
        return data.items.map((video) => video.snippet.title)
      })
  } catch (error) {
    console.log(error)
  }
}

export const searchVideo = async (query) => {
  console.log('searchQuery', query)
  const url = `${yt_uri}search?part=id&type=video&q=${encodeURIComponent(
    query
  )}&key=${yt_api_key}`

  return await axios
    .get(url)
    .then((res) => {
      if (!res.data.items[0]) return
      return res.data.items[0]
    })
    .catch(function (error) {
      console.log(error.toJSON())
    })
}

export const getVideoInfo = async (video) => {
  let info = await ytdl.getBasicInfo(video.id.videoId)
  console.log('Getting info', info.player_response.videoDetails.title)
  return info.player_response.videoDetails.title
}

export const validateInteraction = async (interaction, callback) => {
  if (!interaction.member || !interaction.member.voice.channel) {
    return await interaction.reply({
      content: 'You are not in a voice channel!',
      ephemeral: true,
    })
  }
  if (
    interaction.guild.me.voice.channelId &&
    interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
  ) {
    return await interaction.reply({
      content: 'You are not in my voice channel!',
      ephemeral: true,
    })
  }

  return callback()
}
