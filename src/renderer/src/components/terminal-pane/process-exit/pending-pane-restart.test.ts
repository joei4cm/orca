import { describe, expect, it } from 'vitest'
import {
  enterPendingPaneRestart,
  hasPendingPaneRestart,
  leavePendingPaneRestart
} from './pending-pane-restart'
import { hasPendingRetentionSpawnWork } from '../parking/retention/terminal-hidden-worktree-retention'

const NO_PENDING_STARTUP: Readonly<Record<string, unknown>> = {}

describe('pending pane restart', () => {
  it('keeps the tab park-exempt until every restart on it settles', () => {
    enterPendingPaneRestart('tab-1')
    enterPendingPaneRestart('tab-1')
    expect(hasPendingPaneRestart('tab-1')).toBe(true)

    leavePendingPaneRestart('tab-1')
    expect(hasPendingPaneRestart('tab-1')).toBe(true)

    leavePendingPaneRestart('tab-1')
    expect(hasPendingPaneRestart('tab-1')).toBe(false)
  })

  it('treats a bindingless tab as pending spawn work while its restart is in flight', () => {
    const tab = { id: 'tab-2', ptyId: null, pendingActivationSpawn: undefined }
    expect(hasPendingRetentionSpawnWork(tab, NO_PENDING_STARTUP)).toBe(false)

    enterPendingPaneRestart('tab-2')
    expect(hasPendingRetentionSpawnWork(tab, NO_PENDING_STARTUP)).toBe(true)

    leavePendingPaneRestart('tab-2')
    expect(hasPendingRetentionSpawnWork(tab, NO_PENDING_STARTUP)).toBe(false)
  })

  it('ignores a leave that no restart entered', () => {
    leavePendingPaneRestart('tab-3')
    expect(hasPendingPaneRestart('tab-3')).toBe(false)
  })
})
