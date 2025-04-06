import React, { useEffect, useState } from 'react';

function CircularProgress({ percentage, steps }) {
  const radius = 90;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  const getStrokeColor = (percent) => {
    if (percent < 40) return '#ff4d4d';   // Red
    if (percent < 70) return '#ffaa00';   // Orange
    return '#00cc66';                     // Green
  };

  const strokeColor = getStrokeColor(animatedPercentage);
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const stepTime = 10;
    const totalSteps = duration / stepTime;
    const increment = percentage / totalSteps;

    const interval = setInterval(() => {
      start += increment;
      if (start >= percentage) {
        start = percentage;
        clearInterval(interval);
      }
      setAnimatedPercentage(Math.floor(start));
    }, stepTime);

    return () => clearInterval(interval);
  }, [percentage]);

  return (
    <div style={{ position: 'relative', width: radius * 2, height: radius * 2 }}>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e0e0e0"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={strokeColor}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius} ${radius})`}
          style={{
            transition: 'stroke-dashoffset 0.3s ease, stroke 0.3s ease'
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>

      {/* Centered percentage on top, steps below */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        color: strokeColor,
        lineHeight: '1.2',
      }}>
        <div style={{
          fontSize: '28px',
          fontWeight: 'bold',
        }}>
          {animatedPercentage}%
        </div>
        <div style={{
          fontSize: '14px',
          fontWeight: '500',
        }}>
          {steps.toLocaleString()} steps
        </div>
      </div>
    </div>
  );
}

export default CircularProgress;
