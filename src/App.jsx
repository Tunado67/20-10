import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';

// ─────────────────────────────────────────────
// Fallback sample data for Mini-Yearbook
// ─────────────────────────────────────────────
const FALLBACK = {
  id: 'demo',
  name: 'Hoa Xinh',
  title: 'Đoá Hoa Rực Rỡ 🌸',
  vibe: 'Năng Động & Tỏa Sáng ✨',
  stickers: ['🌸', '✨', '👑', '💖', '🎓', '🌺'],
  quote: 'Mong bạn luôn xinh đẹp, tự tin và là phiên bản rực rỡ nhất của chính mình!',
  avatar_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop&q=80',
  wishes: [
    {
      from: 'Tập thể Nam Sinh Lớp 12A',
      avatar: 'https://ui-avatars.com/api/?name=Nam+Sinh&background=0284c7&color=fff',
      text: 'Chúc bạn ngày 20/10 tràn ngập nụ cười và quà tặng! Cảm ơn bạn đã luôn đồng hành và mang năng lượng tích cực đến cho cả lớp ❤️'
    },
    {
      from: 'Tuấn Anh (Bí Thư)',
      avatar: 'https://ui-avatars.com/api/?name=Tuan+Anh&background=4f46e5&color=fff',
      text: 'Chúc bạn ngày 20/10 luôn xinh đẹp, học giỏi và vạn sự như ý! Mong bạn luôn rạng rỡ như đóa hoa hướng dương 🌻'
    }
  ],
  memories: [
    {
      id: 1,
      caption: 'Kỷ niệm chuyến dã ngoại lớp 📸',
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80',
      sticker: '🏕️',
      rotate: '-2.5deg'
    },
    {
      id: 2,
      caption: 'Lễ tổng kết rạng rỡ ✨',
      url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&auto=format&fit=crop&q=80',
      sticker: '🎓',
      rotate: '2.5deg'
    }
  ],
  gift: '🌹 Hoa hồng tươi & Thẻ quà tặng đặc biệt 🎁'
};

// ─────────────────────────────────────────────
// Floating Background Stickers & Sparkles
// ─────────────────────────────────────────────
const BACKGROUND_STICKERS = ['✨', '🌸', '💖', '🎀', '🌺', '🌷', '💕', '🌹', '✨', '🌸', '💖', '🎀'];

