// A pane restart clears its tab and leaf bindings before its replacement spawn is admitted; retention
// force-park reads a bindingless tab as evictable, so it must see the in-flight restart instead.

const pendingRestartCountsByTabId = new Map<string, number>()

export function enterPendingPaneRestart(tabId: string): void {
  pendingRestartCountsByTabId.set(tabId, (pendingRestartCountsByTabId.get(tabId) ?? 0) + 1)
}

export function leavePendingPaneRestart(tabId: string): void {
  const count = pendingRestartCountsByTabId.get(tabId)
  if (count === undefined) {
    return
  }
  if (count <= 1) {
    pendingRestartCountsByTabId.delete(tabId)
    return
  }
  pendingRestartCountsByTabId.set(tabId, count - 1)
}

export function hasPendingPaneRestart(tabId: string): boolean {
  return pendingRestartCountsByTabId.has(tabId)
}
