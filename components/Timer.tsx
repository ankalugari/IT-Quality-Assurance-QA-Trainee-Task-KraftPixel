
import React, { useState, useEffect } from 'react';

const Timer: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState(3600); // 1 hour

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const intervalId = setInterval(() => {
      setSecondsLeft(secondsLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [secondsLeft]);

  const formatTime = () => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const timeColorClass = secondsLeft < 300 ? 'text-red-400' : 'text-green-400';

  return (
    <div className="bg-base-300 p-4 rounded-lg text-center">
      <h3 className="text-sm font-semibold uppercase text-content-200 tracking-wider mb-2">Time Remaining</h3>
      <p className={`text-4xl font-mono font-bold ${timeColorClass}`}>{formatTime()}</p>
    </div>
  );
};

export default Timer;
