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
      rotate: '-2deg'
    },
    {
      id: 2,
      caption: 'Lễ tổng kết rạng rỡ ✨',
      url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&auto=format&fit=crop&q=80',
      sticker: '🎓',
      rotate: '3deg'
    }
  ],
  gift: '🌹 Hoa hồng tươi & Thẻ quà tặng đặc biệt 🎁'
};

// ─────────────────────────────────────────────
// Floating petals background
// ─────────────────────────────────────────────
const PETALS = ['🌸', '🌺', '🌷', '✨', '💕', '🌹'];

function FloatingPetals() {
  const items = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    emoji: PETALS[i % PETALS.length],
    left: `${5 + (i * 8) % 90}%`,
    delay: `${(i * 0.7) % 6}s`,
    duration: `${6 + (i * 1.2) % 6}s`,
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
// Icons
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
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M7 15h2" />
    <path d="M12 15h5" />
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
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
      className="inset-0 absolute z-50 flex flex-col justify-between p-6 bg-gradient-to-b from-rose-900 via-pink-900 to-purple-950"
    >
      <FloatingPetals />

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
// Tab 1: Lời Chúc ('wishes' Tab)
// ─────────────────────────────────────────────
function WishesTab({ student, onNext }) {
  const wishesList = student.wishes || (student.wish ? [{ from: 'Bạn Học', avatar: 'https://ui-avatars.com/api/?name=Ban+Hoc&background=0284c7&color=fff', text: student.wish }] : FALLBACK.wishes);

  return (
    <motion.div
      key="tab-wishes"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="p-4 flex flex-col gap-4 pb-6"
    >
      {/* Profile / Avatar Card */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl flex flex-col items-center text-center gap-3 shadow-xl relative overflow-hidden">
        <div className="relative">
          <img
            src={student.avatar_url || FALLBACK.avatar_url}
            alt={student.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-pink-400/80 shadow-2xl mx-auto"
            onError={e => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || 'Hoa')}&background=be185d&color=fff&size=256`;
            }}
          />
          <span className="absolute -bottom-1 -right-1 text-2xl">🌸</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent text-xs font-bold uppercase tracking-wider mb-1">
            {student.title || FALLBACK.title}
          </span>
          <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
            {student.name || FALLBACK.name}
          </h2>
          {student.quote && (
            <p className="text-pink-200/90 text-xs italic mt-2 leading-relaxed max-w-xs">
              “{student.quote}”
            </p>
          )}
        </div>
      </div>

      {/* Wishes Section */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl flex flex-col gap-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-pink-400/20 pb-2">
          <span className="text-pink-300 text-xs tracking-widest uppercase font-bold flex items-center gap-1.5">
            <WishIcon /> Lời Chúc Yêu Thương 💌
          </span>
          <span className="text-[10px] text-pink-200/80 bg-white/10 px-2 py-0.5 rounded-full font-semibold">20/10 SPECIAL</span>
        </div>

        <div className="flex flex-col gap-3">
          {wishesList.map((w, idx) => (
            <div key={idx} className="bg-black/20 rounded-2xl p-3.5 flex flex-col gap-2 border border-white/10">
              <div className="flex items-center gap-2.5">
                <img
                  src={w.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(w.from || 'Nam Sinh')}&background=0284c7&color=fff`}
                  alt={w.from}
                  className="w-8 h-8 rounded-full object-cover border border-pink-300/40"
                />
                <h4 className="text-white text-xs font-bold">{w.from || 'Tập thể Nam Sinh'}</h4>
              </div>
              <p className="text-rose-100/90 text-xs leading-relaxed italic">
                “{w.text}”
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Next CTA Button */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onNext}
        className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer shadow-xl transition-all"
        style={{
          background: 'linear-gradient(135deg, #ec4899, #be185d)',
          boxShadow: '0 4px 20px rgba(236,72,153,0.5)',
        }}
      >
        <span>Xem Món Quà & Kỷ Niệm</span>
        <motion.span
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        >
          <ArrowRightIcon />
        </motion.span>
      </motion.button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Tab 2: Món Quà ('gift' Tab)
// ─────────────────────────────────────────────
function GiftTab({ student, onNext }) {
  const [giftRevealed, setGiftRevealed] = useState(false);
  const memories = student.memories || FALLBACK.memories;

  const handleRevealGift = useCallback(() => {
    setGiftRevealed(true);
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="p-4 flex flex-col gap-4 pb-6"
    >
      {/* Secret Gift Box Section */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 text-center flex flex-col items-center gap-3 shadow-lg">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">Món Quà Bí Mật 🎁</h4>
        <AnimatePresence mode="wait">
          {!giftRevealed ? (
            <motion.button
              key="box"
              whileTap={{ scale: 0.93 }}
              onClick={handleRevealGift}
              className="py-3 px-6 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl font-bold text-xs text-white shadow-lg cursor-pointer flex items-center gap-2"
            >
              <span>🎀 Nhấn để nhận món quà</span>
            </motion.button>
          ) : (
            <motion.div
              key="revealed"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-pink-100 text-xs font-bold leading-relaxed bg-pink-900/60 p-3 rounded-xl border border-pink-400/30"
            >
              {student.gift || FALLBACK.gift}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Memories Photo Gallery */}
      <div className="flex items-center justify-between border-b border-pink-400/20 pb-1 mt-1">
        <span className="text-pink-300 text-xs tracking-widest uppercase font-bold">✦ Góc Kỷ Niệm 📸 ✦</span>
        <span className="text-xs text-rose-200/80">Class Gallery</span>
      </div>

      <div className="flex flex-col gap-4 items-center">
        {memories.map((mem) => (
          <motion.div
            key={mem.id}
            whileHover={{ scale: 1.02 }}
            className="w-full max-w-xs bg-white text-gray-800 p-3 pb-4 rounded-xl shadow-2xl relative transition-transform duration-200"
            style={{ transform: `rotate(${mem.rotate || '0deg'})` }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-pink-200/70 border border-white/80 rounded-sm shadow-sm opacity-90 backdrop-blur-sm z-10" />
            <div className="absolute top-2 right-2 text-2xl z-10 filter drop-shadow">
              {mem.sticker || '✨'}
            </div>
            <div className="aspect-[4/3] w-full bg-gray-100 rounded-lg overflow-hidden shadow-inner">
              <img
                src={mem.url}
                alt={mem.caption}
                className="w-full h-full object-cover"
                onError={e => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80';
                }}
              />
            </div>
            <p className="mt-3 text-center font-bold text-xs text-rose-900 tracking-wide font-serif">
              {mem.caption}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onNext}
        className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer shadow-xl transition-all"
        style={{
          background: 'linear-gradient(135deg, #ec4899, #be185d)',
          boxShadow: '0 4px 20px rgba(236,72,153,0.5)',
        }}
      >
        <span>Nhận Thẻ Vinh Danh (9:16) 🏅</span>
        <motion.span
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        >
          <ArrowRightIcon />
        </motion.span>
      </motion.button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Tab 3: Dedicated Honor Card ('card' Tab)
// ─────────────────────────────────────────────
function HonorCardTab({ student, onBackToWishes }) {
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
      link.download = `Thẻ-Vinh-Danh-20-10-${(student.name || 'Hoa').replace(/\s+/g, '-')}.png`;
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
      key="tab-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="p-3 flex flex-col items-center gap-3 pb-8"
    >
      {/* 9:16 Aspect Ratio Honor Card strictly per design specs */}
      <div
        ref={cardRef}
        className="w-full aspect-[9/16] max-h-[60vh] rounded-2xl p-4 bg-gradient-to-br from-pink-600 via-rose-500 to-purple-700 shadow-2xl flex flex-col justify-between relative overflow-hidden text-center mx-auto"
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

        <div className="flex justify-between items-center text-[10px] tracking-widest uppercase font-bold text-white/80 z-10">
          <span>YEARBOOK 20/10</span>
          <span>🏅 HONOR CARD</span>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 my-auto z-10">
          <img
            src={student.avatar_url || FALLBACK.avatar_url}
            alt={student.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white mx-auto shadow-md"
            crossOrigin="anonymous"
            onError={e => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || 'Hoa')}&background=be185d&color=fff&size=256`;
            }}
          />

          <div className="bg-white/20 border border-white/40 rounded-full px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase text-amber-200 shrink-0">
            {student.title || FALLBACK.title}
          </div>

          <h2 className="text-xl font-black text-white leading-tight drop-shadow-md" style={{ fontFamily: 'var(--font-display)' }}>
            {student.name || FALLBACK.name}
          </h2>

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
      <div className="w-full max-w-xs flex flex-col gap-2">
        <motion.button
          onClick={handleDownload}
          disabled={downloading}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs text-white transition-all cursor-pointer shadow-lg"
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
          onClick={onBackToWishes}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-semibold text-xs text-rose-200 bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all"
        >
          <BackIcon /> Quay lại trang lời chúc
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
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-rose-900 via-pink-900 to-purple-950">
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
  const [activeTab, setActiveTab] = useState('wishes'); // 'wishes' | 'gift' | 'card'

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
          <div key="main-app" className="absolute inset-0 z-10 flex flex-col justify-between">
            <FloatingPetals />

            {/* Sticky Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3 border-b border-white/10 bg-rose-950/90 backdrop-blur-md shrink-0">
              <div className="flex flex-col gap-0.5">
                <p className="text-amber-300 text-[10px] uppercase tracking-widest font-extrabold leading-tight">20/10 YEARBOOK</p>
                <h2 className="text-white font-bold text-base leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  {student?.name || FALLBACK.name}
                </h2>
              </div>
              <div className="text-2xl shrink-0">🌸</div>
            </div>

            {/* Scrollable Main Content Area */}
            <div className="relative z-10 flex-1 overflow-y-auto min-h-0 flex flex-col">
              <AnimatePresence mode="wait">
                {activeTab === 'wishes' && (
                  <WishesTab
                    key="wishes"
                    student={student}
                    onNext={() => setActiveTab('gift')}
                  />
                )}
                {activeTab === 'gift' && (
                  <GiftTab
                    key="gift"
                    student={student}
                    onNext={() => setActiveTab('card')}
                  />
                )}
                {activeTab === 'card' && (
                  <HonorCardTab
                    key="card"
                    student={student}
                    onBackToWishes={() => setActiveTab('wishes')}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Fixed Bottom Navigation Bar - 3 Equal Width Distinct Tabs */}
            <div className="sticky bottom-0 z-20 p-2 bg-purple-950/95 backdrop-blur-md border-t border-white/10 shrink-0">
              <div className="flex gap-2">
                <button
                  id="tab-wishes"
                  onClick={() => setActiveTab('wishes')}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    activeTab === 'wishes'
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-white/10 text-rose-200 hover:bg-white/15'
                  }`}
                >
                  <WishIcon />
                  <span className="truncate">Lời Chúc</span>
                </button>

                <button
                  id="tab-gift"
                  onClick={() => setActiveTab('gift')}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    activeTab === 'gift'
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-white/10 text-rose-200 hover:bg-white/15'
                  }`}
                >
                  <GiftIcon />
                  <span className="truncate">Món Quà</span>
                </button>

                <button
                  id="tab-card"
                  onClick={() => setActiveTab('card')}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    activeTab === 'card'
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-white/10 text-rose-200 hover:bg-white/15'
                  }`}
                >
                  <CardIcon />
                  <span className="truncate">Thẻ Vinh Danh</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}