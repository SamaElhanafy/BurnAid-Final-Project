import { useBurnAid } from '../../context/BurnAidContext';

/**
 * Site footer with placeholder links and localized copyright/disclaimer line.
 */
export function AppFooter() {
  const { t } = useBurnAid();

  return (
    <footer className="w-full py-12 bg-surface-container-low border-t border-surface-container-high">
      <div className="max-w-7xl mx-auto px-8 flex flex-col items-center space-y-6">
        <div className="font-bold text-on-surface-variant/40 tracking-tighter uppercase text-lg font-headline">Burnaid</div>
        <div className="flex flex-wrap justify-center gap-8">
          {t.footerLinks.map((link, i) => (
            <a key={i} className={`text-on-surface-variant hover:text-on-surface transition-all text-xs font-medium ${i === 2 ? 'text-secondary underline' : ''}`} href="#">
              {link}
            </a>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-center text-on-surface-variant max-w-2xl italic">{t.footerCopyright}</p>
      </div>
    </footer>
  );
}
