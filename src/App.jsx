import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';

// ─────────────────────────────────────────────
// Fallback Sample Data
// ─────────────────────────────────────────────
const FALLBACK = {
  id: 'demo',
  name: 'Hoa Xinh',
  title: 'Đoá Hoa Rực Rỡ 🌸',
  vibe: 'Năng Động & Tỏa Sáng ✨',
  stickers: ['🌸', '✨', '👑', '💖', '🎓', '🌺'],
  quote: 'Mong bạn luôn xinh đẹp, tự tin và là phiên bản rực rỡ nhất của chính mình!',
  avatar_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop&q=80',
  sky_messages: [
    'Chào bạn, một ngày 20/10 thật đẹp đã đến! 💖',
    'Gửi tới bạn những tia nắng ấm áp nhất và ngàn nụ cười rạng rỡ ✨',
    'Cảm ơn vì sự hiện diện đáng yêu của bạn luôn mang lại niềm vui cho mọi người 🌹'
  ],
  letter_content: `Thân gửi bạn,\n\nNhân ngày Phụ nữ Việt Nam 20/10, chúc bạn luôn tràn đầy năng lượng tích cực, luôn yêu thương bản thân và gặt hái thật nhiều thành công.\n\nHãy luôn giữ trọn nụ cười rạng rỡ và tỏa sáng theo cách riêng của bạn nhé! ✨🌸`,
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
      caption: 'Kỷ niệm chuyến dã ngoại 📸',
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
    },
    {
      id: 3,
      caption: 'Khoảnh khắc rạng ngời 🌸',
      url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&auto=format&fit=crop&q=80',
      sticker: '✨',
      rotate: '-1deg'
    }
  ],
  gift: '🌹 Hoa hồng tươi & Thẻ quà tặng đặc biệt 🎁'
};

// ─────────────────────────────────────────────
// Floating Ambient Particles / Petals Component
// ─────────────────────────────────────────────
const BACKGROUND_EMOJIS = ['✨', '🌸', '💖', '🎀', '🌺', '🌷', '✨', '🌹'];

