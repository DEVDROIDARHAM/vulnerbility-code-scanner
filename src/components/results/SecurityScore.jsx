import { useEffect, useState } from "react";

const SecurityScore = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayScore(score);
    }, 200);
    return () => clearTimeout(timer);
  }, [score]);

  // Determine color based on score
  const getColor = (s) => {
    if (s >= 90) return "var(--color-success)";
    if (s >= 70) return "var(--color-warning)";
    if (s >= 40) return "var(--color-severity-high)";
    return "var(--color-severity-critical)";
  };

  const currentColor = getColor(displayScore);
  const size = 80;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-2 group">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow behind the circle */}
        <div 
          className="absolute inset-2 rounded-full blur-lg opacity-20 transition-all duration-500 group-hover:opacity-40" 
          style={{ backgroundColor: currentColor }}
        />
        
        {/* Background Circle */}
        <svg className="w-full h-full -rotate-90 relative z-10">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-white/5"
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={currentColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            style={{
              strokeDashoffset: offset,
              transition: "stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1), stroke 1s ease",
            }}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className="text-2xl font-black text-white leading-none font-display">
            {displayScore}
          </span>
        </div>
      </div>
      <span className="text-[9px] font-black uppercase tracking-[0.2em] mt-3 text-text-muted group-hover:text-primary transition-colors">
        Health Index
      </span>
    </div>
  );
};

export default SecurityScore;
