export function track(event, data) {
  console.info('[analytics]', event, data ?? {})
}
