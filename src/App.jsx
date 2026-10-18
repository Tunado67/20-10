import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';

// ─────────────────────────────────────────────
// Fallback sample data
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
      rotate: '-2deg'
    },
    {
      id: 2,
      caption: 'Lễ tổng kết rạng rỡ ✨',
      url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&auto=format&fit=crop&q=80',
      sticker: '🎓',
      rotate: '2deg'
    }
  ],
  gift: '🌹 Hoa hồng tươi & Thẻ quà tặng đặc biệt 🎁'
};

// ─────────────────────────────────────────────
// Floating Background Stickers & Petals
// ─────────────────────────────────────────────
const BACKGROUND_STICKERS = ['✨', '🌸', '💖', '🎀', '🌺', '🌷', '💕', '🌹', '✨', '🌸', '💖', '🎀'];

function FloatingStickers() {
  const items = useRef(
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      emoji: BACKGROUND_STICKERS[i % BACKGROUND_STICKERS.length],
      left: `${(i * 7.5 + 4) % 92}%`,
      delay: `${(i * 0.5) % 4.5}s`,
      duration: `${6 + (i * 1.1) % 5}s`,
      size: `${0.85 + (i * 0.12) % 0.75}rem`,
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

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
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

// Sub-tab definitions
const TABS = [
  { id: 'wishes', label: 'Lời chúc', icon: '💌' },
  { id: 'memories', label: 'Kỷ niệm & Ảnh', icon: '📸' },
  { id: 'gift', label: 'Món quà', icon: '🎁' },
];

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
      <p className="text-pink-200/80 text-xs font-medium tracking-wide">Đang tải dữ liệu…</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Story Honor Card View (9:16 Aspect Ratio)
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
      link.download = `The-Vinh-Danh-${(student.name || 'Hoa').replace(/\s+/g, '-')}.png`;
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
      className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col justify-between items-center gap-4 relative z-10 h-full"
    >
      <div className="w-full text-center pt-1">
        <span className="text-amber-300 text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-amber-300/30">
          ✨ THẺ VINH DANH ✨
        </span>
      </div>

      {/* 9:16 Aspect Ratio Honor Card - Strict Specs */}
      <div
        ref={cardRef}
        className="w-full aspect-[9/16] max-h-[60vh] rounded-3xl p-5 bg-gradient-to-br from-pink-600 via-rose-500 to-purple-700 shadow-2xl flex flex-col justify-between relative overflow-hidden text-center mx-auto"
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

        <div className="flex justify-between items-center text-[10px] tracking-widest uppercase font-bold text-white/80 z-10">
          <span>🌸 20/10</span>
          <span>🏅 HONOR CARD</span>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 my-auto z-10">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-pink-300/80 shadow-lg mx-auto overflow-hidden shrink-0">
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

          <h2 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md">
            {student.name || FALLBACK.name}
          </h2>

          <p className="text-pink-100/90 text-xs italic max-w-[220px]">
            {student.vibe || FALLBACK.vibe}
          </p>

          <div className="w-8 h-0.5 bg-white/40 rounded-full my-0.5" />

          <div className="bg-black/25 border border-white/20 rounded-xl p-2.5 max-w-[220px] w-full text-center">
            <p className="text-[9px] uppercase font-bold text-amber-300 tracking-wider mb-0.5">Món Quà Dành Tặng 🎁</p>
            <p className="text-[10px] text-white/95 font-medium leading-tight">
              {student.gift || FALLBACK.gift}
            </p>
          </div>
        </div>

        <div className="pt-1.5 border-t border-white/20 text-[9px] text-white/70 font-medium z-10">
          ✨ Special Honor Card · 20/10 ✨
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-xs flex flex-col gap-2 my-auto pb-2">
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
          <BackIcon /> ← Quay lại
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Main App Component
// ─────────────────────────────────────────────
export default function App() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
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

  const isLastTab = activeTab === TABS.length - 1;

  return (
    <div className="w-full max-w-sm sm:max-w-md h-dvh mx-auto relative overflow-hidden bg-gradient-to-b from-rose-950 via-pink-900 to-purple-950 text-white font-sans flex flex-col justify-between">
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen key="loading" />
        ) : showHonorCard ? (
          <div key="honor-card-wrapper" className="absolute inset-0 z-10 flex flex-col justify-between">
            <FloatingStickers />
            <HonorCardView
              student={student}
              onBack={() => setShowHonorCard(false)}
            />
          </div>
        ) : (
          <div key="main-app" className="absolute inset-0 z-10 flex flex-col justify-between p-4 sm:p-5">
            <FloatingStickers />

            {/* Top Sub-Tab Navigation Indicators */}
            <div className="relative z-10 flex items-center justify-between gap-1.5 p-1.5 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 shrink-0">
              {TABS.map((tab, idx) => {
                const isActive = activeTab === idx;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(idx)}
                    className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-md'
                        : 'text-rose-200/70 hover:text-white'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-Tab Content View */}
            <div className="flex-1 overflow-y-auto my-3 relative z-10 flex flex-col">
              <AnimatePresence mode="wait">
                {activeTab === 0 && (
                  <motion.div
                    key="tab-wishes"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-4 my-auto py-2"
                  >
                    {/* Student Profile Card */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl flex flex-col items-center text-center gap-3 shadow-xl">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-pink-400 shadow-md mx-auto overflow-hidden shrink-0 avatar-glow">
                        <img
                          src={student?.avatar_url || FALLBACK.avatar_url}
                          alt={student?.name || 'Avatar'}
                          className="w-full h-full object-cover"
                          onError={e => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student?.name || 'Hoa')}&background=be185d&color=fff&size=256`;
                          }}
                        />
                      </div>

                      <div className="flex flex-col items-center gap-1">
                        <span className="bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent text-xs font-bold uppercase tracking-wider">
                          {student?.title || FALLBACK.title}
                        </span>
                        <h2 className="text-2xl font-black text-white">
                          {student?.name || FALLBACK.name}
                        </h2>
                        <p className="text-pink-200 text-xs font-medium">
                          ✨ Vibe: <span className="font-bold text-amber-200">{student?.vibe || FALLBACK.vibe}</span>
                        </p>

                        {student?.quote && (
                          <p className="text-pink-100/90 text-xs italic mt-1.5 leading-relaxed bg-black/20 p-2.5 rounded-2xl border border-white/10">
                            “{student.quote}”
                          </p>
                        )}
                      </div>

                      {/* Interactive Stickers */}
                      <div className="flex items-center justify-center gap-2 pt-0.5">
                        {stickerList.map((stk, idx) => (
                          <motion.span
                            key={idx}
                            whileHover={{ scale: 1.3, rotate: 12 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-lg select-none"
                          >
                            {stk}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* Wishes Section */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl flex flex-col gap-3 shadow-lg">
                      <div className="flex items-center justify-between border-b border-pink-400/20 pb-2">
                        <span className="text-pink-300 text-xs tracking-widest uppercase font-bold flex items-center gap-1.5">
                          <WishIcon /> Lời Chúc Dành Cho Bạn 💌
                        </span>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        {wishesList.map((w, idx) => (
                          <div
                            key={idx}
                            className="bg-black/20 rounded-2xl p-3 flex flex-col gap-1.5 border border-white/10"
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={w.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(w.from || 'Ban')}&background=0284c7&color=fff`}
                                alt={w.from}
                                className="w-7 h-7 rounded-full object-cover border border-pink-300/40 shrink-0"
                              />
                              <h4 className="text-white text-xs font-bold">{w.from || 'Người Gửi'}</h4>
                            </div>
                            <p className="text-rose-100/90 text-xs leading-relaxed italic">
                              “{w.text}”
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 1 && (
                  <motion.div
                    key="tab-memories"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-4 my-auto py-2"
                  >
                    <div className="flex items-center justify-between border-b border-pink-400/20 pb-2">
                      <span className="text-pink-300 text-xs tracking-widest uppercase font-bold flex items-center gap-1.5">
                        📸 Kỷ Niệm & Khoảnh Khắc
                      </span>
                    </div>

                    <div className="flex flex-col gap-4 items-center w-full">
                      {memoriesList.map((mem) => (
                        <div
                          key={mem.id}
                          className="w-full max-w-[85%] sm:max-w-[320px] mx-auto bg-white text-gray-800 p-2.5 pb-3 rounded-md shadow-xl relative transition-transform"
                          style={{ transform: `rotate(${mem.rotate || '0deg'})` }}
                        >
                          {/* Washi Tape */}
                          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-pink-200/80 border border-white/60 rounded-sm shadow-sm z-10" />

                          {/* Sticker */}
                          <div className="absolute top-1.5 right-1.5 text-xl z-10 select-none">
                            {mem.sticker || '✨'}
                          </div>

                          {/* Photo Box */}
                          <div className="w-full aspect-[4/3] bg-gray-100 rounded-xs overflow-hidden shadow-inner">
                            <img
                              src={mem.url}
                              alt={mem.caption}
                              className="w-full aspect-[4/3] object-cover"
                              onError={e => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80';
                              }}
                            />
                          </div>

                          {/* Caption */}
                          <p className="mt-2 text-center font-bold text-[11px] sm:text-xs text-rose-950 tracking-wide font-serif">
                            {mem.caption}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 2 && (
                  <motion.div
                    key="tab-gift"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-4 my-auto py-2"
                  >
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 text-center flex flex-col items-center gap-4 shadow-lg relative overflow-hidden">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                        🎁 Món Quà Dành Cho Bạn
                      </h4>

                      <AnimatePresence mode="wait">
                        {!giftRevealed ? (
                          <motion.button
                            key="box"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.94 }}
                            onClick={handleRevealGift}
                            className="py-4 px-6 bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 rounded-2xl font-bold text-xs text-white shadow-xl cursor-pointer flex items-center gap-2.5 border border-pink-300/30"
                            animate={{ scale: [1, 1.03, 1] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                          >
                            <motion.span
                              animate={{ rotate: [-8, 8, -8] }}
                              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                              className="text-2xl"
                            >
                              🎁
                            </motion.span>
                            <span>Nhấn để mở quà bí mật 🎀</span>
                          </motion.button>
                        ) : (
                          <motion.div
                            key="revealed"
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="text-pink-100 text-xs font-bold leading-relaxed bg-pink-900/80 p-5 rounded-2xl border border-pink-400/40 w-full shadow-inner flex flex-col items-center gap-2"
                          >
                            <span className="text-3xl animate-bounce">🌹</span>
                            <p className="text-amber-200 text-xs font-extrabold uppercase tracking-wide">Món Quà Đặc Biệt</p>
                            <p className="text-white text-sm font-semibold mt-1">{student?.gift || FALLBACK.gift}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Navigation Bar (Pagination Dots + Arrows across ALL sub-tabs) */}
            <div className="relative z-10 shrink-0 pt-2 pb-1 flex flex-col gap-2">
              {isLastTab && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenHonorCard}
                  className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer shadow-xl transition-all border border-pink-300/40"
                  style={{
                    background: 'linear-gradient(135deg, #ec4899, #be185d, #a21caf)',
                    boxShadow: '0 4px 20px rgba(236, 72, 153, 0.5)',
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
              )}

              <div className="flex items-center justify-between px-3 py-2 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10">
                {/* Left Arrow Button */}
                <button
                  onClick={() => setActiveTab(prev => Math.max(0, prev - 1))}
                  disabled={activeTab === 0}
                  className={`p-2 rounded-xl transition-all flex items-center justify-center ${
                    activeTab === 0
                      ? 'opacity-30 cursor-not-allowed text-white/40'
                      : 'text-white hover:bg-white/15 cursor-pointer active:scale-95'
                  }`}
                  aria-label="Previous Tab"
                >
                  <ArrowLeftIcon />
                </button>

                {/* Pagination Dots */}
                <div className="flex items-center gap-2">
                  {TABS.map((tab, idx) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(idx)}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        activeTab === idx
                          ? 'w-6 bg-gradient-to-r from-pink-400 to-rose-400'
                          : 'w-2.5 bg-white/30 hover:bg-white/50'
                      }`}
                      aria-label={`Go to ${tab.label}`}
                    />
                  ))}
                </div>

                {/* Right Arrow Button */}
                <button
                  onClick={() => {
                    if (!isLastTab) {
                      setActiveTab(prev => Math.min(TABS.length - 1, prev + 1));
                    } else {
                      handleOpenHonorCard();
                    }
                  }}
                  className="p-2 rounded-xl text-white hover:bg-white/15 cursor-pointer active:scale-95 transition-all flex items-center justify-center"
                  aria-label={isLastTab ? "Nhận Thẻ Vinh Danh" : "Next Tab"}
                >
                  <ArrowRightIcon />
                </button>
              </div>
            </div>

          </div>
        )}
      </AnimatePresence>
    </div>
  );
}