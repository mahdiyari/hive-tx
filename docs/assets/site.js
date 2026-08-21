const page = document.body.dataset.page
document.querySelectorAll('aside a[data-page]').forEach((a) => {
  if (a.dataset.page === page) a.classList.add('current')
})
const menu = document.querySelector('.menu-btn')
const aside = document.querySelector('aside')
if (menu && aside) {
  menu.addEventListener('click', () => {
    const open = aside.classList.toggle('open')
    menu.setAttribute('aria-expanded', String(open))
  })
}
document.querySelectorAll('pre').forEach((pre) => {
  pre.addEventListener('dblclick', () => {
    const text = pre.innerText
    navigator.clipboard.writeText(text).catch(() => {})
  })
})
if (window.hljs) {
  window.hljs.highlightAll()
}

const THEME_KEY = 'hive-tx-theme'
const themeBtn = document.querySelector('[data-theme-toggle]')
const themeNow = () =>
  document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem(THEME_KEY, theme)
  if (themeBtn) {
    themeBtn.textContent = theme === 'dark' ? 'Light' : 'Dark'
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Use light theme' : 'Use dark theme')
  }
}
setTheme(themeNow())
if (themeBtn) {
  themeBtn.addEventListener('click', () => setTheme(themeNow() === 'dark' ? 'light' : 'dark'))
}
