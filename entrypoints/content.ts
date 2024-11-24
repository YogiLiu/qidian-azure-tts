export default defineContentScript({
  matches: ['*://www.qidian.com/chapter/*/*'],
  main() {
    console.log('Hello content.')
  },
})
