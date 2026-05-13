import { useEffect, useMemo, useState } from 'react'

const REPO_URL = 'https://github.com/Rethinking-studio/clawpilot-skills'
const CC_CONNECT_URL =
  'https://raw.githubusercontent.com/chenhg5/cc-connect/refs/heads/main/INSTALL.md'

const runtimeLabels = {
  openclaw: 'OpenClaw',
  hermes: 'Hermes',
  ccconnect: 'Coding Agent',
}

const runtimeInstructions = {
  zh: {
    openclaw:
      '这台主机应按 OpenClaw 配对。生成配对码时请使用 clawpilot pair --runtime openclaw。',
    hermes:
      '这台主机应按 Hermes 配对。生成配对码时请使用 clawpilot pair --runtime hermes，并确认本地 Hermes API 健康可用。',
    ccconnect: `这台主机应按 Coding Agent 主机配对，用于 Codex、Claude Code、Gemini CLI、Cursor Agent 或类似本地 coding agent。请按照 ${CC_CONNECT_URL} 安装 cc-connect，然后运行 clawpilot prepare-ccconnect 生成带 PocketClaw 占位 channel 的 ~/.cc-connect/config.toml，不要改成 dummy platform，也不要要求我选择 Feishu、Telegram、Discord、WeCom 或 Weixin。确认 cc-connect 已作为 daemon 安装并重启后，最后使用 clawpilot pair --runtime ccconnect 生成配对码。`,
  },
  en: {
    openclaw:
      'This host should pair as OpenClaw. When generating the pairing code, use clawpilot pair --runtime openclaw.',
    hermes:
      'This host should pair as Hermes. When generating the pairing code, use clawpilot pair --runtime hermes and confirm the local Hermes API is healthy and reachable.',
    ccconnect: `This host should pair as a Coding Agent host for Codex, Claude Code, Gemini CLI, Cursor Agent, or similar local coding agents. Install cc-connect by following ${CC_CONNECT_URL}, then run clawpilot prepare-ccconnect to generate ~/.cc-connect/config.toml with a PocketClaw placeholder channel. Do not switch it to dummy platform, and do not ask me to choose Feishu, Telegram, Discord, WeCom, or Weixin. After confirming cc-connect is installed as a daemon and restarted, use clawpilot pair --runtime ccconnect to generate the pairing code.`,
  },
}

const basePrompt = {
  zh: `请先从这个仓库安装 clawpilot skills，并严格按下面要求执行：
${REPO_URL}

1. 先直接运行 \`npm install -g @rethinkingstudio/clawpilot@latest\`，确保本机的 \`clawpilot\` 命令已经是最新版。涉及后台常驻时不要使用 \`npx\`。
2. 如果这是 Linux 或 Windows 主机，并且之前装过旧版 ClawPilot，请在升级后额外执行一次 \`clawpilot install\`，让后台服务迁移到 pm2。
3. 完成后，请使用 \`clawpilot-pair\` skill 帮我完成 PocketClaw 配对。
4. 严格按 skill 的步骤执行，不要跳过检查。
5. 如果成功，请把最终 8 位配对码单独放一行，方便我复制。
6. 如果失败，请直接告诉我卡在哪一步，以及下一条应该执行的命令。

{runtime-specific-instruction}`,
  en: `Please install the clawpilot skills from this repository first, then follow every instruction below strictly:
${REPO_URL}

1. Run \`npm install -g @rethinkingstudio/clawpilot@latest\` first and make sure the local \`clawpilot\` command is the latest version. Do not use \`npx\` for anything that needs to stay installed in the background.
2. If this is a Linux or Windows host and an older ClawPilot was previously installed, run \`clawpilot install\` once after upgrading so the background service is migrated to pm2.
3. After that, use the \`clawpilot-pair\` skill to complete PocketClaw pairing for me.
4. Follow the skill step by step and do not skip checks.
5. If successful, print the final 8-digit pairing code on its own line so I can copy it easily.
6. If it fails, tell me exactly which step failed and the next command that should be run.

{runtime-specific-instruction}`,
}

