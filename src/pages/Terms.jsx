import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const sections = [
  {
    title: "1. Acceptance",
    content:
      "By using ScanSentinel, you agree to these terms. If you do not agree, please do not use the service.",
  },
  {
    title: "2. Use of Service",
    content:
      "ScanSentinel is provided as a developer tool for educational and security research purposes. You agree to use it only for code you own or have permission to analyze. Do not use ScanSentinel to scan proprietary code belonging to others without permission.",
  },
  {
    title: "3. Account Responsibility",
    content:
      "You are responsible for maintaining the confidentiality of your account credentials. You are responsible for all activity that occurs under your account.",
  },
  {
    title: "4. Limitations",
    content:
      "ScanSentinel is a vulnerability detection aid and does not guarantee detection of all security issues. It does not replace professional security audits for production systems handling sensitive data.",
  },
  {
    title: "5. Intellectual Property",
    content:
      "ScanSentinel is built and maintained by Arham Amir. The source code, design, and content are the intellectual property of the developer.",
  },
  {
    title: "6. Changes",
    content:
      "These terms may be updated at any time. Continued use of ScanSentinel after changes constitutes acceptance of the new terms.",
  },
  {
    title: "7. Contact",
    content:
      "Questions about these terms? Contact via GitHub: https://github.com/DEVDROIDARHAM",
  },
];

const Terms = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-text-primary">
      <Navbar />
      <main className="flex-1 px-4 py-14 md:py-20">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Terms & Conditions</h1>
          <p className="text-sm text-text-muted mb-10">Last updated: March 2026</p>

          <div className="space-y-5">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-2xl border border-border bg-background-surface/50 p-6 md:p-7"
              >
                <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
                <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
