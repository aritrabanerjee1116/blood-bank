import Link from 'next/link';
import { Droplets } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--gradient-primary)] flex items-center justify-center">
                <Droplets className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">BloodLink</span>
            </div>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              A comprehensive blood bank management platform connecting donors, hospitals, and administrators.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Blood Availability', 'Register', 'Login'].map((link) => (
                <li key={link}>
                  <Link
                    href={
                      link === 'Home' ? '/' :
                      link === 'Blood Availability' ? '/blood-availability' :
                      link === 'Register' ? '/register/donor' :
                      '/login'
                    }
                    className="text-sm text-[var(--color-muted)] hover:text-white transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">For Users</h4>
            <ul className="space-y-2">
              {['Donor Portal', 'Hospital Portal', 'Admin Panel'].map((link) => (
                <li key={link}>
                  <Link
                    href={
                      link === 'Donor Portal' ? '/donor' :
                      link === 'Hospital Portal' ? '/hospital' :
                      '/admin'
                    }
                    className="text-sm text-[var(--color-muted)] hover:text-white transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Emergency</h4>
            <p className="text-sm text-[var(--color-muted)] mb-2">
              24/7 Emergency Hotline
            </p>
            <a
              href="tel:+911234567890"
              className="text-xl font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors"
            >
              +91 123-456-7890
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--color-border)] text-center">
          <p className="text-sm text-[var(--color-muted)]">
            © 2026 BloodLink. All rights reserved. Built for saving lives.
          </p>
        </div>
      </div>
    </footer>
  );
}