const copyByLanguage = {
  zh: {
    back: '返回首页',
    label: 'PocketClaw 配对',
    title: '将 PocketClaw 连接到运行 Agent 的电脑',
    intro:
      '这个页面会帮你生成一段可直接发给 Agent 的完整指令，让它在电脑上完成安装、检查并输出 PocketClaw 配对码。',
    languageLabel: '语言',
    runtimeLabel: '选择运行环境',
    promptCopied: '完整指令已复制',
    repoCopied: '仓库链接已复制',
    codeCopied: '配对码已复制',
    copyPrompt: '复制给 Agent 的完整指令',
    copyRepo: '复制 skill 仓库链接',
    copyCode: '复制配对码',
    mobileHint:
      '如果你正在手机上查看此页面，请把下面的指令发给运行 Agent 的电脑。配对命令需要在电脑上执行。',
    codeTitle: '回到 PocketClaw 输入此配对码',
    codeBody: '回到 PocketClaw，点击“手动输入代码”并输入这个配对码。',
    repoLabel: 'Skill 仓库',
    repoNote:
      '仓库说明保留在这里作为补充信息，但主流程只需要把完整指令复制给 Agent。',
    stepsTitle: '配对步骤',
    steps: [
      '选择你要配对的主机类型',
      '复制完整指令，发给电脑上的 Agent',
      '等待 Agent 输出 8 位配对码',
      '回到 PocketClaw，扫码或输入配对码完成绑定',
    ],
  },
  en: {
    back: 'Back Home',
    label: 'PocketClaw Pairing',
    title: 'Connect PocketClaw to the computer running your Agent',
    intro:
      'This page generates a complete prompt you can send directly to your Agent so it can install dependencies, run checks, and return a PocketClaw pairing code.',
    languageLabel: 'Language',
    runtimeLabel: 'Choose runtime',
    promptCopied: 'Full prompt copied',
    repoCopied: 'Repository link copied',
    codeCopied: 'Pairing code copied',
    copyPrompt: 'Copy Full Prompt for Agent',
    copyRepo: 'Copy Skill Repository Link',
    copyCode: 'Copy Pairing Code',
    mobileHint:
      'If you are viewing this on your phone, send the prompt below to the computer running your Agent. Pairing commands must run on that computer.',
    codeTitle: 'Return to PocketClaw and enter this pairing code',
    codeBody:
      'Go back to PocketClaw, tap "Enter code manually", and enter this pairing code.',
    repoLabel: 'Skill Repository',
    repoNote:
      'The repository remains here as a secondary reference, but the main flow should only require copying the full prompt to your Agent.',
    stepsTitle: 'Pairing Steps',
    steps: [
      'Choose the host type you want to pair',
      'Copy the full prompt and send it to the Agent on that computer',
      'Wait for the Agent to output an 8-digit pairing code',
      'Return to PocketClaw and scan or enter the pairing code',
    ],
  },
}

function getInitialState() {
  const params = new URLSearchParams(window.location.search)
  const explicitLang = params.get('lang')
  const explicitRuntime = params.get('runtime')
  const isZh = navigator.language.toLowerCase().startsWith('zh')

  return {
    language: explicitLang === 'zh' || explicitLang === 'en' ? explicitLang : isZh ? 'zh' : 'en',
    runtime:
      explicitRuntime === 'openclaw' ||
      explicitRuntime === 'hermes' ||
      explicitRuntime === 'ccconnect'
        ? explicitRuntime
        : 'ccconnect',
  }
}

function isMobileClient() {
  return /iphone|ipad|android/i.test(navigator.userAgent)
}

function readPairingParams() {
  const params = new URLSearchParams(window.location.search)

  return {
    code: params.get('code')?.trim() || '',
    device: params.get('device')?.trim() || '',
    expires: params.get('expires')?.trim() || '',
  }
}

function updateSearchParams(language, runtime) {
  const url = new URL(window.location.href)

  url.searchParams.set('lang', language)
  url.searchParams.set('runtime', runtime)

  window.history.replaceState({}, '', `${url.pathname}?${url.searchParams.toString()}`)
}

function buildPrompt(language, runtime) {
  return basePrompt[language].replace(
    '{runtime-specific-instruction}',
    runtimeInstructions[language][runtime],
  )
}

