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
