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
        <LoaderCircle class={css({ animation: 'spin' }) + ' text-24px'} />
        <span class='text-bo4 text-s-gray-500 mt-2px group-hover:text-primary-red-500'>阅读中</span>
      </Show>
      <Show when={!props.speeching}>
        <Speech class='text-24px' />
        <span class='text-bo4 text-s-gray-500 mt-2px group-hover:text-primary-red-500'>阅读</span>
      </Show>
    </>
  )
}

export default Status
