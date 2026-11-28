import type { GlobalSettings } from '../../../../../../shared/settings/global-settings-types'
import type { RuntimeClientTarget } from '../../../../../../shared/remote-runtime/host-catalog/runtime-client-target'
import { useTranslate } from '@/i18n/use-translate'
import type { AccountSwitchCopy } from '@/lib/provider-accounts/account-switch-copy'
import { Button } from '../../../ui/button'
import {
  getHostSettingUnsupportedNote,
  getHostSettingUpdateFailedMessage,
  useHostSetting,
  useSettingsHostLabel
} from '../../host-scope/use-host-setting'
import { RunningSessionSwitchSetting } from '../running-session-switch-setting'

/** The switch decides what happens to a host's running terminals when its account switches, so it
 *  belongs to the host the pane lists: this app, or the server the client is talking to. */
export function ClaudeRunningSessionSwitchSetting({
  owner,
  copy,
  settings,
  updateSettings
}: {
  /** The host whose terminals the switch moves. */
  owner: RuntimeClientTarget
  copy: AccountSwitchCopy
  /** This app's own settings, used when the owner is this app. */
  settings: GlobalSettings
  updateSettings: (updates: Partial<GlobalSettings>) => void | Promise<void>
}): React.JSX.Element {
  const t = useTranslate()
  const hostLabel = useSettingsHostLabel(owner)
  const policy = useHostSetting({
    owner,
    settingKey: 'claudeAccountSwitchRunningSessions',
    localSettings: settings,
    updateLocalSettings: updateSettings,
    updateFailedMessage: getHostSettingUpdateFailedMessage(hostLabel, t)
  })
  const ready = policy.setting.state === 'ready'
  return (
    <>
      {policy.setting.state === 'error' && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 py-2 text-xs text-muted-foreground"
        >
          <span>
            {t(
              'accounts.claude.switchSessions.loadFailed',
              "Couldn't load the switch setting from {{host}}.",
              { host: hostLabel }
            )}
          </span>
          <Button type="button" size="sm" variant="outline" onClick={policy.retry}>
            {t('accounts.claude.switchSessions.retry', 'Try again')}
          </Button>
        </div>
      )}
      <RunningSessionSwitchSetting
        copy={copy}
        value={policy.setting.state === 'ready' ? policy.setting.value : 'ask'}
        description={
          policy.setting.state === 'unsupported'
            ? getHostSettingUnsupportedNote(hostLabel, t)
            : undefined
        }
        disabled={!ready}
        onChange={(next) => void policy.update(next)}
      />
    </>
  )
}
