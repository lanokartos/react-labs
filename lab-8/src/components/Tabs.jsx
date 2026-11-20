import { createContext, useContext, useId, useState } from 'react'

const TabsContext = createContext(null)

function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs compound components must be rendered inside <Tabs>')
  }
  return context
}

export default function Tabs({ defaultValue, children }) {
  const [selectedTab, setSelectedTab] = useState(defaultValue)
  const baseId = useId()

  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab, baseId }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  )
}

function List({ children, onKeyDown, ...props }) {
  function handleKeyDown(e) {
    onKeyDown?.(e)
    const tabs = Array.from(
      e.currentTarget.querySelectorAll('[role="tab"]:not([disabled])'),
    )
    const currentIndex = tabs.indexOf(e.target)
    if (currentIndex === -1) return

    let nextIndex

    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    } else if (e.key === 'Home') {
      e.preventDefault()
      nextIndex = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      nextIndex = tabs.length - 1
    } else {
      return
    }

    tabs[nextIndex]?.focus()
    tabs[nextIndex]?.click()
  }

  return (
    <div
      role="tablist"
      className="tab-list"
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  )
}

function Tab({ value, children, ...props }) {
  const { selectedTab, setSelectedTab, baseId } = useTabsContext()
  const isActive = selectedTab === value
  const tabId = `${baseId}-tab-${value}`
  const panelId = `${baseId}-panel-${value}`

  return (
    <button
      type="button"
      role="tab"
      id={tabId}
      aria-controls={panelId}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      className={isActive ? 'active' : ''}
      onClick={() => setSelectedTab(value)}
      {...props}
    >
      {children}
    </button>
  )
}

function Panel({ value, children, ...props }) {
  const { selectedTab, baseId } = useTabsContext()
  const isActive = selectedTab === value
  const tabId = `${baseId}-tab-${value}`
  const panelId = `${baseId}-panel-${value}`

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      tabIndex={0}
      hidden={!isActive}
      {...props}
    >
      {children}
    </div>
  )
}

Tabs.List = List
Tabs.Tab = Tab
Tabs.Panel = Panel
