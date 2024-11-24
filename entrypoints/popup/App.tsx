import { ParentComponent } from 'solid-js'
import { css } from '@/styled-system/css'
import { A } from '@solidjs/router'
import SettingsIcon from 'lucide-solid/icons/settings'
import Speech from 'lucide-solid/icons/speech'

const App: ParentComponent = (props) => {
  return (
    <main
      class={css({
        padding: '4',
        width: 'lg',
      })}
    >
      <div
        class={css({
          borderWidth: 'thin',
          borderStyle: 'solid',
          borderColor: 'zinc.300',
          borderRadius: 'sm',
          overflow: 'hidden',
          display: 'flex',
          '& > .active': {
            color: 'white',
            backgroundColor: 'zinc.500',
          },
          '& > *': {
            padding: '1',
            flexGrow: '1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '& > *:first-child': {
              marginRight: '1',
              width: '4',
            },
          },
        })}
      >
        <A href={'/speech'}>
          <Speech />
          <span>TTS</span>
        </A>
        <A href={'/settings'}>
          <SettingsIcon />
          <span>设置</span>
        </A>
      </div>
      <div class={css({ padding: '2' })}>{props.children}</div>
    </main>
  )
}

export default App
