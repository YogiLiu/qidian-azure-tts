import { Component, createSignal, JSX } from 'solid-js'
import Status from '@/entrypoints/chapter.content/Status'
import './style.css'
import { Reader } from '@/entrypoints/chapter.content/speech'
import { createAsync } from '@solidjs/router'

const Button: Component = () => {
  const reader = createAsync(Reader.create)

  const [initialized, setInitialized] = createSignal(false)
  const [speeching, setSpeeching] = createSignal(false)
  const handleSpeech: JSX.EventHandler<
    HTMLButtonElement,
    MouseEvent
  > = async () => {
    if (!reader()) {
      console.error('Reader is not ready.')
      return
    }
    if (speeching()) {
      setSpeeching(false)
      await reader()!.pause()
    } else {
      setSpeeching(true)
      if (!initialized()) {
        await reader()!.init()
        setInitialized(true)
        await reader()!.play()
      } else {
        await reader()!.resume()
      }
    }
  }
  return (
    <button
      onClick={handleSpeech}
      class="w-64px h-64px flex flex-col items-center justify-center rounded-8px bg-sheet-b-gray-50 text-s-gray-900 noise-bg group hover:bg-sheet-b-bw-white hover:text-primary-red-500 hover:bg-none"
    >
      <Status speeching={speeching()} />
    </button>
  )
}

export default Button
