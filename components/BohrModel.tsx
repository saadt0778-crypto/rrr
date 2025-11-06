import React, { useState, useEffect } from 'react';

interface BohrModelProps {
  electronsPerShell: number[];
}

const BohrModel: React.FC<BohrModelProps> = ({ electronsPerShell }) => {
  const [animatedElectrons, setAnimatedElectrons] = useState<{ shell: number; angle: number }[]>([]);
  const [hoveredShellIndex, setHoveredShellIndex] = useState<number | null>(null);

  const size = 280;
  const center = size / 2;
  const nucleusRadius = 15;
  const shellGap = 25;

  useEffect(() => {
    setAnimatedElectrons([]);
    
    const electronsToAnimate: { shell: number; angle: number }[] = [];
    electronsPerShell.forEach((electronCount, shellIndex) => {
      for (let i = 0; i < electronCount; i++) {
        const angle = (i / electronCount) * 2 * Math.PI;
        electronsToAnimate.push({ shell: shellIndex + 1, angle });
      }
    });

    let timeoutId: number;
    const animateElectron = (index: number) => {
      if (index >= electronsToAnimate.length) {
        return;
      }
      
      setAnimatedElectrons(prev => [...prev, electronsToAnimate[index]]);
      
      timeoutId = window.setTimeout(() => animateElectron(index + 1), 50);
    };

    animateElectron(0);

    return () => window.clearTimeout(timeoutId);
  }, [electronsPerShell]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: scale(0.5); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }
        .electron {
            transition: transform 0.2s ease-out, fill 0.2s ease-out;
            cursor: pointer;
        }
        .electron:hover {
            transform: scale(1.8);
            fill: #67e8f9;
        }
        .shell {
            transition: stroke 0.2s ease-out, stroke-width 0.2s ease-out;
            cursor: pointer;
        }
        .tooltip {
            animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
      <defs>
        <radialGradient id="nucleusGradient">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#0891b2" />
        </radialGradient>
      </defs>
      
      {/* Nucleus */}
      <circle cx={center} cy={center} r={nucleusRadius} fill="url(#nucleusGradient)" />
      
      {/* Shells */}
      {electronsPerShell.map((_, i) => {
          const isHovered = hoveredShellIndex === i;
          return (
            <circle
              key={`shell-${i}`}
              className="shell"
              cx={center}
              cy={center}
              r={nucleusRadius + shellGap * (i + 1)}
              fill="none"
              stroke={isHovered ? "#67e8f9" : "rgba(200, 200, 200, 0.3)"}
              strokeWidth={isHovered ? 2 : 1}
              onMouseEnter={() => setHoveredShellIndex(i)}
              onMouseLeave={() => setHoveredShellIndex(null)}
            />
          );
      })}
      
      {/* Electrons */}
      {animatedElectrons.map((electron, i) => {
        const radius = nucleusRadius + shellGap * electron.shell;
        const x = center + radius * Math.cos(electron.angle);
        const y = center + radius * Math.sin(electron.angle);
        
        return (
          <g key={`electron-group-${i}`}>
            <circle cx={x} cy={y} r="5" fill="#f0f9ff" className="animate-fade-in electron">
               <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from={`0 ${center} ${center}`}
                to={`360 ${center} ${center}`}
                dur={`${5 * electron.shell}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        );
      })}

      {/* Tooltip for hovered shell */}
      {hoveredShellIndex !== null && (
        <g className="tooltip" pointerEvents="none">
           <text
              x={center}
              y={center - (nucleusRadius + shellGap * (hoveredShellIndex + 1)) - 10}
              textAnchor="middle"
              fill="white"
              fontSize="14"
              fontWeight="bold"
              paintOrder="stroke"
              stroke="#1f2937"
              strokeWidth="3px"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {`المستوى ${hoveredShellIndex + 1}: ${electronsPerShell[hoveredShellIndex]} إلكترون`}
            </text>
        </g>
      )}
    </svg>
  );
};

export default BohrModel;