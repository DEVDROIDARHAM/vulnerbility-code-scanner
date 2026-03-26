import SecurityScore from "./SecurityScore";
import CategoryBreakdown from "./CategoryBreakdown";
import VulnerabilityList from "./VulnerabilityList";
import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";
import { Shield, CheckCircle2, AlertTriangle, Terminal, Info } from "lucide-react";

/**
 * ResultsPanel component to display scan results.
 * Robustly handles loading, error, and empty states.
 */
const ResultsPanel = ({ results, isScanning, error }) => {

  if (isScanning) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center animate-pulse-soft">
        <LoadingSpinner size="lg" text="Analyzing source code..." />
        <p className="text-text-muted mt-4 text-[10px] font-bold uppercase tracking-[0.2em]">
          Running contextual static analysis...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-severity-critical/10 border border-severity-critical/20 flex-center mb-6">
          <AlertTriangle size={32} className="text-severity-critical" />
        </div>
        <h3 className="text-lg font-bold text-text-primary mb-2">Analysis Failed</h3>
        <p className="text-text-secondary text-sm max-w-xs">{error}</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-border flex-center mb-6">
          <Terminal size={32} className="text-text-muted" />
        </div>
        <h3 className="text-lg font-bold text-text-primary mb-2">Ready to Scan</h3>
        <p className="text-text-secondary text-sm max-w-xs">
          Enter your code in the editor and click the scan button to begin security analysis.
        </p>
      </div>
    );
  }

  const { vulnerabilities = [], securityScore = 0, summary = {} } = results;

  if (vulnerabilities.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center animate-fade-up">
        <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex-center mb-6 shadow-glow">
          <CheckCircle2 size={32} className="text-success" />
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-2 font-display text-left">No Issues Detected</h3>
        <p className="text-text-secondary text-sm max-w-xs leading-relaxed text-left">
          Your code appears safe! We didn&apos;t find any vulnerabilities in this snippet.
        </p>
        <div className="mt-8 p-4 rounded-xl bg-background-elevated border border-border w-full text-left">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Security Health</span>
            <span className="text-sm font-bold text-success">{securityScore}/100</span>
          </div>
          <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
            <div className="h-full bg-success transition-all duration-1000" style={{ width: `${securityScore}%` }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-reveal pb-8 text-left">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-white font-display mb-1 flex items-center gap-2">
            Analysis Report
          </h2>
          <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold uppercase tracking-widest">
             <Shield size={12} className="text-primary" />
             <span>Security Protocol Active</span>
          </div>
        </div>
        <SecurityScore score={securityScore} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Critical', value: summary.critical || 0, color: 'severity-critical' },
          { label: 'High', value: summary.high || 0, color: 'severity-high' },
          { label: 'Medium', value: summary.medium || 0, color: 'severity-medium' },
          { label: 'Low', value: summary.low || 0, color: 'severity-low' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-3 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300">
            <span className={`text-[10px] uppercase font-bold text-${stat.color} mb-1`}>{stat.label}</span>
            <span className="text-2xl font-bold text-white leading-none">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Visual Charts */}
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-4 flex items-center gap-2">
          Critical Areas
          <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
        </h3>
        <div className="glass-card p-5 border-primary/5">
          <CategoryBreakdown categories={summary.categories || {}} />
        </div>
      </div>

      {/* Vulnerability List */}
      <div className="pt-2">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-4">
          Identified Vulnerabilities
        </h3>
        <VulnerabilityList vulnerabilities={vulnerabilities} />
      </div>

      {/* Footer Disclaimer */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-3 align-start backdrop-blur-sm">
        <Info size={16} className="text-primary flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-text-secondary leading-relaxed font-sans font-medium">
          Automated static analysis protocol complete. This tool provides structural security insights based on pattern heuristics. Periodic manual audit is recommended for production environments.
        </p>
      </div>
    </div>
  );
};

export default ResultsPanel;
