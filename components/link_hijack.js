export default function (event) {
  // https://dennisreimann.de/articles/delegating-html-links-to-vue-router.html
  // ensure we use the link, in case the click has been received by a subelement
  let { target } = event
  while (target && target.tagName !== 'A') target = target.parentNode
  // handle only links that occur inside the component and do not reference external resources
  if (target && target.matches(".MDText a:not([href*='://'])") && target.href) {
    // some sanity checks taken from vue-router:
    // https://github.com/vuejs/vue-router/blob/dev/src/components/link.js#L106
    const { altKey, ctrlKey, metaKey, shiftKey, button, defaultPrevented } = event
    // don't handle with control keys
    if (metaKey || altKey || ctrlKey || shiftKey) return
    // don't handle when preventDefault called
    if (defaultPrevented) return
    // don't handle right clicks
    if (button !== undefined && button !== 0) return
    // don't handle if `target="_blank"`
    if (target && target.getAttribute) {
      const linkTarget = target.getAttribute('target')
      if (/\b_blank\b/i.test(linkTarget)) return
    }
    // don't handle same page links/anchors
    const url = new URL(target.href)
    const to = url.pathname
    if (to.match(/^https?:\/\//) || to.match(/^\/cdn\//)) {
      setTimeout(() => window.open(to, '_blank'), 500)
      return 
    }
    if (window.location.pathname !== to && event.preventDefault) {
      event.preventDefault()
      this.$router.push(to)
    }
  }
}