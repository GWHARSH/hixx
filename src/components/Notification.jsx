import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const CONFIG = {
  success: {
    icon: CheckCircle,
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.08))',
    border: 'rgba(34,197,94,0.35)',
    glow: '0 0 20px rgba(34,197,94,0.15), 0 8px 32px rgba(0,0,0,0.3)',
    iconColor: '#4ade80',
    accent: '#22c55e',
  },
  error: {
    icon: XCircle,
    gradient: 'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(2,132,199,0.08))',
    border: 'rgba(56,189,248,0.35)',
    glow: '0 0 20px rgba(56,189,248,0.15), 0 8px 32px rgba(0,0,0,0.3)',
    iconColor: '#38BDF8',
    accent: '#00F0FF',
  },
  warning: {
    icon: AlertTriangle,
    gradient: 'linear-gradient(135deg, rgba(234,179,8,0.15), rgba(202,138,4,0.08))',
    border: 'rgba(234,179,8,0.35)',
    glow: '0 0 20px rgba(234,179,8,0.15), 0 8px 32px rgba(0,0,0,0.3)',
    iconColor: '#fbbf24',
    accent: '#eab308',
  },
  info: {
    icon: Info,
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(37,99,235,0.08))',
    border: 'rgba(59,130,246,0.35)',
    glow: '0 0 20px rgba(59,130,246,0.15), 0 8px 32px rgba(0,0,0,0.3)',
    iconColor: '#60a5fa',
    accent: '#3b82f6',
  },
};

export default function Notification({ message, type = 'info', onClose }) {
  const cfg = CONFIG[type] || CONFIG.info;
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, x: 20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 18px',
        borderRadius: '14px',
        background: cfg.gradient,
        backdropFilter: 'blur(20px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
        border: `1px solid ${cfg.border}`,
        boxShadow: cfg.glow,
        minWidth: '280px',
        maxWidth: '420px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Accent line */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '3px',
        background: cfg.accent,
        borderRadius: '3px 0 0 3px',
      }} />

      {/* Progress bar */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 4, ease: 'linear' }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '2px',
          background: cfg.accent,
          opacity: 0.4,
          borderRadius: '0 2px 0 0',
        }}
      />

      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '10px',
        background: `${cfg.accent}15`,
      }}>
        <Icon size={18} style={{ color: cfg.iconColor }} />
      </div>

      <span style={{
        flex: 1,
        fontSize: '0.88rem',
        fontWeight: 500,
        color: 'rgba(255,255,255,0.92)',
        lineHeight: 1.4,
        fontFamily: "'Inter', 'Outfit', sans-serif",
      }}>
        {message}
      </span>

      <button
        onClick={onClose}
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          borderRadius: '6px',
          background: 'rgba(255,255,255,0.06)',
          border: 'none',
          color: 'rgba(255,255,255,0.4)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.12)'; e.target.style.color = 'rgba(255,255,255,0.8)'; }}
        onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.06)'; e.target.style.color = 'rgba(255,255,255,0.4)'; }}
      >
        <X size={13} />
      </button>
    </motion.div>
  );
}
