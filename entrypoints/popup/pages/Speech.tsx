import { Component, createResource, JSX, Suspense, For, Show } from 'solid-js'
import store from '@/entrypoints/utils/store'
import LoaderCircle from 'lucide-solid/icons/loader-circle'
import AudioLines from 'lucide-solid/icons/audio-lines'
import { css } from '@/styled-system/css'
import { getAudio, getVoices } from '@/entrypoints/utils/azure'
import { action, createAsync } from '@solidjs/router'

const initialText = 'I can eat glass.\n我能吞下玻璃而不伤身体。'

const Speech: Component = () => {
  const [voices] = createResource(
    async () => {
      const region = await store.region.getValue()
      const key = await store.key.getValue()
      return getVoices(region, key)
    },
    { initialValue: [] },
  )
  const voicesLen = () => voices().length
  const disableSelect = () => !voicesLen()

  const defaultVoice = createAsync(store.voice.getValue)
  const handleVoice: JSX.ChangeEventHandler<HTMLSelectElement, Event> = async (
    e,
  ) => {
    const value = e.currentTarget.value
    await store.voice.setValue(value)
  }

  const [textLen, setTextLen] = createSignal(initialText.length)
  const handleInput: JSX.EventHandler<HTMLTextAreaElement, InputEvent> = (
    e,
  ) => {
    const value = e.currentTarget.value
    setTextLen(value.trim().length)
  }
  const disableSpeech = createMemo(() => {
    return textLen() === 0 || voicesLen() === 0
  })

  const [playing, setPlaying] = createSignal(false)
  const region = createAsync(store.region.getValue, { initialValue: '' })
  const key = createAsync(store.key.getValue, { initialValue: '' })
  const handleSubmit = action(async (data: FormData) => {
    const voiceId = data.get('voice') as string
    let text = data.get('text') as string
    if (!voiceId) {
      return
    }
    if (!text) {
      return
    } else {
      text = text.trim()
    }
    setPlaying(true)
    const el = document.createElement('audio')
    try {
      const audio = await getAudio(text, {
        region: region(),
        key: key(),
        voiceId,
      })
      el.src = URL.createObjectURL(audio)
    } catch (e) {
      console.error(e)
      setPlaying(false)
    }
    document.body.appendChild(el)
    el.addEventListener('ended', () => {
      document.body.removeChild(el)
      setPlaying(false)
    })
    await el.play()
  })
  return (
    <Suspense
      fallback={
        <div
          class={css({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingY: '10',
          })}
        >
          <LoaderCircle class={css({ animation: 'spin' })} />
        </div>
      }
    >
      <form action={handleSubmit} method="post">
        <div>
          <label
            class={css({
              color: 'zinc.600',
              fontSize: 'md',
              marginBottom: '1',
            })}
          >
            说话人
          </label>
          <select
            name="voice"
            onChange={handleVoice}
            class={css({
              width: 'full',
              padding: '1',
              borderStyle: 'solid',
              borderWidth: 'thin',
              borderColor: 'zinc.500',
              borderRadius: 'sm',
              _focusWithin: {
                outlineStyle: 'solid',
                outlineWidth: 'medium',
                outlineColor: 'zinc.300',
              },
            })}
            disabled={disableSelect()}
          >
            <For each={voices()} fallback={<option>找不到说话人</option>}>
              {(voice) => (
                <option value={voice.id} selected={voice.id === defaultVoice()}>
                  {voice.name}
                </option>
              )}
            </For>
          </select>
        </div>
        <div class={css({ marginTop: '2' })}>
          <label
            class={css({
              color: 'zinc.600',
              fontSize: 'md',
              marginBottom: '1',
            })}
          >
            测试
          </label>
          <div
            class={css({
              borderStyle: 'solid',
              borderWidth: 'thin',
              borderColor: 'zinc.500',
              borderRadius: 'sm',
              padding: 1,
              _focusWithin: {
                outlineStyle: 'solid',
                outlineWidth: 'medium',
                outlineColor: 'zinc.300',
              },
            })}
          >
            <textarea
              name="text"
              class={css({ width: 'full', resize: 'none', outline: 'none' })}
              rows={6}
              onInput={handleInput}
            >
              {initialText}
            </textarea>
            <div
              class={css({
                borderStyle: 'dashed',
                borderBottomWidth: 'thin',
                borderColor: 'zinc.300',
                marginY: '1',
              })}
            />
            <div class={css({ display: 'flex', justifyContent: 'right' })}>
              <Show when={playing()}>
                <LoaderCircle
                  class={css({
                    animation: 'spin',
                    height: '4',
                    color: 'zinc.300',
                  })}
                />
              </Show>
              <Show when={!playing()}>
                <button
                  type="submit"
                  class={css({
                    cursor: 'pointer',
                    _disabled: { color: 'zinc.300' },
                  })}
                  disabled={disableSpeech()}
                >
                  <AudioLines class={css({ height: '4' })} />
                </button>
              </Show>
            </div>
          </div>
        </div>
      </form>
    </Suspense>
  )
}

export default Speech
