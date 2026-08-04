import React from 'react';
import { ShieldCheck, Award } from 'lucide-react';

interface ComplianceGaugeProps {
  score: number;
  size?: number;
}

export const ComplianceGauge: React.FC<ComplianceGaugeProps> = ({ score, size = 180 }) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = '#34d399'; // Emerald
  let textLabel = 'Audit Ready';
  if (score < 50) {
    color = '#f87171'; // Red
    textLabel = 'High Risk';
  } else if (score < 80) {
    color = '#fbbf24'; // Amber
    textLabel = 'In Progress';
  }

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(30, 41, 59, 0.8)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-black text-white tracking-tight">{score}%</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5" style={{ color }}>
          {textLabel}
        </span>
      </div>
    </div>
  );
};
