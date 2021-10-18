import axios from 'axios'
import ytdl from 'ytdl-core'
import config from '../config.js'
const { yt_uri, yt_api_key } = config

export const searchVideo = async interaction => {
  const query = interaction.options.get('query').value || 'Default query'

  console.log('Query', query)
  // prettier-ignore
  const defaultUrl = `${yt_uri}${encodeURIComponent('nowhere fast fire inc')}&key=${yt_api_key}`
  const url = `${yt_uri}${encodeURIComponent(query)}&key=${yt_api_key}`

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
