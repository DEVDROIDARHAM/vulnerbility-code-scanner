import { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe, Check } from "lucide-react";
import { supportedLanguages } from "../../services/mockData";

const LanguageSelector = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLang = supportedLanguages.find((l) => l.name === value) || supportedLanguages[0];

  return (
    <div className="relative z-[100]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[11px] font-bold text-text-secondary hover:border-primary/50 hover:text-white transition-all duration-300 cursor-pointer min-w-[160px] font-display uppercase tracking-widest shadow-lg active:scale-95"
      >
        <Globe size={16} className={`transition-all duration-500 ${isOpen ? "text-primary rotate-180 scale-110" : "text-text-muted"}`} />
        <span className="flex-1 text-left">{selectedLang.name}</span>
        <ChevronDown size={14} className={`text-text-muted transition-transform duration-500 ${isOpen ? "rotate-180 text-primary" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-full glass-card overflow-hidden animate-reveal p-1.5 z-[100] border-primary/20 shadow-glow-lg">
          <div className="text-[9px] font-black text-text-muted px-3 py-2 uppercase tracking-tight opacity-50">Select Stack</div>
          {supportedLanguages.map((lang) => (
            <button
              key={lang.name}
              onClick={() => {
                onChange(lang.name);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-3 text-xs rounded-lg transition-all duration-300 cursor-pointer group ${
                value === lang.name
                  ? "bg-primary text-white font-black shadow-glow"
                  : "text-text-secondary hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="font-display tracking-wide">{lang.name}</span>
              {value === lang.name ? (
                <Check size={14} className="text-white animate-pulse" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-primary transition-colors" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
