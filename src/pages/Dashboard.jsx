import { useState, useEffect } from "react";
import { useScanner } from "../hooks/useScanner";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import CodeEditor from "../components/scanner/CodeEditor";
import LanguageSelector from "../components/scanner/LanguageSelector";
import ScanButton from "../components/scanner/ScanButton";
import ScanOptions from "../components/scanner/ScanOptions";
import ResultsPanel from "../components/results/ResultsPanel";
import UpgradeModal from "../components/common/UpgradeModal";
import { History, RotateCcw, AlertCircle, Info, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import { getScanHistory } from '../services/api';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const {
    code,
    setCode,
    language,
    setLanguage,
    results,
    isScanning,
    error,
    guestBlocked,
    guestWarning,
    scansRemaining,
    isLoggedIn,
    scan,
    reset,
  } = useScanner();


  useEffect(() => {
    if (!isAuthenticated) return;

    const loadHistory = async () => {
      setHistoryLoading(true);
      const data = await getScanHistory();
      setScanHistory(data.history || []);
      setHistoryLoading(false);
    };

    loadHistory();
  }, [isAuthenticated]);

  const handleScan = async () => {
    const success = await scan();
    
    if (success) {
      if (isAuthenticated) {
        const data = await getScanHistory();
        setScanHistory(data.history || []);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen h-screen overflow-hidden bg-background selection:bg-primary/20">
      <Navbar />

      {/* Guest Mode Banner - Refined */}
      {!isLoggedIn && (
        <div className="bg-primary/10 border-b border-primary/20 px-6 py-2 flex items-center justify-between animate-reveal relative z-30">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex-center">
                <AlertCircle size={16} className="text-primary" />
             </div>
             <div>
                <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                  Guest Protocol: <span className="text-primary">{scansRemaining} tokens available</span>
                </span>
             </div>
          </div>
          <Link to="/signup">
            <Button variant="primary" size="sm" className="h-8 px-4 text-[10px] font-extrabold uppercase tracking-[0.1em]" iconRight={UserPlus}>
               Unlock Full Access
            </Button>
          </Link>
        </div>
      )}

      <main className="flex-1 flex flex-col min-h-0 bg-background text-left">
        {/* Toolbar - Modernized */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.05] bg-background-surface/40 backdrop-blur-xl relative z-20">
          <div className="flex items-center gap-4">
            <LanguageSelector value={language} onChange={setLanguage} />
            <div className="h-6 w-px bg-white/5 mx-1" />
            <ScanButton
              onClick={handleScan}
              loading={isScanning}
              disabled={!code.trim()}
            />
            {results && (
              <Button
                variant="ghost"
                size="sm"
                icon={RotateCcw}
                onClick={reset}
                className="px-3 hover:text-white"
              >
                Reset API
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <ScanOptions
              onLoadSample={setCode}
              onLoadClean={setCode}
            />
            <div className="w-px h-6 bg-white/5 mx-1" />
            <Link to="/history">
              <Button variant="secondary" size="sm" icon={History} className="bg-white/5 border-white/5 hover:bg-white/10 text-white font-semibold">
                Scan History
              </Button>
            </Link>
          </div>
        </div>

        {/* Editor & Results Panels */}
        <div className="flex-1 flex overflow-hidden flex-col">
          {/* Guest Warning Banner */}
          {guestWarning && !guestBlocked && (
            <div className="warning-banner px-4 py-2 border-l-4 border-amber-500 bg-black/60 text-amber-500 text-sm flex items-center shadow-md z-20">
              ⚠️ Guest mode: {scansRemaining} free scan{scansRemaining !== 1 ? 's' : ''} remaining.
              <a href="/signup" className="ml-2 font-bold hover:underline"> Create a free account</a> for unlimited scans.
            </div>
          )}
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Code Editor (65%) */}
            <div className="w-[65%] h-full border-r border-border z-10">
              <CodeEditor
                code={code}
                onChange={(val) => setCode(val || "")}
                language={language}
                height="100%"
              />
            </div>

            {/* Right: Results (35%) */}
            <div className="w-[35%] h-full flex flex-col bg-background-surface/30">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {/* Robust Conditional Rendering */}
              {isScanning ? (
                <ResultsPanel isScanning={true} />
              ) : error ? (
                <ResultsPanel error={error} />
              ) : results ? (
                <ResultsPanel results={results} />
              ) : (
                <ResultsPanel results={null} />
              )}

              {isAuthenticated && (
                <div className="scan-history-section mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">Scan History</h3>

                  {historyLoading && (
                    <p className="history-loading text-white/50 text-sm">Loading history...</p>
                  )}

                  {!historyLoading && scanHistory.length === 0 && (
                    <p className="history-empty text-white/50 text-sm">No scans yet. Run your first scan above.</p>
                  )}

                  {!historyLoading && scanHistory.length > 0 && (
                    <div className="history-list space-y-3">
                      {scanHistory.map((scan) => (
                        <div key={scan.id} className="history-item flex justify-between items-center p-3 rounded-lg bg-black/40 border border-white/5 hover:border-primary/30 transition-colors">
                          <div className="history-item-left flex flex-col gap-1">
                            <span className="history-language text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-primary/20 text-primary w-fit">
                              {scan.language.toUpperCase()}
                            </span>
                            <span className="history-vulns text-sm text-white/80">
                              {scan.vulnerability_count} issue{scan.vulnerability_count !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="history-item-right flex flex-col items-end gap-1">
                            <span
                              className="history-score font-bold text-sm"
                              style={{
                                color: scan.security_score >= 80 ? '#00ff88'
                                     : scan.security_score >= 50 ? '#ffb300'
                                     : '#ff3c5a'
                              }}
                            >
                              {scan.security_score}/100
                            </span>
                            <span className="history-date text-xs text-white/40">
                              {new Date(scan.created_at).toLocaleDateString('en-GB')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </main>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
      )}

      {/* Guest Blocked Popup */}
      {guestBlocked && (
        <div className="guest-blocked-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="guest-blocked-modal bg-[#12141d] border border-primary/40 rounded-xl p-8 max-w-md w-full text-center shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
              <h3 className="text-3xl">🔒</h3>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Guest Limit Reached</h3>
            <p className="text-white/70 mb-2">You've used all 5 free guest scans.</p>
            <p className="text-white/60 mb-8 text-sm">Create a free account to get unlimited scans, save your history, and more.</p>
            <div className="modal-actions flex gap-4 w-full">
              <a href="/signup" className="flex-1 items-center justify-center flex bg-primary text-black font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                Create Free Account
              </a>
              <a href="/login" className="flex-1 items-center justify-center flex bg-white/5 text-white font-bold py-3 px-4 rounded-lg hover:bg-white/10 transition-colors border border-white/10">
                Log In
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
