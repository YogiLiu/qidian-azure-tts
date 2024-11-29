import { Component, Show } from 'solid-js'
import Speech from 'lucide-solid/icons/speech'
import LoaderCircle from 'lucide-solid/icons/loader-circle'
import { css } from '@/styled-system/css'

type Props = {
  speeching: boolean
}

const Status: Component<Props> = (props) => {
  return (
    <>
      <Show when={props.speeching}>
        <LoaderCircle class={css({ animation: 'spin' })} />
        <span>阅读中</span>
      </Show>
      <Show when={!props.speeching}>
        <Speech />
        <span>阅读</span>
      </Show>
    </>
  )
}

export default Status
