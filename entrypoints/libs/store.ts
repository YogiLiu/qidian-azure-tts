import { storage } from 'wxt/storage'
import { getVoices } from '@/entrypoints/libs/azure'

const region = storage.defineItem<string>('local:azure:region', {
  fallback: 'eastasia',
})

const key = storage.defineItem<string>('local:azure:key', {
  fallback: '',
})

const voice = storage.defineItem<string>('local:azure:voice', {
  fallback: '',
  init: async () => {
    const r = await region.getValue()
    const k = await key.getValue()
    if (!r || !k) {
      return ''
    }
    const voices = await getVoices(r, k)
    if (!voices.length) {
      return ''
    }
    return voices[0].id
  },
})

export default {
  region,
  key,
  voice,
}