function FloatingStickers() {
  const items = useRef(
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      emoji: BACKGROUND_STICKERS[i % BACKGROUND_STICKERS.length],
      left: `${(i * 7 + 3) % 92}%`,
      delay: `${(i * 0.6) % 5}s`,
      duration: `${6.5 + (i * 1.1) % 5.5}s`,
      size: `${0.85 + (i * 0.12) % 0.8}rem`,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {items.map(s => (
        <span
          key={s.id}
          className="petal"
          style={{
            left: s.left,
            bottom: '-10%',
            animationDelay: s.delay,
            animationDuration: s.duration,
            fontSize: s.size,
          }}
        >
          {s.emoji}
        </span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
const WishIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const BackIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

// Framer Motion Scroll-Reveal Variant Configuration
const scrollReveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

// ─────────────────────────────────────────────
// Fullscreen Envelope Cover Screen
// ─────────────────────────────────────────────
function EnvelopeScreen({ student, onOpen }) {
  const handleTapCover = useCallback(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#f9a8d4', '#fbbf24', '#ffffff', '#f43f5e'],
      scalar: 1.1,
    });
    setTimeout(onOpen, 400);
  }, [onOpen]);

  return (
    <motion.div
      key="envelope"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ exit: { duration: 0.5, ease: 'easeInOut' } }}
      className="inset-0 absolute z-50 flex flex-col justify-between p-6 bg-gradient-to-b from-rose-950 via-pink-900 to-purple-950"
    >
      <FloatingStickers />

      {/* Header */}
      <div className="relative z-10 text-center pt-2">
        <span className="text-amber-300 text-xs uppercase tracking-[0.25em] font-extrabold">
          ✦ YEARBOOK 20/10 ✦
        </span>
        <p className="text-rose-200/80 text-xs mt-1 font-medium">Sổ Kỷ Niệm Phụ Nữ Việt Nam</p>
      </div>

      {/* Main Envelope Card */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleTapCover}
          className="w-full max-w-xs relative cursor-pointer"
        >
          <div
            className="rounded-3xl p-6 flex flex-col items-center gap-4 text-center border border-white/20 shadow-2xl relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <motion.div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl bg-white/10 border border-amber-300/40 shadow-inner"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              📖
            </motion.div>

            <div className="space-y-1">
              <span className="text-amber-300/90 text-[10px] font-bold uppercase tracking-widest">Dành riêng cho</span>
              <h1
                className="text-white text-2xl sm:text-3xl font-black leading-tight tracking-wide"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {student?.name ?? 'Hoa Xinh'}
              </h1>
              <p className="text-rose-200 text-xs font-semibold italic">{student?.title ?? 'Đoá Hoa Rực Rỡ'}</p>
            </div>

            <div className="w-16 h-px bg-amber-300/40 my-1" />

            <div className="flex flex-col items-center gap-1">
              <p className="text-white text-xs font-bold tracking-wide">Nhấn để mở Sổ Kỷ Niệm 🌸</p>
              <span className="text-pink-300 text-lg animate-bounce">✨</span>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center pb-2">
        <p className="text-rose-200/70 text-xs font-medium">✨ Lớp 12A · 20/10/2024 ✨</p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Hidden 9:16 Honor Card View
// ─────────────────────────────────────────────
function HonorCardView({ student, onBack }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);

    try {
      const studentAvatar = student.avatar_url || FALLBACK.avatar_url;
      let avatarSrc = studentAvatar;
      try {
        const res = await fetch(studentAvatar);
        const blob = await res.blob();
        avatarSrc = await new Promise(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch {
        avatarSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || 'Hoa')}&background=be185d&color=fff&size=256`;
      }

      const imgEl = cardRef.current.querySelector('img');
      const originalSrc = imgEl ? imgEl.src : null;
      if (imgEl) imgEl.src = avatarSrc;

      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: null,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      });

      if (imgEl && originalSrc) imgEl.src = originalSrc;

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `The-Vinh-Danh-20-10-${(student.name || 'Hoa').replace(/\s+/g, '-')}.png`;
      link.click();
      setDone(true);
      setTimeout(() => setDone(false), 3000);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f9a8d4', '#fbbf24', '#fff'],
      });
    } catch (err) {
      console.error('html2canvas download error:', err);
      alert('Không thể tải ảnh. Vui lòng thử lại!');
    } finally {
      setDownloading(false);
    }
  }, [student, downloading]);

  return (
    <motion.div
      key="honor-card-view"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth flex flex-col justify-between items-center gap-4 relative z-10"
    >
      <div className="w-full text-center">
        <span className="text-amber-300 text-xs font-bold uppercase tracking-widest">
          🏅 THẺ VINH DANH PHỤ NỮ VIỆT NAM 20/10
        </span>
      </div>

      {/* 9:16 Aspect Ratio Honor Card */}
      <div
        ref={cardRef}
        className="w-full aspect-[9/16] max-h-[65vh] rounded-3xl p-5 bg-gradient-to-br from-pink-600 via-rose-500 to-purple-700 shadow-2xl flex flex-col justify-between relative overflow-hidden text-center mx-auto"
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

        <div className="flex justify-between items-center text-[10px] tracking-widest uppercase font-bold text-white/80 z-10">
          <span>YEARBOOK 20/10</span>
          <span>🏅 HONOR CARD</span>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 my-auto z-10">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-pink-400 shadow-md mx-auto overflow-hidden shrink-0">
            <img
              src={student.avatar_url || FALLBACK.avatar_url}
              alt={student.name}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              onError={e => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || 'Hoa')}&background=be185d&color=fff&size=256`;
              }}
            />
          </div>

          <div className="bg-white/20 border border-white/40 rounded-full px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase text-amber-200 shrink-0 mt-1">
            {student.title || FALLBACK.title}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md" style={{ fontFamily: 'var(--font-display)' }}>
            {student.name || FALLBACK.name}
          </h2>

          <p className="text-pink-100/90 text-xs italic max-w-[220px]">
            {student.vibe || FALLBACK.vibe}
          </p>

          <div className="w-8 h-0.5 bg-white/40 rounded-full my-0.5" />

          <div className="bg-black/20 border border-white/20 rounded-xl p-2 max-w-[220px] w-full text-center">
            <p className="text-[9px] uppercase font-bold text-amber-300 tracking-wider mb-0.5">Món Quà Dành Tặng 🎁</p>
            <p className="text-[10px] text-white/95 font-medium leading-tight">
              {student.gift || FALLBACK.gift}
            </p>
          </div>
        </div>

        <div className="pt-1.5 border-t border-white/20 text-[9px] text-white/70 font-medium z-10">
          🌸 Class Yearbook 2024 · 20 / 10 🌸
        </div>
      </div>

      {/* Action Buttons Below Card */}
      <div className="w-full max-w-xs flex flex-col gap-2.5 my-auto">
        <motion.button
          onClick={handleDownload}
          disabled={downloading}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs text-white transition-all cursor-pointer shadow-lg"
          style={{
            background: done
              ? 'linear-gradient(135deg, #16a34a, #15803d)'
              : 'linear-gradient(135deg, #be185d, #9d174d)',
            opacity: downloading ? 0.7 : 1,
          }}
        >
          {downloading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >⏳</motion.span>
              Đang tạo ảnh vinh danh…
            </>
          ) : done ? (
            <>✅ Đã tải ảnh vinh danh!</>
          ) : (
            <>
              <DownloadIcon /> Tải ảnh vinh danh (.png)
            </>
          )}
        </motion.button>

        <motion.button
          onClick={onBack}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs text-rose-200 bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all"
        >
          <BackIcon /> Quay lại trang kỷ niệm
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Loading Screen
// ─────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-rose-950 via-pink-900 to-purple-950">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        className="text-4xl"
      >
        🌸
      </motion.div>
      <p className="text-pink-200/80 text-sm font-medium">Đang tải Sổ Kỷ Niệm 20/10…</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main App Component
// ─────────────────────────────────────────────
export default function App() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [showHonorCard, setShowHonorCard] = useState(false);
  const [giftRevealed, setGiftRevealed] = useState(false);

  useEffect(() => {
    async function fetchStudent() {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id') || 'demo';

      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('id', id)
            .single();

          if (!error && data) {
            setStudent({ ...FALLBACK, ...data });
            setLoading(false);
            return;
          }
        } catch {
          // fallback on error
        }
      }

      setStudent({ ...FALLBACK });
      setLoading(false);
    }

    fetchStudent();
  }, []);

  const handleOpenHonorCard = useCallback(() => {
    confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.65 },
      colors: ['#ec4899', '#f9a8d4', '#fbbf24', '#ffffff', '#f43f5e'],
    });
    setShowHonorCard(true);
  }, []);

  const handleRevealGift = useCallback(() => {
    setGiftRevealed(true);
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#ec4899', '#f9a8d4', '#fbbf24', '#ffffff', '#f43f5e'],
    });
  }, []);

  const wishesList = student?.wishes || (student?.wish ? [{ from: 'Bạn Học', avatar: 'https://ui-avatars.com/api/?name=Ban+Hoc&background=0284c7&color=fff', text: student.wish }] : FALLBACK.wishes);
  const memoriesList = student?.memories || FALLBACK.memories;
  const stickerList = student?.stickers || FALLBACK.stickers;

  return (
    <div className="w-full max-w-sm sm:max-w-md h-dvh mx-auto relative overflow-hidden bg-gradient-to-b from-rose-950 via-pink-900 to-purple-950 text-white font-sans flex flex-col justify-between">
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen key="loading" />
        ) : !isOpen ? (
          <EnvelopeScreen
            key="envelope"
            student={student}
            onOpen={() => setIsOpen(true)}
          />
        ) : showHonorCard ? (
          <div key="honor-card-wrapper" className="absolute inset-0 z-10 flex flex-col justify-between">
            <FloatingStickers />
            <HonorCardView
              student={student}
              onBack={() => setShowHonorCard(false)}
            />
          </div>
        ) : (
          <div key="main-app" className="absolute inset-0 z-10 flex flex-col justify-between">
            <FloatingStickers />

            {/* Single Continuous Vertical Landing Page */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth flex flex-col gap-6 relative z-10">

              {/* SECTION 1: Intro Header (Scroll-Reveal) */}
              <motion.section
                {...scrollReveal}
                className="text-center pt-2 flex flex-col items-center gap-2"
              >
                <span className="text-amber-300 text-[10px] uppercase tracking-[0.25em] font-extrabold bg-white/10 px-3 py-1 rounded-full border border-amber-300/30 shadow-sm">
                  ✦ YEARBOOK 20/10 ✦
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  Sổ Kỷ Niệm 20/10
                </h1>
                <p className="text-rose-200/80 text-xs font-medium">Tỏa sáng & rực rỡ như những đóa hoa 🌸</p>
              </motion.section>

              {/* SECTION 2: Profile, Vibe & Emoji Stickers (Scroll-Reveal) */}
              <motion.section
                {...scrollReveal}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl flex flex-col items-center text-center gap-3 shadow-xl relative overflow-hidden"
              >
                <motion.div
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-pink-400 shadow-md mx-auto overflow-hidden shrink-0 relative avatar-glow"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <img
                    src={student?.avatar_url || FALLBACK.avatar_url}
                    alt={student?.name || 'Avatar'}
                    className="w-full h-full object-cover"
                    onError={e => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student?.name || 'Hoa')}&background=be185d&color=fff&size=256`;
                    }}
                  />
                </motion.div>

                <div className="flex flex-col items-center gap-1">
                  <span className="bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent text-xs font-bold uppercase tracking-wider">
                    {student?.title || FALLBACK.title}
                  </span>
                  <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    {student?.name || FALLBACK.name}
                  </h2>
                  <p className="text-pink-200 text-xs font-medium mt-0.5">
                    ✨ Vibe: <span className="font-bold text-amber-200">{student?.vibe || FALLBACK.vibe}</span>
                  </p>

                  {student?.quote && (
                    <p className="text-pink-100/90 text-xs italic mt-2 leading-relaxed max-w-xs bg-black/20 p-2.5 rounded-2xl border border-white/10">
                      “{student.quote}”
                    </p>
                  )}
                </div>

                {/* Floating/Interactive Emoji Stickers */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  {stickerList.map((stk, idx) => (
                    <motion.span
                      key={idx}
                      whileHover={{ scale: 1.3, rotate: 12 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-xl cursor-default filter drop-shadow select-none"
                    >
                      {stk}
                    </motion.span>
                  ))}
                </div>
              </motion.section>

              {/* SECTION 3: Polaroid Photo Gallery (Scroll-Reveal) */}
              <motion.section
                {...scrollReveal}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center justify-between border-b border-pink-400/20 pb-1.5">
                  <span className="text-pink-300 text-xs tracking-widest uppercase font-bold flex items-center gap-1.5">
                    📸 Góc Kỷ Niệm
                  </span>
                  <span className="text-[10px] text-rose-200/80 bg-white/10 px-2 py-0.5 rounded-full font-semibold">POLAROID GALLERY</span>
                </div>

                <div className="flex flex-col gap-5 items-center">
                  {memoriesList.map((mem) => (
                    <motion.div
                      key={mem.id}
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.04, rotate: 0 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full max-w-xs bg-white text-gray-800 p-3 pb-5 rounded-sm shadow-2xl relative transition-shadow duration-300"
                      style={{ transform: `rotate(${mem.rotate || '0deg'})` }}
                    >
                      {/* Washi Tape Effect */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-pink-200/80 border border-white/60 rounded-sm shadow-sm z-10 backdrop-blur-xs" />

                      {/* Polaroid Sticker Badge */}
                      <div className="absolute top-2 right-2 text-2xl z-10 filter drop-shadow">
                        {mem.sticker || '✨'}
                      </div>

                      {/* Photo Box */}
                      <div className="aspect-[4/3] w-full bg-gray-100 rounded-xs overflow-hidden shadow-inner">
                        <img
                          src={mem.url}
                          alt={mem.caption}
                          className="w-full h-full object-cover"
                          onError={e => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>

                      {/* Polaroid Caption */}
                      <p className="mt-3 text-center font-bold text-xs text-rose-950 tracking-wide font-serif">
                        {mem.caption}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* SECTION 4: Wishes from Classmates (Scroll-Reveal) */}
              <motion.section
                {...scrollReveal}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl flex flex-col gap-3 shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-pink-400/20 pb-2">
                  <span className="text-pink-300 text-xs tracking-widest uppercase font-bold flex items-center gap-1.5">
                    <WishIcon /> Lời Chúc Từ Bạn Học 💌
                  </span>
                  <span className="text-[10px] text-pink-200/80 bg-white/10 px-2 py-0.5 rounded-full font-semibold">20/10 SPECIAL</span>
                </div>

                <div className="flex flex-col gap-3">
                  {wishesList.map((w, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.01 }}
                      className="bg-black/20 rounded-2xl p-3.5 flex flex-col gap-2 border border-white/10 shadow-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={w.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(w.from || 'Nam Sinh')}&background=0284c7&color=fff`}
                          alt={w.from}
                          className="w-8 h-8 rounded-full object-cover border border-pink-300/40 shrink-0"
                        />
                        <h4 className="text-white text-xs font-bold">{w.from || 'Tập thể Nam Sinh'}</h4>
                      </div>
                      <p className="text-rose-100/90 text-xs leading-relaxed italic">
                        “{w.text}”
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* SECTION 5: Interactive Secret Gift Box (Scroll-Reveal) */}
              <motion.section
                {...scrollReveal}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 text-center flex flex-col items-center gap-3 shadow-lg relative overflow-hidden"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  🎁 Món Quà Bí Mật
                </h4>

                <AnimatePresence mode="wait">
                  {!giftRevealed ? (
                    <motion.button
                      key="box"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.93 }}
                      onClick={handleRevealGift}
                      className="py-3.5 px-6 bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 rounded-2xl font-bold text-xs text-white shadow-xl cursor-pointer flex items-center gap-2.5 border border-pink-300/30"
                      animate={{
                        scale: [1, 1.03, 1],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.span
                        animate={{ rotate: [-8, 8, -8] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                        className="text-xl"
                      >
                        🎁
                      </motion.span>
                      <span>Nhấn để mở quà bí mật 🎀</span>
                    </motion.button>
                  ) : (
                    <motion.div
                      key="revealed"
                      initial={{ scale: 0.6, opacity: 0, rotate: -5 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="text-pink-100 text-xs font-bold leading-relaxed bg-pink-900/80 p-4 rounded-2xl border border-pink-400/40 w-full shadow-inner flex flex-col items-center gap-1.5"
                    >
                      <span className="text-2xl animate-bounce">🌹</span>
                      <p className="text-amber-200 text-xs font-extrabold uppercase tracking-wide">Món Quà Dành Tặng Bạn</p>
                      <p className="text-white text-sm mt-0.5">{student?.gift || FALLBACK.gift}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>

              {/* Bottom Prominent Glowing CTA Button (Scroll-Reveal) */}
              <motion.div
                {...scrollReveal}
                className="pt-2 pb-6"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleOpenHonorCard}
                  className="w-full py-4 px-5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer shadow-xl transition-all border border-pink-300/40"
                  style={{
                    background: 'linear-gradient(135deg, #ec4899, #be185d, #a21caf)',
                    boxShadow: '0 4px 25px rgba(236, 72, 153, 0.6)',
                  }}
                >
                  <span>Nhận Thẻ Vinh Danh (9:16) ✨</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                  >
                    <ArrowRightIcon />
                  </motion.span>
                </motion.button>
              </motion.div>

            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}