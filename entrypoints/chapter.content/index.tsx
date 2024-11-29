export default defineContentScript({
  matches: ['*://www.qidian.com/chapter/*'],
  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'div#r-menu',
      append: 'first',
      onMount: (container) => {
        const btn = document.createElement('button')
        btn.textContent = 'app'
        container.append(btn)
        container.className = 'tooltip-wrapper relative flex mb-8px'
      }
    })
    ui.mount()
  },
})