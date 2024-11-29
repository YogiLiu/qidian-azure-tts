import store from '@/entrypoints/utils/store'
import pLimit from 'p-limit'
import { getAudio } from '@/entrypoints/utils/azure'

const concurrency = 3

export class Reader {
  private readonly audioEl: HTMLAudioElement
  private queue: Task[] = []
  private limit: ReturnType<typeof pLimit> | null = null

  constructor(
    private readonly region: string,
    private readonly key: string,
    private readonly voiceId: string,
  ) {
    this.audioEl = document.createElement('audio')
    this.audioEl.style.display = 'none'
    document.body.appendChild(this.audioEl)
  }

  static async create(): Promise<Reader> {
    const [region, key, voiceId] = await Promise.all([
      store.region.getValue(),
      store.key.getValue(),
      store.voice.getValue(),
    ])
    return new Reader(region, key, voiceId)
  }

  async init() {
    this.limit = pLimit(concurrency)
    const h1 = document.querySelector<HTMLHeadingElement>('h1.title')
    if (!h1) {
      throw new SpeechError('Can not found title.')
    }
    this.queue.push(
      new Task(h1, this.region, this.key, this.voiceId, this.limit),
    )
    const spans = document.querySelectorAll<HTMLSpanElement>(
      'main.content > p > span.content-text',
    )
    if (!spans) {
      throw new SpeechError('Can not found paragraphs.')
    }
    for (const span of spans) {
      this.queue.push(
        new Task(span, this.region, this.key, this.voiceId, this.limit),
      )
    }
  }

  async play(): Promise<void> {
    const first = this.queue.shift()
    if (!first) {
      throw new SpeechError('Can not found any text.')
    }
    this.audioEl.addEventListener('ended', () => this.taskCallback())
    await first.play(this.audioEl)
  }

  private taskCallback() {
    const nextTask = this.queue.shift()
    if (nextTask) {
      nextTask.play(this.audioEl)
    }
  }

  async pause(): Promise<void> {
    this.audioEl.pause()
  }

  async resume(): Promise<void> {
    await this.audioEl.play()
  }

  async stop(): Promise<void> {
    this.limit?.clearQueue()
    this.audioEl.removeEventListener('ended', this.taskCallback)
    this.audioEl.pause()
    this.queue.forEach((task) => task)
    this.queue = []
  }
}

class Task {
  private readonly audioPromise: Promise<Blob>

  constructor(
    private textNode: HTMLElement,
    region: string,
    key: string,
    voiceId: string,
    limit: ReturnType<typeof pLimit>,
  ) {
    let text = ''
    if (textNode instanceof HTMLHeadingElement) {
      text = textNode.firstChild?.textContent || ''
    } else if (textNode instanceof HTMLSpanElement) {
      text = textNode.textContent || ''
    }
    text = this.processText(text)
    if (text === '') {
      this.audioPromise = Promise.reject(new TaskError('empty text.'))
    }
    this.audioPromise = limit(() => getAudio(text, { key, region, voiceId }))
  }

  private processText(text: string): string {
    return text.trim()
  }

  async play(el: HTMLAudioElement): Promise<void> {
    el.pause()
    const audio = await this.audioPromise
    el.src = URL.createObjectURL(audio)
    this.scroll()
    this.setBackgroundColor(el)
    await el.play()
  }

  private scroll() {
    const height =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight
    const rect = this.textNode.getBoundingClientRect()
    const d = rect.top - height / 2
    document.documentElement.scrollBy({ top: d, behavior: 'smooth' })
  }

  private setBackgroundColor(el: HTMLAudioElement) {
    this.textNode.style.backgroundColor = '#ff000022'
    const f = () => {
      this.textNode.style.backgroundColor = ''
      el.removeEventListener('ended', f)
    }
    el.addEventListener('ended', f)
  }
}

export class ReaderError extends Error {}

export class SpeechError extends ReaderError {}

export class TaskError extends ReaderError {}
