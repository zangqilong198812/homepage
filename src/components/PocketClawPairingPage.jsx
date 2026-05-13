import { useMemo, useState } from 'react'

const REPO_URL = 'https://github.com/Rethinking-studio/clawpilot-skills'

const copyByLanguage = {
  en: {
    copied: 'Repository link copied',
    copy: 'Copy Repository Link',
    back: 'Back Home',
    label: 'PocketClaw Pairing',
    title: 'Connect PocketClaw to your current device.',
    intro:
      'Give the repository below to your AI agent, then follow the pairing instructions inside PocketClaw.',
    statusFallback: 'Ready to pair',
    deviceFallback: 'Your device',
    expiresFallback: 'This pairing request stays active until it is replaced.',
    waitingTitle: 'Waiting for PocketClaw to pair',
    waitingBody:
      'Keep this page open while your phone and AI agent complete the pairing flow.',
    repoLabel: 'Repository for AI agent',
    repoNote:
      'This repository contains the pairing and setup skills the agent should use.',
    stepsTitle: 'How It Works',
    steps: [
      '1. Copy the repository link below and send it to your AI agent.',
      '2. Open PocketClaw on your phone and start a pairing session.',
      '3. Ask the agent to follow the repository instructions and complete the connection.',
    ],
    languageLabel: 'Language',
  },
  zh: {
    copied: '仓库链接已复制',
    copy: '复制仓库地址',
    back: '返回首页',
    label: 'PocketClaw 配对',
    title: '将 PocketClaw 连接到你当前的设备。',
    intro:
      '把下面这个仓库地址发给 AI agent，然后按照 PocketClaw 里的说明完成配对。',
    statusFallback: '等待配对',
    deviceFallback: '当前设备',
    expiresFallback: '该配对请求在被替换前会一直有效。',
    waitingTitle: '等待 PocketClaw 完成配对',
    waitingBody: '保持这个页面开启，等待手机端和 AI agent 完成整个配对流程。',
    repoLabel: '给 AI agent 的仓库',
    repoNote: '这个仓库里包含了 agent 需要使用的配对与初始化 skills。',
    stepsTitle: '使用方式',
    steps: [
      '1. 复制下面的仓库地址并发给你的 AI agent。',
      '2. 在手机里打开 PocketClaw，发起一个新的配对会话。',
      '3. 让 agent 按照仓库说明完成连接流程。',
    ],
    languageLabel: '语言',
  },
}

function getPreferredLanguage() {
  const params = new URLSearchParams(window.location.search)
  const explicitLang = params.get('lang')

  if (explicitLang === 'zh' || explicitLang === 'en') {
    return explicitLang
  }

  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

function parsePairingState(language) {
  const params = new URLSearchParams(window.location.search)
  const dictionary = copyByLanguage[language]

  return {
    code: params.get('code') ?? '------',
    device: params.get('device') ?? dictionary.deviceFallback,
    status: params.get('status') ?? dictionary.statusFallback,
    expires: params.get('expires') ?? dictionary.expiresFallback,
  }
}

export function PocketClawPairingPage() {
  const [language, setLanguage] = useState(getPreferredLanguage)
  const [copied, setCopied] = useState(false)
  const copy = copyByLanguage[language]
  const pairing = useMemo(() => parsePairingState(language), [language])

  async function handleCopy() {
    await navigator.clipboard.writeText(REPO_URL)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
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
        </section>

        <section className="pairing-card">
          <div className="pairing-status eyebrow">{pairing.status}</div>
          <div className="pairing-code">{pairing.code}</div>
          <div className="pairing-meta">
            <span>{pairing.device}</span>
            <span>{pairing.expires}</span>
          </div>
        </section>

        <section className="pairing-waiting-block">
          <div className="pairing-waiting-card">
            <div className="pairing-waiting-indicator" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <h2>{copy.waitingTitle}</h2>
            <p>{copy.waitingBody}</p>
          </div>
        </section>

        <section className="pairing-repo-block">
          <div className="section-header eyebrow">{copy.repoLabel}</div>
          <div className="pairing-repo-card">
            <p className="pairing-repo-note">{copy.repoNote}</p>
            <code className="pairing-repo-url">{REPO_URL}</code>
            <div className="pairing-repo-actions">
              <button className="pairing-copy-button" onClick={handleCopy} type="button">
                {copy.copy}
              </button>
              {copied ? <span className="eyebrow pairing-copy-feedback">{copy.copied}</span> : null}
            </div>
          </div>
        </section>

        <section className="pairing-notes">
          <div className="section-header eyebrow">{copy.stepsTitle}</div>
          <div className="pairing-steps">
            {copy.steps.map((step) => (
              <p key={step}>{step}</p>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
