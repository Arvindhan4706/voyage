"use client";

import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import { Globe, Menu, ChevronDown } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useTranslations } from 'next-intl';
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const t = useTranslations('Header');
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const switchLanguage = (locale: string) => {
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}/, '');
    window.location.href = `/${locale}${pathWithoutLocale === '' ? '' : pathWithoutLocale}`;
  };

  return (
    <>
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#D4AF37] z-[101] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-4 bg-[#faf9f6]/90 dark:bg-[#18181b]/90 backdrop-blur-xl border-b border-[#eaeaea] dark:border-[#333333]' : 'py-8 bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
          
          {/* Navigation Links (Left) */}
          <nav className="hidden md:flex items-center gap-10 flex-1">
            {[
              { name: t('home'), id: '#home' },
              { name: t('destinations'), id: '#destinations' },
              { name: t('experiences'), id: '#experiences' },
            ].map((link) => (
              <a 
                key={link.name} 
                href={link.id}
                onClick={(e) => handleSmoothScroll(e, link.id)}
                className={`text-[10px] tracking-[0.2em] font-semibold hover:text-[#D4AF37] transition-colors ${scrolled ? 'text-[#2a2a2a] dark:text-[#faf9f6]' : 'text-white/90'}`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Logo (Center) */}
          <div className={`text-3xl tracking-widest font-serif text-center flex-1 cursor-pointer transition-colors duration-500 ${scrolled ? 'text-[#222222] dark:text-[#faf9f6]' : 'text-white'}`}>
            VOYAGE
          </div>

          {/* Actions (Right) */}
          <div className="flex items-center justify-end gap-6 flex-1">
            <ThemeToggle />
            
            <div className="relative">
              <button 
                onClick={() => setLangOpen(!langOpen)}
                className={`hidden sm:flex items-center gap-1 text-[10px] tracking-[0.1em] uppercase font-semibold hover:text-[#D4AF37] transition-colors ${scrolled ? 'text-[#2a2a2a] dark:text-gray-100' : 'text-white/90'}`}
              >
                <Globe size={14} strokeWidth={1.5} />
                LANG <ChevronDown size={12} />
              </button>
              
              {langOpen && (
                <div className="absolute top-full right-0 mt-2 bg-[#faf9f6] dark:bg-[#18181b] border border-[#eaeaea] dark:border-[#333333] rounded-md shadow-xl overflow-y-auto max-h-64 scrollbar-thin py-1 z-50">
                  {["en","es","fr","de","hi","zh","ja","pt","ru","ar","it","ko","nl","tr","pl","sv","da","fi","no","el","cs","hu","ro","th","vi","id","ms","bn","ta","te","ur"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { switchLanguage(lang); setLangOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#2a2a2a] dark:text-[#f3f4f6] hover:bg-[#D4AF37] hover:text-white transition-colors"
                    >
                      {lang === 'en' ? 'English' : lang === 'es' ? 'Español' : lang === 'fr' ? 'Français' : lang === 'de' ? 'Deutsch' : lang === 'hi' ? 'हिन्दी' : lang === 'zh' ? '中文' : lang === 'ja' ? '日本語' : lang === 'pt' ? 'Português' : lang === 'ru' ? 'Русский' : lang === 'ar' ? 'العربية' : lang === 'it' ? 'Italiano' : lang === 'ko' ? '한국어' : lang === 'nl' ? 'Nederlands' : lang === 'tr' ? 'Türkçe' : lang === 'pl' ? 'Polski' : lang === 'sv' ? 'Svenska' : lang === 'da' ? 'Dansk' : lang === 'fi' ? 'Suomi' : lang === 'no' ? 'Norsk' : lang === 'el' ? 'Ελληνικά' : lang === 'cs' ? 'Čeština' : lang === 'hu' ? 'Magyar' : lang === 'ro' ? 'Română' : lang === 'th' ? 'ไทย' : lang === 'vi' ? 'Tiếng Việt' : lang === 'id' ? 'Bahasa Indonesia' : lang === 'ms' ? 'Bahasa Melayu' : lang === 'bn' ? 'বাংলা' : lang === 'ta' ? 'தமிழ்' : lang === 'te' ? 'తెలుగు' : lang === 'ur' ? 'اردو' :  lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={`flex items-center gap-2 hover:text-[#D4AF37] transition-colors cursor-pointer ${scrolled ? 'text-[#2a2a2a] dark:text-gray-100' : 'text-white/90'}`}>
              <Menu size={20} strokeWidth={1} />
            </div>

            <div className="flex items-center gap-3 ml-2">
              {session ? (
                <button
                  onClick={() => signOut()}
                  className={`text-[10px] tracking-[0.1em] uppercase font-semibold border px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#D4AF37] hover:text-white hover:border-[#D4AF37] ${scrolled ? 'border-[#2a2a2a]/20 text-[#2a2a2a] dark:border-white/20 dark:text-gray-100' : 'border-white/30 text-white/90'}`}
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/login"
                  className={`text-[10px] tracking-[0.1em] uppercase font-semibold border px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#D4AF37] hover:text-white hover:border-[#D4AF37] ${scrolled ? 'border-[#2a2a2a]/20 text-[#2a2a2a] dark:border-white/20 dark:text-gray-100' : 'border-white/30 text-white/90'}`}
                >
                  Log In
                </Link>
              )}
            </div>
          </div>
          
        </div>
      </motion.header>
    </>
  );
}