export function PocketClawPairingPage() {
  const initial = useMemo(() => getInitialState(), [])
  const [language, setLanguage] = useState(initial.language)
  const [runtime, setRuntime] = useState(initial.runtime)
  const [feedback, setFeedback] = useState('')
  const copy = copyByLanguage[language]
  const pairing = useMemo(() => readPairingParams(), [])
  const promptText = useMemo(() => buildPrompt(language, runtime), [language, runtime])
  const mobileClient = useMemo(() => isMobileClient(), [])

  useEffect(() => {
    updateSearchParams(language, runtime)
  }, [language, runtime])

  async function copyText(text, message) {
    await navigator.clipboard.writeText(text)
    setFeedback(message)
    window.setTimeout(() => setFeedback(''), 1800)
  }

  return (
    <main className="page-shell pairing-shell">
      <div className="studio-canvas pairing-canvas">
        <header className="site-header pairing-header">
          <a className="logo" href="/">
            Rethinking.
          </a>
          <div className="pairing-header-actions">
            <div className="pairing-language-switch" aria-label={copy.languageLabel}>
              <button
                className={`pairing-language-button${language === 'en' ? ' is-active' : ''}`}
                onClick={() => setLanguage('en')}
                type="button"
              >
                EN
              </button>
              <button
                className={`pairing-language-button${language === 'zh' ? ' is-active' : ''}`}
                onClick={() => setLanguage('zh')}
                type="button"
              >
                中文
              </button>
            </div>
            <a className="eyebrow pairing-back" href="/">
              {copy.back}
            </a>
          </div>
        </header>

        <section className="pairing-hero">
          <p className="eyebrow pairing-label">{copy.label}</p>
          <h1>{copy.title}</h1>
          <p className="pairing-intro">{copy.intro}</p>
          {mobileClient ? <div className="pairing-mobile-hint">{copy.mobileHint}</div> : null}
        </section>

        <section className="pairing-flow-block">
          <div className="pairing-flow-card">
            <div className="pairing-runtime-header">
              <p className="eyebrow">{copy.runtimeLabel}</p>
              <div className="pairing-runtime-grid">
                {Object.entries(runtimeLabels).map(([value, label]) => (
                  <button
                    key={value}
                    className={`pairing-runtime-button${runtime === value ? ' is-active' : ''}`}
                    onClick={() => setRuntime(value)}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pairing-prompt-actions">
              <button
                className="pairing-copy-button pairing-copy-button-primary"
                onClick={() => copyText(promptText, copy.promptCopied)}
                type="button"
              >
                {copy.copyPrompt}
              </button>
              <button
                className="pairing-copy-button"
                onClick={() => copyText(REPO_URL, copy.repoCopied)}
                type="button"
              >
                {copy.copyRepo}
              </button>
            </div>

            {feedback ? <div className="eyebrow pairing-copy-feedback">{feedback}</div> : null}
          </div>
        </section>

        {pairing.code ? (
          <section className="pairing-code-block">
            <div className="pairing-code-card">
              <p className="eyebrow">{pairing.device || runtimeLabels[runtime]}</p>
              <div className="pairing-code">{pairing.code}</div>
              <h2>{copy.codeTitle}</h2>
              <p className="pairing-code-note">{copy.codeBody}</p>
              {pairing.expires ? <p className="pairing-code-expiry">{pairing.expires}</p> : null}
              <button
                className="pairing-copy-button pairing-copy-button-primary"
                onClick={() => copyText(pairing.code, copy.codeCopied)}
                type="button"
              >
                {copy.copyCode}
              </button>
            </div>
          </section>
        ) : null}

        <section className="pairing-repo-block">
          <div className="section-header eyebrow">{copy.repoLabel}</div>
          <div className="pairing-repo-card">
            <p className="pairing-repo-note">{copy.repoNote}</p>
            <code className="pairing-repo-url">{REPO_URL}</code>
          </div>
        </section>

        <section className="pairing-notes">
          <div className="section-header eyebrow">{copy.stepsTitle}</div>
          <div className="pairing-steps">
            {copy.steps.map((step) => (
              <div key={step} className="pairing-step-card">
                {step}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
