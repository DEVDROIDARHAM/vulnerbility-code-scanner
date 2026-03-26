import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const sections = [
  {
    title: "1. Data We Collect",
    content:
      "When you create an account, we collect your email address and username. When you run scans while logged in, we store the first 500 characters of your code and the scan results for your personal scan history. Guest scans are never stored.",
  },
  {
    title: "2. How We Use Your Data",
    content:
      "Your data is used solely to provide ScanSentinel's features - displaying your scan history and personalizing your experience. We do not sell, share, or use your data for advertising or any third-party purposes.",
  },
  {
    title: "3. Data Storage",
    content:
      "All data is stored locally in a SQLite database. Passwords are hashed using bcrypt and never stored in plain text. JWT tokens expire after 7 days.",
  },
  {
    title: "4. Guest Users",
    content:
      "Guest users get 5 free scans with no account required. Guest scan results are never stored in our database. Guest scan count is tracked in your browser's localStorage only.",
  },
  {
    title: "5. Your Rights",
    content:
      "You can delete your account and all associated data at any time by contacting us via GitHub. You can clear your guest scan history by clearing your browser's localStorage.",
  },
  {
    title: "6. Contact",
    content:
      "For privacy concerns, reach out via GitHub: https://github.com/DEVDROIDARHAM",
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-text-primary">
      <Navbar />
      <main className="flex-1 px-4 py-14 md:py-20">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Privacy Policy</h1>
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

export default PrivacyPolicy;
