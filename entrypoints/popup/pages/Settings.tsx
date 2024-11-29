import { Component, createUniqueId, JSX } from 'solid-js'
import { css } from '@/styled-system/css'
import { createAsync } from '@solidjs/router'
import store from '@/entrypoints/utils/store'
import Eye from 'lucide-solid/icons/eye'
import EyeOff from 'lucide-solid/icons/eye-off'
import { Dynamic } from 'solid-js/web'

const Settings: Component = () => {
  const region = createAsync(store.region.getValue, { initialValue: '' })
  const key = createAsync(store.key.getValue, { initialValue: '' })

  const reginId = createUniqueId()
  const keyId = createUniqueId()

  const handleRegion: JSX.ChangeEventHandler<HTMLInputElement, Event> = async (
    e,
  ) => {
    const value = e.currentTarget.value
    await store.region.setValue(value)
  }
  const handleKey: JSX.ChangeEventHandler<HTMLInputElement, Event> = async (
    e,
  ) => {
    const value = e.currentTarget.value
    await store.key.setValue(value)
  }
  const handlePwSwitch: JSX.EventHandler<HTMLButtonElement, MouseEvent> = () =>
    setShowPw((v) => !v)

  const [showPw, setShowPw] = createSignal(false)
  const pwType = createMemo(() => (showPw() ? 'text' : 'password'))
  const btnIcon = createMemo(() => (showPw() ? EyeOff : Eye))
  return (
    <div
      class={css({
        '& > *': {
          marginY: '2',
          '& > label': {
            display: 'block',
            fontSize: 'md',
            color: 'zinc.600',
            marginBottom: '1',
          },
          '& input': {
            display: 'block',
            width: 'full',
            outline: 'none',
            flexGrow: '1',
          },
          '& > div': {
            borderStyle: 'solid',
            borderWidth: 'thin',
            borderColor: 'zinc.500',
            borderRadius: 'sm',
            padding: '1',
            display: 'flex',
            _focusWithin: {
              outlineStyle: 'solid',
              outlineWidth: 'medium',
              outlineColor: 'zinc.300',
            },
          },
        },
      })}
    >
      <div>
        <label for={reginId}>位置 / 区域</label>
        <div>
          <input
            id={reginId}
            type="text"
            value={region()}
            onChange={handleRegion}
          />
        </div>
      </div>
      <div>
        <label for={keyId}>密钥</label>
        <div>
          <input
            id={keyId}
            type={pwType()}
            value={key()}
            onChange={handleKey}
          />
          <button
            onClick={handlePwSwitch}
            class={css({
              marginLeft: '1',
              cursor: 'pointer',
              color: 'zinc.600',
              '& > *:first-child': {
                width: '4',
              },
            })}
          >
            <Dynamic component={btnIcon()} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
