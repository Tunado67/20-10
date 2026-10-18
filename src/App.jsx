import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';

// ─────────────────────────────────────────────
// Fallback sample data (shown when Supabase is
// unavailable or the student ID has no record)
// ─────────────────────────────────────────────
const FALLBACK = {
  name: 'Hoa Xinh',
  title: 'Đoá Hoa Rực Rỡ',
  wish: 'Chúc bạn ngày 20/10 tràn đầy yêu thương 🌸\n\nBạn là người phụ nữ mạnh mẽ, dịu dàng và đáng ngưỡng mộ. Mong bạn luôn toả sáng, hạnh phúc và đạt được mọi ước mơ trong cuộc sống!',
  gift: '🌹 Hoa hồng tươi & Socola Bỉ thượng hạng',
  avatar_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop&q=80',
};

// ─────────────────────────────────────────────
// Floating petals background
// ─────────────────────────────────────────────
const PETALS = ['🌸', '🌺', '🌷', '✨', '💕', '🌹'];

function FloatingPetals() {
  const items = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    emoji: PETALS[i % PETALS.length],
    left: `${5 + (i * 7) % 90}%`,
    delay: `${(i * 0.8) % 7}s`,
    duration: `${6 + (i * 1.3) % 6}s`,
    size: `${0.8 + (i * 0.15) % 0.8}rem`,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {items.map(p => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            bottom: '-10%',
            animationDelay: p.delay,
            animationDuration: p.duration,
            fontSize: p.size,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Tab icons (pure SVG, no extra icon lib needed)
// ─────────────────────────────────────────────
const WishIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const GiftIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);

const CardIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    <polyline points="8 12 12 20 16 12" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

// ─────────────────────────────────────────────
// Tab 0 – Wishes
// ─────────────────────────────────────────────
function WishTab({ student }) {
  return (
    <motion.div
      key="tab-wish"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="h-full flex flex-col gap-4 p-5"
    >
      {/* Top decorator */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-40" />
        <span className="text-pink-300 text-xs tracking-widest uppercase font-semibold">Lời chúc 20/10</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-40" />
      </div>

      {/* Avatar + name header */}
      <div className="flex items-center gap-3">
        <div className="gradient-border flex-shrink-0">
          <div className="gradient-border-inner">
            <img
              src={student.avatar_url}
              alt={student.name}
              className="w-14 h-14 object-cover"
              onError={e => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=be185d&color=fff&size=128`; }}
            />
          </div>
        </div>
        <div>
          <p className="text-pink-300 text-xs font-medium">{student.title}</p>
          <h2 className="text-white font-bold text-lg leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {student.name}
          </h2>
        </div>
      </div>

      {/* Wish card */}
      <div className="flex-1 glass rounded-3xl p-6 relative overflow-hidden">
        {/* Decorative quote mark */}
        <div className="absolute -top-3 -left-1 text-pink-500 opacity-20 text-8xl font-serif leading-none select-none">"</div>

        <p className="text-white/90 leading-relaxed text-[15px] whitespace-pre-line relative z-10 mt-2">
          {student.wish}
        </p>

        <div className="absolute bottom-4 right-5 text-pink-400 opacity-30 text-6xl font-serif leading-none select-none rotate-180">"</div>
      </div>

      {/* Footer */}
      <div className="text-center text-pink-300/60 text-xs">
        🌸 Gửi với tất cả yêu thương nhân ngày 20/10 🌸
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Tab 1 – Gift
// ─────────────────────────────────────────────
function GiftTab({ student }) {
  const [revealed, setRevealed] = useState(false);

  const handleReveal = useCallback(() => {
    setRevealed(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#f9a8d4', '#fbbf24', '#fff'],
    });
  }, []);

  return (
    <motion.div
      key="tab-gift"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="h-full flex flex-col items-center justify-center gap-6 p-6"
    >
      <div className="text-center">
        <p className="text-pink-300 text-xs tracking-widest uppercase font-semibold mb-1">Dành riêng cho</p>
        <h2 className="text-white text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          {student.name}
        </h2>
      </div>

      {/* Gift box */}
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.button
            key="box"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleReveal}
            className="relative flex flex-col items-center gap-4 cursor-pointer group"
          >
            <div className="w-36 h-36 rounded-3xl bg-gradient-to-br from-pink-600 to-rose-700 shadow-2xl flex items-center justify-center relative overflow-hidden"
              style={{ boxShadow: '0 0 40px rgba(236,72,153,0.5)' }}
            >
              {/* Ribbon */}
              <div className="absolute inset-x-0 top-0 bottom-0 flex items-center justify-center pointer-events-none">
                <div className="absolute w-full h-3 bg-yellow-400/80 top-1/2 -translate-y-1/2" />
                <div className="absolute h-full w-3 bg-yellow-400/80 left-1/2 -translate-x-1/2" />
                <div className="absolute w-10 h-10 bg-yellow-400 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-xl">🎀</div>
              </div>
              <span className="text-6xl z-10 relative group-hover:scale-110 transition-transform duration-200">🎁</span>
            </div>
            <p className="text-pink-200 text-sm animate-pulse">Nhấn để mở quà! 🎀</p>
          </motion.button>
        ) : (
          <motion.div
            key="reveal"
            initial={{ scale: 0.6, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-full max-w-xs"
          >
            <div className="glass rounded-3xl p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-rose-600/20 pointer-events-none" />
              <div className="text-5xl mb-4">🌹</div>
              <p className="text-pink-300 text-xs uppercase tracking-widest font-semibold mb-2">Món quà đặc biệt</p>
              <p className="text-white text-xl font-bold leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
                {student.gift}
              </p>
              <p className="text-pink-200/70 text-xs mt-4">
                Trao với cả trái tim ❤️
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Tab 2 – Story Card (9:16 + html2canvas)
// ─────────────────────────────────────────────
function StoryTab({ student }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);

    try {
      // Pre-load the avatar as base64 to sidestep CORS completely
      let avatarSrc = student.avatar_url;
      try {
        const res = await fetch(student.avatar_url);
        const blob = await res.blob();
        avatarSrc = await new Promise(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch {
        // Use a solid-colour fallback avatar rendered as a data-URI
        avatarSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=be185d&color=fff&size=256`;
      }

      // Temporarily swap the img src to the preloaded base64
      const imgEl = cardRef.current.querySelector('img');
      const originalSrc = imgEl ? imgEl.src : null;
      if (imgEl) imgEl.src = avatarSrc;

      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: null,
        // Ensure the element fills exactly the captured area
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
        windowWidth: cardRef.current.offsetWidth,
        windowHeight: cardRef.current.offsetHeight,
      });

      if (imgEl && originalSrc) imgEl.src = originalSrc; // restore

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `Story-20-10-${student.name.replace(/\s+/g, '-')}.png`;
      link.click();
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      console.error('html2canvas error:', err);
      alert('Không thể tải ảnh. Vui lòng thử lại!');
    } finally {
      setDownloading(false);
    }
  }, [student, downloading]);

  return (
    <motion.div
      key="tab-card"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex-1 flex flex-col justify-center items-center gap-3 p-4 min-h-full"
    >
      <p className="text-pink-300 text-xs tracking-widest uppercase font-semibold">Story 9:16 · Tải & Đăng mạng</p>

      {/* 9:16 Story Card Container */}
      <div
        ref={cardRef}
        className="w-full aspect-[9/16] max-h-[70vh] rounded-2xl p-5 bg-gradient-to-br from-pink-600 via-rose-500 to-purple-700 shadow-2xl flex flex-col justify-between relative overflow-hidden text-center story-canvas-target"
      >
        {/* Background decorative circles */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

        {/* Top Header */}
        <div className="flex justify-between items-center text-[10px] tracking-widest uppercase font-bold text-white/80 z-10">
          <span>20/10 SPECIAL</span>
          <span>🌸 HONOR CARD</span>
        </div>

        {/* Center Main Content */}
        <div className="flex flex-col items-center justify-center gap-3 my-auto z-10">
          {/* Avatar */}
          <img
            src={student.avatar_url}
            alt={student.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white mx-auto shadow-md shrink-0"
            crossOrigin="anonymous"
            onError={e => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=be185d&color=fff&size=256`;
            }}
          />

          {/* Title Badge */}
          <div className="bg-white/20 border border-white/40 rounded-full px-4 py-1 text-xs font-bold tracking-wider uppercase text-amber-200 shrink-0">
            {student.title || 'Phụ Nữ Đặc Biệt'}
          </div>

          {/* Name */}
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-md" style={{ fontFamily: 'var(--font-display)' }}>
            {student.name}
          </h2>

          <div className="w-12 h-0.5 bg-white/40 rounded-full my-0.5" />

          {/* Subtitle / Footer Message inside card */}
          <p className="text-xs text-white/90 leading-relaxed max-w-[220px]">
            Chúc mừng ngày 20/10 —<br />Ngày Phụ Nữ Việt Nam 🌹
          </p>
        </div>

        {/* Bottom Strip */}
        <div className="pt-2 border-t border-white/20 text-[10px] text-white/70 font-medium z-10">
          🌸 Ngày Phụ Nữ Việt Nam 20 / 10 🌸
        </div>
      </div>

      {/* Download button clearly visible below card */}
      <motion.button
        onClick={handleDownload}
        disabled={downloading}
        whileTap={{ scale: 0.95 }}
        className="w-full max-w-xs flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white transition-all duration-200 cursor-pointer"
        style={{
          background: done
            ? 'linear-gradient(135deg, #16a34a, #15803d)'
            : 'linear-gradient(135deg, #be185d, #9d174d)',
          boxShadow: '0 4px 20px rgba(190,24,93,0.5)',
          opacity: downloading ? 0.7 : 1,
        }}
      >
        {downloading ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="inline-block"
            >⏳</motion.span>
            Đang tạo ảnh…
          </>
        ) : done ? (
          <>✅ Đã tải! Đăng story ngay nhé!</>
        ) : (
          <>
            <DownloadIcon /> Tải ảnh Story (.png)
          </>
        )}
      </motion.button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Envelope / Intro screen
// ─────────────────────────────────────────────
function EnvelopeScreen({ student, onOpen }) {
  const fire = useCallback(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#ec4899', '#f9a8d4', '#fbbf24', '#ffffff', '#f43f5e'],
      scalar: 1.1,
    });
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#fbbf24', '#fb923c', '#ec4899'],
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#fbbf24', '#a855f7', '#ec4899'],
    });
    setTimeout(onOpen, 600);
  }, [onOpen]);

  return (
    <motion.div
      key="envelope"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ exit: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } }}
      className="inset-0 absolute z-50 flex flex-col justify-between p-6"
    >
      <FloatingPetals />

      {/* Top label */}
      <div className="relative z-10 text-center pt-4 pb-2">
        <span className="text-pink-200/90 text-xs uppercase tracking-[0.25em] font-semibold">
          ✦ Special For You ✦
        </span>
        <p className="text-rose-100/70 text-xs mt-1 font-light">Ngày Phụ Nữ Việt Nam 20/10</p>
      </div>

      {/* Main tap card */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={fire}
          className="w-full max-w-sm relative cursor-pointer group"
          aria-label="Mở thiệp"
        >
          {/* Envelope body */}
          <div
            className="relative w-full rounded-3xl p-6 flex flex-col items-center gap-4 text-center"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            {/* Heart icon */}
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{ background: 'rgba(255,255,255,0.18)' }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            >
              🌸
            </motion.div>

            {/* Name */}
            <div className="space-y-1">
              <p className="text-rose-200/90 text-xs font-semibold uppercase tracking-wider">Gửi đến</p>
              <h1
                className="text-white text-2xl sm:text-3xl font-black leading-normal tracking-wide"
                style={{ fontFamily: 'var(--font-display)', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
              >
                {student?.name ?? '…'}
              </h1>
              <p className="text-rose-200 text-xs sm:text-sm font-medium italic leading-relaxed">{student?.title ?? ''}</p>
            </div>

            {/* Divider */}
            <div className="w-16 h-px bg-white/30 my-1" />

            {/* CTA */}
            <div className="flex flex-col items-center gap-1.5">
              <p className="text-white text-sm font-semibold tracking-wide">Nhấn để mở thiệp</p>
              <motion.div
                className="bounce-y text-pink-200 text-xl"
              >
                💌
              </motion.div>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Bottom credit */}
      <div className="relative z-10 text-center pb-2">
        <p className="text-rose-200/70 text-xs font-medium tracking-wider">✨ Với tất cả yêu thương ✨</p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Main content (post-open)
// ─────────────────────────────────────────────
const TABS = [
  { id: 'wish', label: 'Lời Chúc', Icon: WishIcon },
  { id: 'gift', label: 'Món Quà', Icon: GiftIcon },
  { id: 'card', label: 'Vinh Danh', Icon: CardIcon },
];

function MainContent({ student }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <motion.div
      key="main"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
      className="absolute inset-0 z-40 flex flex-col justify-between"
    >
      <FloatingPetals />

      {/* Header */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between px-5 py-3 border-b border-white/10 bg-rose-950/80 backdrop-blur-md"
      >
        <div className="flex flex-col gap-0.5">
          <p className="text-pink-300 text-[10px] uppercase tracking-widest font-semibold leading-tight">20/10 Special</p>
          <h2 className="text-white font-bold text-base leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {student.name}
          </h2>
        </div>
        <div className="text-2xl shrink-0">🌸</div>
      </div>

      {/* Tab content */}
      <div className="relative z-10 flex-1 overflow-y-auto min-h-0">
        <AnimatePresence mode="wait">
          {activeTab === 0 && <WishTab key="w" student={student} />}
          {activeTab === 1 && <GiftTab key="g" student={student} />}
          {activeTab === 2 && <StoryTab key="s" student={student} />}
        </AnimatePresence>
      </div>

      {/* Bottom tab bar */}
      <div className="sticky bottom-0 z-20 p-2 bg-purple-950/90 backdrop-blur-md border-t border-white/10">
        <div className="flex gap-2">
          {TABS.map(({ id, label, Icon }, idx) => {
            const active = activeTab === idx;
            return (
              <button
                key={id}
                id={`tab-${id}`}
                onClick={() => setActiveTab(idx)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  active ? 'bg-pink-500 text-white shadow-md' : 'bg-white/10 text-rose-200 hover:bg-white/15'
                }`}
              >
                <Icon />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Loading skeleton
// ─────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4"
      style={{ background: 'linear-gradient(160deg, #831843, #4a044e)' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        className="text-4xl"
      >
        🌸
      </motion.div>
      <p className="text-pink-200/80 text-sm font-medium">Đang chuẩn bị thiệp…</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────
export default function App() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchStudent() {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id') || 'demo';

      // Try Supabase first (supabase will be null if env vars are missing)
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('id', id)
            .single();

          if (!error && data) {
            setStudent(data);
            setLoading(false);
            return;
          }
        } catch {
          // network / RLS error → fall through to fallback
        }
      }

      // Fallback: use built-in sample data so the screen is never blank
      setStudent({ ...FALLBACK });
      setLoading(false);
    }

    fetchStudent();
  }, []);

  return (
    <div className="w-full max-w-md h-dvh mx-auto relative overflow-hidden bg-gradient-to-b from-rose-900 via-pink-900 to-purple-950 text-white font-sans flex flex-col justify-between p-4">
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen key="loading" />
        ) : !isOpen ? (
          <EnvelopeScreen
            key="envelope"
            student={student}
            onOpen={() => setIsOpen(true)}
          />
        ) : (
          <MainContent key="main" student={student} />
        )}
      </AnimatePresence>
    </div>
  );
}