function AmbientParticles() {
  const particles = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: BACKGROUND_EMOJIS[i % BACKGROUND_EMOJIS.length],
      left: `${(i * 8 + 3) % 92}%`,
      delay: `${(i * 0.4) % 4}s`,
      duration: `${6 + (i * 0.8) % 4}s`,
      size: `${0.8 + (i * 0.1) % 0.6}rem`,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map(p => (
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
// STAGE 1: Enchanted Glass Rose (100vh)
// ─────────────────────────────────────────────
function Stage1EnchantedRose({ onRoseTap }) {
  const [flashing, setFlashing] = useState(false);

  const handleTap = () => {
    if (flashing) return;
    setFlashing(true);
    setTimeout(() => {
      onRoseTap();
    }, 500);
  };

  return (
    <motion.div
      key="stage-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-between py-12 px-6 bg-slate-950 text-white select-none overflow-hidden"
    >
      {/* Flash Effect Overlay */}
      {flashing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.8] }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-white z-50 pointer-events-none"
        />
      )}

      {/* Floating Glimmer Stars Background */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="glimmer-particle text-amber-200"
            style={{
              top: `${10 + (i * 17) % 80}%`,
              left: `${5 + (i * 23) % 90}%`,
              animationDelay: `${(i * 0.3) % 3}s`,
              animationDuration: `${3 + (i * 0.5) % 3}s`,
              fontSize: `${0.7 + (i % 3) * 0.4}rem`
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Header Title */}
      <div className="z-10 text-center pt-2">
        <motion.span
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-amber-300 text-[11px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full bg-white/5 border border-amber-300/20 backdrop-blur-md"
        >
          ✨ BẢO TÀNG HOA HỒNG BẤT TỬ ✨
        </motion.span>
        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl sm:text-2xl font-black mt-3 bg-gradient-to-r from-pink-200 via-rose-300 to-amber-200 bg-clip-text text-transparent drop-shadow-lg"
        >
          Lồng Kính Diệu Kỳ
        </motion.h1>
      </div>

      {/* Glass Dome & Rose Container */}
      <motion.div
        whileTap={{ scale: 0.95 }}
        onClick={handleTap}
        className="relative z-10 cursor-pointer my-auto flex flex-col items-center group"
      >
        {/* Soft Aura behind Dome */}
        <div className="absolute w-56 h-72 rounded-full bg-rose-600/25 blur-3xl -z-10 group-hover:bg-pink-500/35 transition-all duration-500" />

        {/* Dome Structure */}
        <div className="relative w-52 sm:w-60 h-72 sm:h-80 rounded-t-full rounded-b-3xl glass-dome flex flex-col items-center justify-end pb-8 px-4 border border-white/30 shadow-2xl overflow-hidden">
          {/* Glass Specular Light Reflection Lines */}
          <div className="absolute top-4 left-6 w-3 h-40 bg-gradient-to-b from-white/60 via-white/10 to-transparent rounded-full rotate-[-12deg] pointer-events-none" />
          <div className="absolute top-8 right-8 w-1.5 h-28 bg-gradient-to-b from-white/40 via-white/5 to-transparent rounded-full rotate-[8deg] pointer-events-none" />

          {/* Floating Magic Glimmers inside Dome */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="absolute top-12 text-amber-300 text-xs pointer-events-none drop-shadow-md"
          >
            ✨
          </motion.div>
          <motion.div
            animate={{ y: [6, -6, 6] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="absolute top-24 left-10 text-pink-300 text-[10px] pointer-events-none"
          >
            🌸
          </motion.div>
          <motion.div
            animate={{ y: [-4, 8, -4] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className="absolute top-32 right-10 text-amber-200 text-xs pointer-events-none"
          >
            ✨
          </motion.div>

          {/* Glowing Rose */}
          <div className="rose-glow mb-2 text-center select-none">
            <span className="text-7xl sm:text-8xl block filter drop-shadow-[0_0_25px_rgba(244,63,94,0.9)]">
              🌹
            </span>
          </div>

          {/* Petals Fallen on Dome Wooden Pedestal */}
          <div className="flex gap-2 text-sm opacity-80 mt-1">
            <span className="rotate-[-25deg] transform translate-y-1">🥀</span>
            <span className="rotate-[15deg] transform translate-y-2">🌸</span>
            <span className="rotate-[-10deg] transform">🥀</span>
          </div>
        </div>

        {/* Pedestal Base */}
        <div className="w-60 sm:w-68 h-5 bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 rounded-lg shadow-2xl border-t border-amber-700/60 -mt-1 flex items-center justify-center">
          <div className="w-48 h-1 bg-amber-600/40 rounded-full" />
        </div>
      </motion.div>

      {/* Tap Prompt */}
      <div className="z-10 text-center pb-2 flex flex-col items-center gap-2">
        <motion.p
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="text-glow text-sm sm:text-base font-bold text-pink-200 tracking-wide cursor-pointer"
          onClick={handleTap}
        >
          Nhấn nhẹ để mở ✨
        </motion.p>
        <p className="text-[11px] text-pink-300/70 italic">
          Khám phá món quà tuyệt vời dành riêng cho bạn
        </p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// STAGE 2: Soothing Sky & Typewriter Messages & Blooming Bouquet
// ─────────────────────────────────────────────
function Stage2SoothingSky({ skyMessages, onNextStage }) {
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [messagesDone, setMessagesDone] = useState(false);
  const [flowerStage, setFlowerStage] = useState(0); // 0 to 4 blooming step

  const currentMessage = skyMessages[displayedIndex] || skyMessages[0];

  // Typewriter effect for current sky message
  useEffect(() => {
    if (messagesDone) return;
    let charIdx = 0;
    setTypedText('');

    const interval = setInterval(() => {
      if (charIdx < currentMessage.length) {
        setTypedText(currentMessage.slice(0, charIdx + 1));
        charIdx++;
      } else {
        clearInterval(interval);
        // Wait before showing next message or finishing messages
        setTimeout(() => {
          if (displayedIndex < skyMessages.length - 1) {
            setDisplayedIndex(prev => prev + 1);
          } else {
            setMessagesDone(true);
          }
        }, 1200);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [displayedIndex, currentMessage, skyMessages.length, messagesDone]);

  // Flower blooming sequence once messages finish
  useEffect(() => {
    if (!messagesDone) return;
    const timers = [];
    timers.push(setTimeout(() => setFlowerStage(1), 400));
    timers.push(setTimeout(() => setFlowerStage(2), 1000));
    timers.push(setTimeout(() => setFlowerStage(3), 1600));
    timers.push(setTimeout(() => setFlowerStage(4), 2200));

    return () => timers.forEach(t => clearTimeout(t));
  }, [messagesDone]);

  return (
    <motion.div
      key="stage-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 z-20 flex flex-col justify-between p-6 bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950 text-white overflow-hidden"
    >
      <AmbientParticles />

      {/* Header */}
      <div className="z-10 text-center pt-2">
        <span className="text-pink-300 text-[10px] font-bold tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full border border-pink-300/30">
          🌌 BẦU TRỜI THÔNG ĐIỆP
        </span>
      </div>

      {/* Messages Container */}
      <div className="z-10 my-auto flex flex-col items-center gap-4 w-full max-w-xs mx-auto text-center min-h-[140px] justify-center">
        {skyMessages.slice(0, displayedIndex).map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.85, y: 0 }}
            className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-xs text-pink-100 shadow-md w-full"
          >
            {msg}
          </motion.div>
        ))}

        {!messagesDone && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-rose-900/80 to-purple-900/80 backdrop-blur-lg rounded-2xl border border-pink-400/30 text-sm text-white font-medium shadow-xl w-full text-glow"
          >
            <span className="typing-cursor">{typedText}</span>
          </motion.div>
        )}
      </div>

      {/* Blooming Flower Bouquet Section */}
      <div className="z-10 flex flex-col items-center justify-center my-auto min-h-[160px]">
        {messagesDone ? (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-2"
          >
            {/* Flower bouquet blooming steps */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Center Main Flower */}
              <motion.span
                animate={{
                  scale: flowerStage >= 1 ? [0.2, 1.2, 1] : 0,
                  rotate: flowerStage >= 1 ? 0 : -45
                }}
                transition={{ duration: 0.6 }}
                className="text-6xl z-20 absolute filter drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]"
              >
                🌺
              </motion.span>

              {/* Side Flowers blooming sequentially */}
              {flowerStage >= 2 && (
                <motion.span
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ scale: 1, x: -38, y: -20, rotate: -20 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-4xl absolute z-10"
                >
                  🌸
                </motion.span>
              )}
              {flowerStage >= 2 && (
                <motion.span
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ scale: 1, x: 38, y: -20, rotate: 20 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-4xl absolute z-10"
                >
                  🌷
                </motion.span>
              )}
              {flowerStage >= 3 && (
                <motion.span
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ scale: 1, x: -28, y: 25, rotate: -35 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-3xl absolute z-10"
                >
                  🌹
                </motion.span>
              )}
              {flowerStage >= 3 && (
                <motion.span
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ scale: 1, x: 28, y: 25, rotate: 35 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-3xl absolute z-10"
                >
                  🌻
                </motion.span>
              )}
              {flowerStage >= 4 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-2xl absolute -top-4 text-amber-300 z-30"
                >
                  ✨
                </motion.span>
              )}
            </div>

            <p className="text-xs font-bold text-pink-200 tracking-wide mt-2">
              {flowerStage < 4 ? 'Đó hoa đang nở rộ… 🌸' : 'Bó hoa tươi thắm tỏa ngát hương! 💐'}
            </p>
          </motion.div>
        ) : (
          <p className="text-[11px] text-pink-300/60 italic">Đang tải câu từ yêu thương…</p>
        )}
      </div>

      {/* Action Button */}
      <div className="z-10 pb-4">
        {flowerStage >= 4 && (
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNextStage}
            className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer shadow-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 border border-pink-300/40"
          >
            <span>Xem Thiệp Lời Chúc ✉️</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              →
            </motion.span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// STAGE 3: Sealed Envelope & Typewriter Letter
// ─────────────────────────────────────────────
function Stage3SealedEnvelope({ student, onNextStage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [letterTypedText, setLetterTypedText] = useState('');
  const [letterComplete, setLetterComplete] = useState(false);

  const rawLetter = student?.letter_content || FALLBACK.letter_content;

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    setIsOpen(true);
    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#fbbf24', '#f43f5e', '#ffffff']
    });
  };

  // Letter typewriter effect
  useEffect(() => {
    if (!isOpen) return;
    let index = 0;
    setLetterTypedText('');

    const timer = setInterval(() => {
      if (index < rawLetter.length) {
        setLetterTypedText(rawLetter.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setLetterComplete(true);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [isOpen, rawLetter]);

  return (
    <motion.div
      key="stage-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-20 flex flex-col justify-between p-5 bg-gradient-to-b from-slate-950 via-rose-950 to-purple-950 text-white overflow-y-auto no-scrollbar"
    >
      <AmbientParticles />

      {/* Header */}
      <div className="z-10 text-center pt-2">
        <span className="text-amber-300 text-[10px] font-bold tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full border border-amber-300/30">
          💌 BỨC THƯ TỪ TRÁI TIM
        </span>
      </div>

      {/* Envelope & Letter Container */}
      <div className="z-10 my-auto flex flex-col items-center justify-center w-full max-w-xs mx-auto py-4">
        {!isOpen ? (
          /* Sealed Envelope View */
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="w-full bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900 border-2 border-pink-400/40 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-between min-h-[280px] relative overflow-hidden"
          >
            {/* Envelope Flap Triangles Visual */}
            <div className="absolute top-0 left-0 right-0 h-28 bg-white/5 clip-path-flap border-b border-white/10 pointer-events-none" />

            <div className="text-center z-10 pt-3">
              <span className="text-xs text-pink-200 uppercase font-semibold tracking-wider">
                Gửi tới
              </span>
              <h2 className="text-xl font-extrabold text-amber-200 mt-1">
                {student?.name || FALLBACK.name} 💖
              </h2>
            </div>

            {/* Wax Seal Button */}
            <motion.div
              whileTap={{ scale: 0.9 }}
              onClick={handleOpenEnvelope}
              className="z-10 flex flex-col items-center cursor-pointer my-4"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-600 to-rose-800 border-2 border-amber-300 flex items-center justify-center shadow-2xl wax-seal-glow">
                <span className="text-amber-200 font-extrabold text-sm uppercase tracking-wide">
                  Mở
                </span>
              </div>
              <span className="text-[11px] text-pink-200 font-medium mt-2">
                Nhấn vào dấu sáp để mở ✉️
              </span>
            </motion.div>

            <div className="text-[10px] text-pink-300/60 z-10">
              ✨ 20 Tháng 10 Special Letter
            </div>
          </motion.div>
        ) : (
          /* Unfolded Letter View */
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="w-full bg-amber-50 text-slate-800 rounded-3xl p-5 shadow-2xl border-4 border-amber-200 relative text-left min-h-[300px] flex flex-col justify-between"
          >
            {/* Decorative Top Stamp */}
            <div className="flex justify-between items-center border-b border-amber-200 pb-3 mb-2">
              <div>
                <p className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                  THƯ CHÚC MỪNG 20/10
                </p>
                <p className="text-xs font-black text-slate-900">
                  Thân gửi: {student?.name || FALLBACK.name}
                </p>
              </div>
              <span className="text-2xl">🌹</span>
            </div>

            {/* Letter Text Content with Typewriter Effect */}
            <div className="text-xs sm:text-sm font-medium leading-relaxed text-slate-800 whitespace-pre-wrap font-serif my-auto py-2">
              <span className={!letterComplete ? 'typing-cursor' : ''}>
                {letterTypedText}
              </span>
            </div>

            {/* Bottom Signature */}
            <div className="pt-2 border-t border-amber-200 text-right">
              <p className="text-[11px] font-bold text-rose-900 italic">
                — Trân trọng & Yêu thương ❤️
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Action Button upon letter completion */}
      <div className="z-10 pb-4">
        {letterComplete && (
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNextStage}
            className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer shadow-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 border border-pink-300/40"
          >
            <span>Tiếp Tục Kỷ Niệm 📸</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              →
            </motion.span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// STAGE 4: Photo Gallery (Album Ảnh Kỷ Niệm)
// ─────────────────────────────────────────────
function Stage4PhotoGallery({ memories, onNextStage }) {
  return (
    <motion.div
      key="stage-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-20 flex flex-col justify-between p-5 bg-gradient-to-b from-slate-950 via-pink-950 to-purple-950 text-white overflow-y-auto no-scrollbar"
    >
      <AmbientParticles />

      {/* Header */}
      <div className="z-10 text-center pt-2 mb-2">
        <span className="text-pink-300 text-[10px] font-bold tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full border border-pink-300/30">
          📸 ALBUM KỶ NIỆM
        </span>
        <h2 className="text-xl font-black text-white mt-1">
          Khoảnh Khắc Đáng Nhớ
        </h2>
      </div>

      {/* Polaroid Photos Grid */}
      <div className="z-10 flex flex-col items-center gap-4 my-auto py-2 w-full max-w-xs mx-auto">
        {memories.map((mem) => (
          <motion.div
            key={mem.id}
            whileHover={{ scale: 1.04, rotate: 0 }}
            className="w-full max-w-[240px] sm:max-w-[260px] bg-white text-gray-800 p-2.5 pb-3 rounded-xl shadow-2xl relative transition-transform"
            style={{ transform: `rotate(${mem.rotate || '0deg'})` }}
          >
            {/* Washi Tape */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-pink-200/90 border border-white/60 rounded-sm shadow-sm z-10" />

            {/* Sticker */}
            <div className="absolute top-1 right-1 text-xl z-10 select-none">
              {mem.sticker || '✨'}
            </div>

            {/* Photo */}
            <div className="w-full bg-gray-100 rounded-lg overflow-hidden shadow-inner">
              <img
                src={mem.url}
                alt={mem.caption}
                className="w-full h-36 sm:h-40 object-cover"
                onError={e => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80';
                }}
              />
            </div>

            {/* Caption */}
            <p className="mt-2 text-center font-bold text-xs text-rose-950 font-serif">
              {mem.caption}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Final Action Button */}
      <div className="z-10 pb-4 pt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNextStage}
          className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer shadow-2xl border border-pink-300/40"
          style={{
            background: 'linear-gradient(135deg, #ec4899, #be185d, #a21caf)',
            boxShadow: '0 4px 20px rgba(236, 72, 153, 0.5)',
          }}
        >
          <span>Xem Thẻ Vinh Danh (9:16) ✨</span>
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            →
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// STAGE 5: Honor Card 9:16 View & Download
// ─────────────────────────────────────────────
function Stage5HonorCard({ student, onRestart }) {
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
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f9a8d4', '#fbbf24', '#ffffff'],
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
      key="stage-5"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-20 flex flex-col justify-between items-center p-4 sm:p-5 bg-gradient-to-b from-slate-950 via-rose-950 to-purple-950 text-white overflow-y-auto no-scrollbar"
    >
      <AmbientParticles />

      <div className="w-full text-center pt-1 z-10">
        <span className="text-amber-300 text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-amber-300/30">
          ✨ THẺ VINH DANH STORY ✨
        </span>
      </div>

      {/* Strict 9:16 Aspect Ratio Honor Card */}
      <div
        ref={cardRef}
        className="w-full aspect-[9/16] max-h-[60vh] rounded-3xl p-5 bg-gradient-to-br from-pink-600 via-rose-500 to-purple-700 shadow-2xl flex flex-col justify-between text-center mx-auto relative overflow-hidden z-10 my-auto"
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

      {/* Action Buttons */}
      <div className="w-full max-w-xs flex flex-col gap-2 z-10 pb-2">
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
              >
                ⏳
              </motion.span>
              Đang tạo ảnh vinh danh…
            </>
          ) : done ? (
            <>✅ Đã tải ảnh vinh danh!</>
          ) : (
            <>
              📥 Tải ảnh vinh danh (.png)
            </>
          )}
        </motion.button>

        <motion.button
          onClick={onRestart}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs text-rose-200 bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all"
        >
          ← Xem lại từ đầu
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP COMPONENT
// ─────────────────────────────────────────────
export default function App() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStage, setCurrentStage] = useState(1); // Stage 1 to 5

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

  const handleNextStage = () => {
    setCurrentStage(prev => Math.min(5, prev + 1));
  };

  const handleRestart = () => {
    setCurrentStage(1);
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md h-dvh mx-auto relative overflow-hidden bg-slate-950 text-white font-sans flex flex-col justify-between">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              className="text-4xl"
            >
              🌹
            </motion.div>
            <p className="text-pink-200/80 text-xs font-medium tracking-wide">
              Đang mở bảo tàng hoa hồng…
            </p>
          </motion.div>
        ) : (
          <>
            {currentStage === 1 && (
              <Stage1EnchantedRose onRoseTap={handleNextStage} />
            )}

            {currentStage === 2 && (
              <Stage2SoothingSky
                skyMessages={student?.sky_messages || FALLBACK.sky_messages}
                onNextStage={handleNextStage}
              />
            )}

            {currentStage === 3 && (
              <Stage3SealedEnvelope
                student={student}
                onNextStage={handleNextStage}
              />
            )}

            {currentStage === 4 && (
              <Stage4PhotoGallery
                memories={student?.memories || FALLBACK.memories}
                onNextStage={handleNextStage}
              />
            )}

            {currentStage === 5 && (
              <Stage5HonorCard
                student={student}
                onRestart={handleRestart}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
