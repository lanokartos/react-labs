import { track } from '../analytics.js'

export function withAnalytics(Component, event) {
  function WithAnalytics({ onClick, analyticsData, ...props }) {
    function handleClick(e) {
      if (analyticsData !== undefined) {
        track(event, analyticsData)
      } else {
        track(event)
      }
      onClick?.(e)
    }

    return <Component onClick={handleClick} {...props} />
  }

  const componentName = Component.displayName || Component.name || 'Component'
  WithAnalytics.displayName = `withAnalytics(${componentName})`

  return WithAnalytics
}
