export const premiumGradients = [
  'from-blue-600 to-teal-500',
  'from-indigo-600 to-sky-500',
  'from-emerald-500 to-cyan-500',
  'from-violet-600 to-blue-500',
  'from-fuchsia-500 to-sky-500',
  'from-teal-500 to-emerald-400',
  'from-rose-500 to-violet-500',
  'from-slate-700 to-blue-600',
];

export function getPremiumGradient(index = 0) {
  return premiumGradients[Math.abs(index) % premiumGradients.length];
}

export function getStableGradient(value = '', fallbackIndex = 0) {
  const key = String(value || fallbackIndex);
  const hash = key.split('').reduce((total, char) => total + char.charCodeAt(0), fallbackIndex);
  return getPremiumGradient(hash);
}
