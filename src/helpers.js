import axios from 'axios'
import ytdl from 'ytdl-core'
import config from '../config.js'
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
            Authorization: `Basic ${Buffer.from(
              `${spotify_client_id}:${spotify_client_secret}`
            ).toString('base64')}`,
          },
        }
      )
      .then(res => {
        return res.data.access_token
      })
  } catch (error) {
    console.log(error)
  }
}

export const getSongs = async interaction => {
  const query = interaction.options.get('query').value || 'Default query'

  const spotifyPlaylist = await getSpotifyPlaylist(query)
  if (spotifyPlaylist) return spotifyPlaylist

  const spotifySong = await getSpotifySong(query)
  if (spotifySong) return spotifySong

  const youtubePlaylist = getYoutubePlaylist(query)
  if (youtubePlaylist) return youtubePlaylist

  const youtubeSong = searchVideo(query)
  if (youtubeSong) return youtubeSong

  return 'Fire inc Nowhere fast'
}

export const getYoutubePlaylist = async query => {
  const youtubeListId = query.replace(
    /.+youtube.com\/watch\?v=.+&list=(.+)/,
    '$1'
  )

  if (!youtubeListId) return

  try {
    return await axios
      .get(
        `${yt_uri}playlistItems?part=snippet%2CcontentDetails&maxResults=25&playlistId=${youtubeListId}&key=${yt_api_key}`
      )
      .then(async res => {
        return res.data.items.map(({ video }) => video.snippet.title)
      })
  } catch (error) {
    console.log(error)
  }
}

export const getSpotifySong = async query => {
  const spotifyId = query.replace(
    /.+open.spotify.com\/track\/(.+)\?si=.+/,
    '$1'
  )
  if (!spotifyId) return

  try {
    return await axios
      .get(`${spotify_uri}/tracks${spotifyId}`, {
        headers: { Authorization: `Bearer ${await getSpotifyToken()}` },
      })
      .then(async ({ data }) => `${data.artists.name} ${data.name}`)
  } catch (error) {
    console.log(error)
  }
}

export const getSpotifyPlaylist = async query => {
  const spotifyListId = query.replace(
    /https.+spotify.com\/playlist\/(.+?)[\?|\/].+/,
    '$1'
  )

  if (!spotifyListId) return

  try {
    return await axios
      .get(
        `${spotify_uri}playlists/${spotifyListId}?fields=tracks.items(track(name%2C%20artists.name))`,
        {
          headers: { Authorization: `Bearer ${await getSpotifyToken()}` },
        }
      )
      .then(async res => {
        return res.data.tracks.items.map(
          ({ track }) => `${track.artists[0].name} ${track.name}`
        )
      })
  } catch (error) {
    console.log(error)
  }
}

export const searchVideo = async query => {
  console.log('Query', query)
  // prettier-ignore
  const defaultUrl = `${yt_uri}${encodeURIComponent('nowhere fast fire inc')}&key=${yt_api_key}`
  const url = `${yt_uri}search?part=id&type=video&q=${encodeURIComponent(
    query
  )}&key=${yt_api_key}`

  return await axios.get(url).then(async res => {
    if (!res.data.items[0]) {
      return await axios.get(defaultUrl).then(res => res.data.items[0])
    } else {
      return res.data.items[0]
    }
  })
}

export const getVideoInfo = async video => {
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
