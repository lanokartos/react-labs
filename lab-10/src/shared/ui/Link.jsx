export default function Link({ to, ...props }) {
  function handleClick(e) {
    if (e.button !== 0 || e.ctrlKey || e.shiftKey || e.metaKey || e.altKey) {
      return
    }
    e.preventDefault()
    window.location.hash = to
    window.scrollTo(0, 0)
  }

  return <a href={to} {...props} onClick={handleClick} />
}
