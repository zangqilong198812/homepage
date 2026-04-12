const navItems = [
  { label: 'Showcase', href: '#showcase' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export function Header() {
  return (
    <header className="site-header">
      <a className="logo" href="#top" aria-label="Rethinking Studio home">
        Rethinking.
      </a>
      <nav className="meta-nav eyebrow" aria-label="Primary">
        {navItems.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
