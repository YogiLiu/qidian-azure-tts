import { Component, createSignal, JSX } from 'solid-js'
import Status from '@/entrypoints/chapter.content/Status'
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
      try {
        await reader()!.pause()
        setSpeeching(false)
      } catch (e) {
        console.error(e)
      }
    } else {
      setInitialized(true)
      try {
        if (!initialized()) {
          await reader()!.init()
          await reader()!.play()
        } else {
          await reader()!.resume()
        }
      } catch (e) {
        setInitialized(false)
        console.error(e)
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
