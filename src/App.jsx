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
      from: 'Tập thể Lớp',
      avatar: 'https://ui-avatars.com/api/?name=Nam+Sinh&background=0284c7&color=fff',
      text: 'Chúc bạn ngày 20/10 luôn xinh đẹp, tràn ngập nụ cười và học tốt!'
    },
    {
      from: 'Bí Thư',
      avatar: 'https://ui-avatars.com/api/?name=Tuan+Anh&background=4f46e5&color=fff',
      text: 'Chúc bạn 20/10 luôn rực rỡ như hoa hướng dương 🌻'
    }
  ],
  gift: '🌹 Hoa hồng tươi & Thẻ quà tặng đặc biệt 🎁'
};

// ─────────────────────────────────────────────
// Floating Ambient Particles Component
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
// STAGE 1: Enchanted Glass Rose (Slow Fade-In duration-2000)
// Starts with completely dark screen, glass rose and container fade in slowly (2000ms).
// Prompt text: "Nhấn nhẹ để mở ✨". Tap triggers bright bloom flash.
// ─────────────────────────────────────────────
function Stage1EnchantedRose({ onRoseTap }) {
  const [flashing, setFlashing] = useState(false);

  const handleTap = () => {
    if (flashing) return;
    setFlashing(true);
    setTimeout(() => {
      onRoseTap();
    }, 600);
  };

  return (
    <motion.div
      key="stage-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 2.0, ease: 'easeInOut' }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-between py-12 px-6 bg-slate-950 text-white select-none overflow-hidden duration-2000"
    >
      {/* Bloom Flash Effect Overlay on Tap */}
      {flashing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.9] }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-white z-50 pointer-events-none"
        />
      )}

      {/* Floating Glimmer Stars */}
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
          transition={{ delay: 0.6, duration: 1.2 }}
          className="text-amber-300 text-[11px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full bg-white/5 border border-amber-300/20 backdrop-blur-md"
        >
          ✨ BẢO TÀNG HOA HỒNG BẤT TỬ ✨
        </motion.span>
        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 1.2 }}
          className="text-xl sm:text-2xl font-black mt-3 bg-gradient-to-r from-pink-200 via-rose-300 to-amber-200 bg-clip-text text-transparent drop-shadow-lg"
        >
          Lồng Kính Diệu Kỳ
        </motion.h1>
      </div>

      {/* Glass Dome & Glowing Rose */}
      <motion.div
        whileTap={{ scale: 0.95 }}
        onClick={handleTap}
        className="relative z-10 cursor-pointer my-auto flex flex-col items-center group"
      >
        <div className="absolute w-56 h-72 rounded-full bg-rose-600/25 blur-3xl -z-10 group-hover:bg-pink-500/35 transition-all duration-500" />

        <div className="relative w-52 sm:w-60 h-72 sm:h-80 rounded-t-full rounded-b-3xl glass-dome flex flex-col items-center justify-end pb-8 px-4 border border-white/30 shadow-2xl overflow-hidden">
          <div className="absolute top-4 left-6 w-3 h-40 bg-gradient-to-b from-white/60 via-white/10 to-transparent rounded-full rotate-[-12deg] pointer-events-none" />
          <div className="absolute top-8 right-8 w-1.5 h-28 bg-gradient-to-b from-white/40 via-white/5 to-transparent rounded-full rotate-[8deg] pointer-events-none" />

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

          <div className="rose-glow mb-2 text-center select-none">
            <span className="text-7xl sm:text-8xl block filter drop-shadow-[0_0_25px_rgba(244,63,94,0.9)]">
              🌹
            </span>
          </div>

          <div className="flex gap-2 text-sm opacity-80 mt-1">
            <span className="rotate-[-25deg] transform translate-y-1">🥀</span>
            <span className="rotate-[15deg] transform translate-y-2">🌸</span>
            <span className="rotate-[-10deg] transform">🥀</span>
          </div>
        </div>

        <div className="w-60 sm:w-68 h-5 bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 rounded-lg shadow-2xl border-t border-amber-700/60 -mt-1 flex items-center justify-center">
          <div className="w-48 h-1 bg-amber-600/40 rounded-full" />
        </div>
      </motion.div>

      {/* Prompt Text */}
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
// STAGE 2: Mini Flip Card & Large Centered Bouquet
// 1) Mini Card Page-Flipping Messages: Tapping card flips smoothly to next message chunk.
// 2) Large Centered Bouquet: Once pages completed and user clicks continue (or flips last page),
//    display large bouquet in the center blooming slowly & gracefully.
// 3) Bottom button: "Mở Thẻ Vinh Danh ✈️ →"
// ─────────────────────────────────────────────
function Stage2MiniCardAndBouquet({ skyMessages, onNextStage }) {
  const messages = skyMessages && skyMessages.length > 0 ? skyMessages : FALLBACK.sky_messages;
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [messagesFinished, setMessagesFinished] = useState(false);
  const [flowerStage, setFlowerStage] = useState(0);

  const handleCardFlip = () => {
    if (isFlipping || messagesFinished) return;
    setIsFlipping(true);

    if (currentPage < messages.length - 1) {
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsFlipping(false);
      }, 300);
    } else {
      setTimeout(() => {
        setMessagesFinished(true);
        setIsFlipping(false);
      }, 300);
    }
  };

  // Slower, graceful blooming bouquet sequence when messages finished
  useEffect(() => {
    if (!messagesFinished) return;
    const timers = [];
    timers.push(setTimeout(() => setFlowerStage(1), 600));
    timers.push(setTimeout(() => setFlowerStage(2), 1600));
    timers.push(setTimeout(() => setFlowerStage(3), 2600));
    timers.push(setTimeout(() => setFlowerStage(4), 3800));

    return () => timers.forEach(t => clearTimeout(t));
  }, [messagesFinished]);

  return (
    <motion.div
      key="stage-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 z-20 flex flex-col justify-between p-6 bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950 text-white overflow-hidden"
    >
      <AmbientParticles />

      {/* Header */}
      <div className="z-10 text-center pt-2">
        <span className="text-pink-300 text-[10px] font-bold tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full border border-pink-300/30">
          {messagesFinished ? '💐 ĐÓA HOA TỎA SÁNG' : '📖 LẬT THẺ THÔNG ĐIỆP'}
        </span>
      </div>

      {/* Center Section: Mini Flip Card OR Large Centered Bouquet */}
      <div className="z-10 my-auto flex flex-col items-center justify-center w-full max-w-xs mx-auto">
        {!messagesFinished ? (
          <div className="flex flex-col items-center w-full gap-4">
            {/* Interactive Mini Flip Card */}
            <motion.div
              onClick={handleCardFlip}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              animate={{ rotateY: isFlipping ? 90 : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="w-full min-h-[190px] bg-gradient-to-br from-rose-900/90 via-purple-900/90 to-slate-900/90 backdrop-blur-xl border-2 border-pink-400/40 rounded-2xl p-6 shadow-2xl cursor-pointer flex flex-col justify-between relative overflow-hidden select-none text-center"
            >
              {/* Decorative Corner Stars */}
              <div className="absolute top-2 left-3 text-amber-300 text-xs">✨</div>
              <div className="absolute top-2 right-3 text-pink-300 text-xs">🌸</div>
              <div className="absolute bottom-2 right-3 text-amber-200 text-xs">✨</div>

              <div className="text-[10px] font-bold text-pink-300 tracking-wider uppercase">
                THÔNG ĐIỆP #{currentPage + 1} / {messages.length}
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={currentPage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm sm:text-base font-medium text-pink-100 leading-relaxed my-auto text-glow"
                >
                  "{messages[currentPage]}"
                </motion.p>
              </AnimatePresence>

              <div className="text-[11px] text-pink-300/80 font-semibold flex items-center justify-center gap-1.5 pt-2 border-t border-pink-400/20">
                <span>Chạm để lật sang trang tiếp</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                >
                  📖 →
                </motion.span>
              </div>
            </motion.div>

            {/* Page Dots */}
            <div className="flex items-center gap-2">
              {messages.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentPage ? 'w-6 bg-pink-400' : 'w-2 bg-pink-900/60'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Large Centered Bouquet blooming slowly and gracefully */
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="flex flex-col items-center gap-4 my-auto w-full py-4"
          >
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center">
              {/* Background Bouquet Glow */}
              <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full -z-10" />

              {/* Center Main Large Flower */}
              <motion.span
                animate={{
                  scale: flowerStage >= 1 ? [0, 1.3, 1.1] : 0,
                  rotate: flowerStage >= 1 ? 0 : -45
                }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="text-7xl sm:text-8xl z-20 absolute filter drop-shadow-[0_0_25px_rgba(244,63,94,0.9)] select-none"
              >
                🌺
              </motion.span>

              {/* Side Flowers blooming sequentially around center bouquet */}
              {flowerStage >= 2 && (
                <motion.span
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ scale: 1, x: -55, y: -30, rotate: -22 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="text-5xl sm:text-6xl absolute z-10 select-none"
                >
                  🌸
                </motion.span>
              )}
              {flowerStage >= 2 && (
                <motion.span
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ scale: 1, x: 55, y: -30, rotate: 22 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="text-5xl sm:text-6xl absolute z-10 select-none"
                >
                  🌷
                </motion.span>
              )}
              {flowerStage >= 3 && (
                <motion.span
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ scale: 1, x: -45, y: 38, rotate: -35 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="text-4xl sm:text-5xl absolute z-10 select-none"
                >
                  🌹
                </motion.span>
              )}
              {flowerStage >= 3 && (
                <motion.span
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ scale: 1, x: 45, y: 38, rotate: 35 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="text-4xl sm:text-5xl absolute z-10 select-none"
                >
                  🌻
                </motion.span>
              )}
              {flowerStage >= 4 && (
                <>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    className="text-3xl absolute -top-6 text-amber-300 z-30"
                  >
                    ✨
                  </motion.span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2.2, delay: 0.5 }}
                    className="text-2xl absolute -bottom-4 text-pink-300 z-30"
                  >
                    💖
                  </motion.span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm font-bold text-pink-200 tracking-wide text-center">
              {flowerStage < 4 ? 'Đóa hoa đang từ từ nở rộ… 🌸' : 'Bó hoa tươi thắm rực rỡ tỏa ngát hương! 💐'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Bottom Action Button: "Mở Thẻ Vinh Danh ✈️ →" */}
      <div className="z-10 pb-4 h-16 flex items-end">
        {messagesFinished && flowerStage >= 4 && (
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNextStage}
            className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer shadow-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 border border-pink-300/40"
          >
            <span>Mở Thẻ Vinh Danh ✈️</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
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
// STAGE 3: Redesigned Honor Card (Visa Passport / Boarding Pass Style)
// Direct transition from Stage 2 (photo gallery removed).
// Strictly uses required container styles:
// w-full aspect-[9/16] max-h-[65vh] rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-rose-950 to-purple-950 border border-pink-500/30 shadow-2xl flex flex-col justify-between relative overflow-hidden text-center mx-auto
// Features avatar photo, student name, general class wishes, personalized sticker icons around the card,
// and corner departure/customs seal stamp stamping down with text: "CÔ GÁI CỦA NĂM".
// Staggered animations using Framer Motion. Fully functional html2canvas download & restart buttons.
// ─────────────────────────────────────────────
function Stage3HonorCardPassport({ student, onRestart }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  const studentData = student || FALLBACK;
  const stickers = studentData.stickers && studentData.stickers.length > 0 ? studentData.stickers : FALLBACK.stickers;
  const wishesList = studentData.wishes && studentData.wishes.length > 0 ? studentData.wishes : FALLBACK.wishes;

  // Staggered variants for Passport Card elements
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const stampVariants = {
    hidden: { opacity: 0, scale: 2.2, rotate: -35 },
    visible: {
      opacity: 0.95,
      scale: 1,
      rotate: -12,
      transition: { delay: 1.2, duration: 0.5, type: 'spring', stiffness: 220, damping: 15 },
    },
  };

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);

    try {
      const studentAvatar = studentData.avatar_url || FALLBACK.avatar_url;
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
        avatarSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(studentData.name || 'Hoa')}&background=be185d&color=fff&size=256`;
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
      link.download = `Passport-Vinh-Danh-${(studentData.name || 'Hoa').replace(/\s+/g, '-')}.png`;
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
  }, [studentData, downloading]);

  return (
    <motion.div
      key="stage-3"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-20 flex flex-col justify-between items-center p-4 sm:p-5 bg-gradient-to-b from-slate-950 via-rose-950 to-purple-950 text-white overflow-y-auto no-scrollbar"
    >
      <AmbientParticles />

      {/* Header Badge */}
      <div className="w-full text-center pt-1 z-10 shrink-0">
        <span className="text-amber-300 text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-amber-300/30">
          ✈️ VIP BOARDING PASS & PASSPORT VISA ✈️
        </span>
      </div>

      {/* Visa Passport / Boarding Pass Styled Honor Card */}
      <motion.div
        ref={cardRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full aspect-[9/16] max-h-[65vh] rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-rose-950 to-purple-950 border border-pink-500/30 shadow-2xl flex flex-col justify-between relative overflow-hidden text-center mx-auto my-auto z-10"
      >
        {/* Background Aviation Graphics */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Personalized Sticker Icons arranged naturally around card edges */}
        <motion.div variants={itemVariants} className="absolute top-12 left-4 text-xl select-none opacity-90 drop-shadow">
          {stickers[0] || '🌸'}
        </motion.div>
        <motion.div variants={itemVariants} className="absolute top-12 right-4 text-xl select-none opacity-90 drop-shadow">
          {stickers[1] || '✨'}
        </motion.div>
        <motion.div variants={itemVariants} className="absolute bottom-16 left-4 text-xl select-none opacity-90 drop-shadow">
          {stickers[2] || '👑'}
        </motion.div>
        <motion.div variants={itemVariants} className="absolute bottom-16 right-4 text-xl select-none opacity-90 drop-shadow">
          {stickers[3] || '💖'}
        </motion.div>

        {/* Boarding Pass Top Header */}
        <motion.div variants={itemVariants} className="flex justify-between items-center text-[10px] tracking-widest uppercase font-bold text-pink-300/90 z-10 border-b border-pink-500/20 pb-2">
          <div className="flex items-center gap-1">
            <span>✈️</span>
            <span>AIR 20-10 VISA</span>
          </div>
          <div className="bg-pink-500/20 border border-pink-400/30 px-2 py-0.5 rounded-md text-[9px] text-amber-200">
            CLASS: VIP
          </div>
        </motion.div>

        {/* Passport Main Section (Avatar, Name, Title, Wishes) */}
        <div className="flex flex-col items-center justify-center gap-2 my-auto z-10">
          {/* Avatar Photo with Passport Frame */}
          <motion.div variants={itemVariants} className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-pink-400/80 p-1 bg-slate-900 shadow-xl mx-auto overflow-hidden shrink-0">
              <img
                src={studentData.avatar_url || FALLBACK.avatar_url}
                alt={studentData.name}
                className="w-full h-full object-cover rounded-xl"
                crossOrigin="anonymous"
                onError={e => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(studentData.name || 'Hoa')}&background=be185d&color=fff&size=256`;
                }}
              />
            </div>
            {/* Sticker icon top right of avatar frame */}
            <span className="absolute -top-2 -right-2 text-base select-none">
              {stickers[4] || '🎓'}
            </span>
          </motion.div>

          {/* Student Name */}
          <motion.h2 variants={itemVariants} className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md mt-1">
            {studentData.name || FALLBACK.name}
          </motion.h2>

          {/* Student Vibe / Title */}
          <motion.div variants={itemVariants} className="bg-white/10 border border-white/20 rounded-full px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase text-amber-200 shrink-0">
            {studentData.vibe || studentData.title || FALLBACK.vibe}
          </motion.div>

          {/* General Class Wishes Box */}
          <motion.div variants={itemVariants} className="bg-black/40 border border-pink-500/20 rounded-xl p-2.5 max-w-[240px] w-full text-center mt-1">
            <p className="text-[9px] uppercase font-bold text-pink-300 tracking-wider mb-1 flex items-center justify-center gap-1">
              <span>💌</span> LỜI CHÚC TỪ TẬP THỂ
            </p>
            <p className="text-[10px] text-pink-100/90 font-medium leading-relaxed italic line-clamp-2">
              "{wishesList[0]?.text || studentData.quote || FALLBACK.quote}"
            </p>
          </motion.div>
        </div>

        {/* Official Customs/Departure Seal Stamp Effect */}
        <motion.div
          variants={stampVariants}
          className="absolute bottom-10 right-4 z-20 pointer-events-none"
        >
          <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-full border-2 border-dashed border-rose-500 text-rose-400 bg-rose-950/60 backdrop-blur-xs flex flex-col items-center justify-center p-1 text-center shadow-2xl rotate-[-12deg]">
            <span className="text-[7px] font-black uppercase tracking-widest text-amber-300">★ APPROVED ★</span>
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-rose-200 leading-tight my-0.5">
              CÔ GÁI<br />CỦA NĂM
            </span>
            <span className="text-[7px] font-bold text-pink-300">20/10 VISA</span>
          </div>
        </motion.div>

        {/* Boarding Pass Bottom Barcode & Footer */}
        <motion.div variants={itemVariants} className="pt-2 border-t border-pink-500/20 text-center z-10">
          <div className="flex justify-between items-center text-[8px] text-pink-300/70 font-mono tracking-wider mb-1">
            <span>PASSPORT NO: 2010-2025</span>
            <span>GATE: LOVE-01</span>
          </div>
          <div className="w-full h-4 bg-white/10 rounded flex items-center justify-center gap-1 overflow-hidden opacity-60">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className="h-full bg-pink-200"
                style={{ width: `${(i % 3) * 2 + 1}px`, opacity: i % 2 === 0 ? 0.9 : 0.4 }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Action Buttons: html2canvas PNG download & restart */}
      <div className="w-full max-w-xs flex flex-col gap-2 z-10 pb-2 shrink-0">
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
              Đang tạo Passport Vinh Danh…
            </>
          ) : done ? (
            <>✅ Đã tải Thẻ Vinh Danh (.png)!</>
          ) : (
            <>
              📥 Tải ảnh Vinh Danh (.png)
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
  const [currentStage, setCurrentStage] = useState(1); // Stages 1, 2, 3

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
    setCurrentStage(prev => Math.min(3, prev + 1));
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
              <Stage2MiniCardAndBouquet
                skyMessages={student?.sky_messages || FALLBACK.sky_messages}
                onNextStage={handleNextStage}
              />
            )}

            {currentStage === 3 && (
              <Stage3HonorCardPassport
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
