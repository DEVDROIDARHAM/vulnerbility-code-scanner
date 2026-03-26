import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background-surface border-t border-border mt-auto overflow-hidden">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 px-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex-center group-hover:shadow-glow transition-all overflow-hidden">
                <img src="/cyberlogo.jpg" alt="ScanSentinel logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-xl font-bold text-text-primary tracking-tighter">
                Scan<span className="text-primary">Sentinel</span>
              </span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
              Sophisticated code security analysis powered by trained intelligence models. 
              Designed for the modern developer workflow.
            </p>
          </div>

          {/* Links */}
          {[
            {
              title: "Platform",
              links: [
                { name: "Scanner", path: "/dashboard" },
                { name: "Documentation", path: "/about" },
                { name: "Security Standards", path: "/about" },
              ],
            },
            {
              title: "Company",
              links: [
                { name: "About Us", path: "/about" },
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Terms of Service", path: "/terms" },
              ],
            },
            {
              title: "Resources",
              links: [
                { name: "OWASP Top 10", path: "https://owasp.org" },
                { name: "CWE Database", path: "https://cwe.mitre.org" },
                { name: "GitHub", path: "https://github.com/DEVDROIDARHAM" },
              ],
            },
          ].map((section, idx) => (
            <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-[0.2em] mb-6">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    {link.path.startsWith("http") ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-text-secondary hover:text-primary transition-colors font-medium"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-sm text-text-secondary hover:text-primary transition-colors font-medium"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <div className="text-xs text-text-muted font-medium">
             © {new Date().getFullYear()} ScanSentinel AI. Crafted for High-Level Security.
          </div>
          
          <div className="flex items-center gap-6">
            <a href="https://github.com/DEVDROIDARHAM" target="_blank" rel="noreferrer" className="text-text-secondary hover:text-primary transition-colors"><Github size={18} /></a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors"><Twitter size={18} /></a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors"><Linkedin size={18} /></a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors"><Mail size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
