import React, { useEffect, useState } from 'react';
import './TunnelOfLight.css';

const TunnelOfLight = ({ onComplete }) => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    // Generate random light streaks
    const generatedLines = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 1.5 + 0.5}s`,
      animationDelay: `${Math.random() * 2}s`,
    }));
    setLines(generatedLines);

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4500); // 4.5 seconds animation

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="tunnel-container">
      <div className="tunnel-text">岁月荏苒...</div>
      <div className="tunnel-perspective">
        {lines.map((line) => (
          <div
            key={line.id}
            className="tunnel-line"
            style={{
              left: line.left,
              top: line.top,
              animationDuration: line.animationDuration,
              animationDelay: line.animationDelay,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default TunnelOfLight;
