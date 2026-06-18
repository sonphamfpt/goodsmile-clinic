import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'white';
  showText?: boolean;
}

export const LogoIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        @keyframes sparkle-pulse-1 {
          0%, 100% { transform: scale(0.8) rotate(0deg); opacity: 0.7; }
          50% { transform: scale(1.2) rotate(45deg); opacity: 1; }
        }
        @keyframes sparkle-pulse-2 {
          0%, 100% { transform: scale(0.6) rotate(15deg); opacity: 0.5; }
          50% { transform: scale(1.1) rotate(-30deg); opacity: 0.9; }
        }
        @keyframes dimple-pulse {
          0%, 100% { opacity: 0.8; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.5px); }
        }
        .svg-glow-group {
          animation: float-gentle 5s ease-in-out infinite;
        }
        .sparkle-1 {
          transform-origin: 72px 24px;
          animation: sparkle-pulse-1 3.5s ease-in-out infinite;
        }
        .sparkle-2 {
          transform-origin: 84px 15px;
          animation: sparkle-pulse-2 2.8s ease-in-out infinite;
        }
        .dimple-left {
          transform-origin: 16px 54px;
          animation: dimple-pulse 2.5s ease-in-out infinite;
        }
        .dimple-right {
          transform-origin: 84px 54px;
          animation: dimple-pulse 2.5s ease-in-out infinite;
        }
      `}</style>

      <defs>
        {/* Left interlocking lobe: Clinical Blue Gradient */}
        <linearGradient id="toothLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00478d" />
          <stop offset="60%" stopColor="#005fa8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Right interlocking lobe: Clinical Emerald Green */}
        <linearGradient id="toothRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#006d33" />
          <stop offset="60%" stopColor="#008f5d" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        
        {/* Smile Arc Gradient: Warm Gold to Sunny Amber */}
        <linearGradient id="smileGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        {/* White Highlight reflection */}
        <linearGradient id="shineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      <g className="svg-glow-group">
        {/* Left interlocking lobe of the tooth */}
        <path 
          d="M50 80 C34 72, 24 54, 24 38 C24 22, 38 18, 48 28 C49 29, 49 32, 48 34 C44 42, 42 52, 44 64 C45 70, 48 76, 50 80 Z" 
          fill="url(#toothLeftGrad)" 
        />

        {/* Right interlocking lobe of the tooth */}
        <path 
          d="M50 80 C66 72, 76 54, 76 38 C76 22, 62 18, 52 28 C51 29, 51 32, 52 34 C56 42, 58 52, 56 64 C55 70, 52 76, 50 80 Z" 
          fill="url(#toothRightGrad)" 
        />

        {/* Left Lobe Enamel highlight reflection */}
        <path 
          d="M30 38 C30 28, 38 25, 46 30 C40 29, 32 31, 32 38 C32 44, 31 50, 30 52 C30 46, 30 41, 30 38 Z" 
          fill="url(#shineGrad)" 
        />
        <circle cx="42" cy="34" r="2.2" fill="white" opacity="0.6" />

        {/* Golden Smile Sweep (cradling the tooth) */}
        <path 
          d="M16 54 C32 76, 68 76, 84 54" 
          stroke="url(#smileGrad)" 
          strokeWidth="5" 
          strokeLinecap="round" 
          filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.12))"
        />

        {/* Left dimple */}
        <circle 
          className="dimple-left" 
          cx="16" 
          cy="54" 
          r="3" 
          fill="url(#smileGrad)" 
        />

        {/* Right dimple */}
        <circle 
          className="dimple-right" 
          cx="84" 
          cy="54" 
          r="3" 
          fill="url(#smileGrad)" 
        />

        {/* Sparkle 1: Primary star */}
        <path 
          className="sparkle-1" 
          d="M72 16 Q72 24 80 24 Q72 24 72 32 Q72 24 64 24 Q72 24 72 16" 
          fill="#f59e0b" 
          filter="drop-shadow(0px 1px 3px rgba(245,158,11,0.6))"
        />

        {/* Sparkle 2: Companion star */}
        <path 
          className="sparkle-2" 
          d="M84 11 Q84 15 88 15 Q84 15 84 19 Q84 15 80 15 Q84 15 84 11" 
          fill="#fbbf24" 
          filter="drop-shadow(0px 1px 2px rgba(251,191,36,0.5))"
        />
      </g>
    </svg>
  );
};

export const BrandLogo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'dark', 
  showText = true 
}) => {
  // Determine dimensions based on size input
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8';
      case 'lg': return 'w-16 h-16';
      case 'xl': return 'w-24 h-24';
      case 'md':
      default:   return 'w-12 h-12';
    }
  };

  const getTextStyle = () => {
    switch (size) {
      case 'sm': return { title: 'text-lg', sub: 'text-[8px]', gap: 'gap-2' };
      case 'lg': return { title: 'text-3xl', sub: 'text-[10px]', gap: 'gap-4' };
      case 'xl': return { title: 'text-4xl', sub: 'text-[12px]', gap: 'gap-5' };
      case 'md':
      default:   return { title: 'text-2xl', sub: 'text-[9px]', gap: 'gap-3' };
    }
  };

  const textColors = () => {
    if (variant === 'white') {
      return {
        first: 'text-white',
        second: 'text-green-300',
        sub: 'text-white/70'
      };
    }
    return {
      first: 'text-[#0f172a]', 
      second: 'text-transparent bg-clip-text bg-gradient-to-r from-[#005eb8] to-[#008f5d]',
      sub: 'text-[#64748b]'
    };
  };

  const layout = getTextStyle();
  const colors = textColors();

  return (
    <div className={`flex items-center ${layout.gap} text-left select-none`}>
      <LogoIcon className={`${getIconSize()} shrink-0`} />
      
      {showText && (
        <div className="flex flex-col justify-center">
          <span className={`${layout.title} font-black tracking-tight leading-none`}>
            <span className={colors.first}>Good</span>
            <span className={colors.second}>Smile</span>
          </span>
          <span className={`${layout.sub} font-extrabold uppercase tracking-[0.25em] mt-1.5`}>
            Dental Clinic
          </span>
        </div>
      )}
    </div>
  );
};
