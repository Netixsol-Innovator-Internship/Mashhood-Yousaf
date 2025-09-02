import { useEffect, useState } from "react";

export function useCountdown(endDate) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(endDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(endDate));
    }, 5000); // update every 5 seconds

    return () => clearInterval(interval);
  }, [endDate]);

  return timeLeft;
}

function getTimeLeft(endDate) {
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  const diff = end - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}
