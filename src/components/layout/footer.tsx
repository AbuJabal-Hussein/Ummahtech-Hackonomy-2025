import Link from 'next/link';
import Logo from '@/components/logo';

export default function Footer() {
  const links = [
    { href: '#', label: 'About' },
    { href: '#', label: 'How It Works' },
    { href: '#', label: 'FAQs' },
    { href: '#', label: 'Terms &amp; Privacy' },
    { href: '#', label: 'Contact' },
  ];

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Logo />
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {links.map(link => (
              <Link key={link.label} href={link.href} className="hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 text-center text-xs text-muted-foreground border-t pt-6">
          <p>&copy; {new Date().getFullYear()} Barakah Ledger. All rights reserved.</p>
          <p className="mt-1">A platform for ethical, community-driven finance.</p>
        </div>
      </div>
    </footer>
  );
}
