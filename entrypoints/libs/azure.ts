import he from 'he'

type Voice = {
  id: string
  name: string
}

const timeout = 10000

const getEndpoint = (region: string, path?: string): string => {
  region = encodeURIComponent(region)
  path = path || ''
  return `https://${region}.tts.speech.microsoft.com${path}`
}

const createHeaders = (key: string): Record<string, string> => {
  return {
    'Ocp-Apim-Subscription-Key': key,
  }
}

type VoiceListRes = {
  ShortName: string
  LocalName: string
  Gender: string
  Locale: string
}[]

export const getVoices = async (
  region: string,
  key: string,
): Promise<Voice[]> => {
  const endpoint = getEndpoint(region, '/cognitiveservices/voices/list')
  return fetch(endpoint, {
    method: 'GET',
    headers: createHeaders(key),
    signal: AbortSignal.timeout(timeout),
  })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`can not fetch voice list, status: ${res.status}`)
      }
      return res.json() as Promise<VoiceListRes>
    })
    .then((body) => {
      return body
        .map((item) => {
          const id = item.ShortName
          const name = `${item.LocalName} / ${item.Gender} / ${item.Locale}`
          return { id, name }
        })
        .sort((...items) => {
          const ws = [0, 0]
          for (let i = 0; i < items.length; i++) {
            const item = items[i]
            if (item.id.includes('Multilingual')) {
              ws[i] += 1 << 0
            }
            if (item.id.includes('zh')) {
              ws[i] += 1 << 1
            }
            if (item.id.includes('CN')) {
              ws[i] += 1 << 2
            }
          }
          return ws[1] - ws[0]
        })
    })
    .catch((e) => {
      console.error(e)
      return []
    })
}

export const getAudio = async (
  text: string,
  config: {
    region: string
    key: string
    voiceId: string
  },
): Promise<Blob> => {
  const ssml = createSSML(text, config)
  const endpoint = getEndpoint(config.region, '/cognitiveservices/v1')
  const headers = createHeaders(config.key)
  headers['X-Microsoft-OutputFormat'] = 'audio-48khz-192kbitrate-mono-mp3'
  headers['Content-Type'] = 'application/ssml+xml'
  return fetch(endpoint, {
    method: 'POST',
    headers,
    body: ssml,
    signal: AbortSignal.timeout(timeout),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`can not fetch audio, status: ${res.status}`)
      }
      return res.blob()
    })
    .catch((e) => {
      console.error(e)
      return new Blob()
    })
}

const createSSML = (
  text: string,
  config: { voiceId: string; rate?: number; volume?: number },
) => {
  text = he.escape(text)
  // range: 0.5 ~ 2 / -50% ~ 100%, default: 1 / 0%
  const rate = config.rate || 1
  // range: 0.0 ~ 100.0, default: 100
  const volume = config.volume || 100
  return (
    `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">` +
    `<voice name="${config.voiceId}">` +
    `<prosody rate="${rate}" volume="${volume}">` +
    text +
    '</prosody>' +
    '</voice>' +
    '</speak>'
  )
}
