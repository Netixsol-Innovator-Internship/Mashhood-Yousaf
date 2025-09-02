export function getTimeLeft(endDate) {
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  const diff = end - now;

  if (diff <= 0) return null; // time khatam

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
