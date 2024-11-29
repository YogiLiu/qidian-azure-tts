import { render } from 'solid-js/web'
import Button from '@/entrypoints/chapter.content/Button'

export default defineContentScript({
  matches: ['*://www.qidian.com/chapter/*'],
  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'div#r-menu',
      append: 'first',
      onMount: (container) => {
        container.className = 'tooltip-wrapper relative flex mb-8px'
        render(() => <Button />, container)
      },
    })
    ui.mount()
  },
})
