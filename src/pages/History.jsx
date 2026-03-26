import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import { getScanHistory, deleteScanFromHistory, clearScanHistory } from "../services/api";
import { formatRelativeTime } from "../utils/formatters";
import { getScoreColor } from "../utils/scoreCalculator";
import { useAuth } from "../context/AuthContext";
import {
  History as HistoryIcon,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Trash,
  Lock,
  UserPlus,
  ArrowRight
} from "lucide-react";

const ITEMS_PER_PAGE = 8;

const History = () => {
  const { isAuthenticated } = useAuth();
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (isAuthenticated) {
      const load = async () => {
        const data = await getScanHistory();
        setHistory(data.history || []);
      };
      load();
    }
  }, [isAuthenticated]);

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const paginatedHistory = history.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleDelete = (scanId) => {
    const updated = deleteScanFromHistory(scanId);
    setHistory(updated);
    if (paginatedHistory.length === 1 && page > 1) {
      setPage(page - 1);
    }
  };

  // If unauthenticated, show the lock screen
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
           <div className="w-full max-w-md text-center animate-fade-up">
              <div className="w-20 h-20 rounded-3xl bg-primary/5 border border-primary/20 flex-center mx-auto mb-8 shadow-glow">
                <Lock size={40} className="text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-text-primary mb-4 font-display">
                History is Private
              </h1>
              <p className="text-text-secondary text-sm mb-10 leading-relaxed">
                Scan history is only available to registered users. Sign up now to save your reports, 
                track vulnerability trends, and access unlimited scans.
              </p>
              
              <div className="flex flex-col gap-3">
                <Link to="/signup">
                  <Button variant="primary" className="w-full h-12 font-bold" iconRight={UserPlus}>
                    Create Account for Full Access
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" className="w-full h-12 font-bold">
                    Sign In
                  </Button>
                </Link>
              </div>
              
              <div className="mt-10 pt-8 border-t border-border/50">
                 <Link to="/dashboard" className="text-xs font-bold text-text-muted hover:text-primary transition-colors flex items-center justify-center gap-2 group">
                    Return to Dashboard anonymously
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                 </Link>
              </div>
           </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Navbar />

      <div className="flex-1 max-w-5xl w-full mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 border-b border-border pb-8">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-3">
               <HistoryIcon size={12} />
               Scan Archives
            </div>
            <h1 className="text-3xl font-bold font-display text-text-primary tracking-tight">
              Security History
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Review and manage your previous code analysis reports.
            </p>
          </div>

          <div className="flex items-center gap-3 animate-fade-up">
             <div className="text-right hidden sm:block">
                <div className="text-lg font-bold text-text-primary">{history.length}</div>
                <div className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Total Scans</div>
             </div>
             {history.length > 0 && (
               <Button
                 variant="danger"
                 size="sm"
                 icon={Trash}
                 onClick={() => {
                   if (window.confirm("Clear all history?")) {
                     clearScanHistory();
                     setHistory([]);
                   }
                 }}
               >
                 Clear All
               </Button>
             )}
          </div>
        </div>

        {history.length === 0 ? (
          <EmptyState
            icon={HistoryIcon}
            title="Scan Vault Empty"
            description="Your security analysis history will appear here once you run your first scan."
            action={
              <Link to="/dashboard">
                <Button variant="primary" size="md">
                  Return to Scanner
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {paginatedHistory.map((scan, i) => {
              const scoreColor = getScoreColor(scan.securityScore);
              return (
                <div
                  key={scan.id}
                  className="group bg-background-surface border border-border rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:border-primary/30 hover:shadow-glow transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl border flex-shrink-0"
                    style={{
                      color: scoreColor,
                      backgroundColor: `${scoreColor}10`,
                      borderColor: `${scoreColor}25`,
                    }}
                  >
                    {scan.securityScore}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-sm font-bold text-text-primary uppercase tracking-wide">
                        {scan.language}
                      </span>
                      <Badge severity={scan.riskLevel} size="xs">
                        {scan.riskLevel}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
                      <span>{formatRelativeTime(scan.date)}</span>
                      <span className="opacity-30">•</span>
                      <span>{scan.totalIssues} Found</span>
                      <span className="opacity-30">•</span>
                      <span className="truncate max-w-[200px] opacity-70 font-mono italic">
                        &quot;{scan.codePreview}...&quot;
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button variant="outline" size="sm" className="h-9">
                       View Report
                    </Button>
                    <button
                      onClick={() => handleDelete(scan.id)}
                      className="p-2 rounded-lg text-text-muted hover:text-severity-critical hover:bg-severity-critical/10 transition-colors cursor-pointer"
                      aria-label="Delete scan"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12 py-6 border-t border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={ChevronLeft}
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Prev
                </Button>
                <div className="text-xs font-bold text-text-muted uppercase tracking-widest">
                  Page <span className="text-text-primary px-1">{page}</span> of {totalPages}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  iconRight={ChevronRight}
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default History;
