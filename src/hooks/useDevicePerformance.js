import { useState, useEffect } from 'react';

function getDeviceTier() {
  if (typeof window === 'undefined') return 'high';

  // 1. RAM Memory in GB
  const ram = navigator.deviceMemory || 4;

  // 2. CPU Logical Cores
  const cores = navigator.hardwareConcurrency || 4;

  // 3. Network Connection Speed & Data Saver mode
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const isSaveData = conn?.saveData === true;
  const isSlowNetwork = conn?.effectiveType === '2g' || conn?.effectiveType === '3g';

  // 4. Screen resolution / viewport size
  const isMobileScreen = window.innerWidth <= 768;

  // Low Tier: Low-end 2GB RAM, 2-core CPU, Data Saver, or Slow 2G/3G
  if (isSaveData || isSlowNetwork || ram <= 2 || cores <= 2) {
    return 'low';
  }

  // Medium Tier: Mid-tier mobile device or 4-core laptop
  if (isMobileScreen || ram < 6 || cores <= 4) {
    return 'medium';
  }

  // High Tier: High-end Desktop, Gaming PC, or Mac with 6+ Cores and 6GB+ RAM
  return 'high';
}

export function useDevicePerformance() {
  const [tier, setTier] = useState(() => getDeviceTier());

  useEffect(() => {
    const updateTier = () => setTier(getDeviceTier());
    window.addEventListener('resize', updateTier);
    
    // Apply body class for adaptive CSS optimizations
    const currentTier = getDeviceTier();
    document.body.classList.remove('perf-low', 'perf-medium', 'perf-high');
    document.body.classList.add(`perf-${currentTier}`);

    return () => window.removeEventListener('resize', updateTier);
  }, []);

  return tier;
}
