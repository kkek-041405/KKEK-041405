'use client';

import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: number;
}

function formatTime(milliseconds: number): string {
  if (milliseconds <= 0) {
    return '00:00';
  }
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  useEffect(() => {
    setTimeLeft(targetDate - Date.now()); // Initial calculation

    const intervalId = setInterval(() => {
      const remaining = targetDate - Date.now();
      setTimeLeft(remaining > 0 ? remaining : 0);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  return <span>{formatTime(timeLeft)}</span>;
}
