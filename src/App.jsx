import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { supabase } from "./supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import confetti from "canvas-confetti";

// ─────────────────────────────────────────────
// Fallback Sample Data
// ─────────────────────────────────────────────
const FALLBACK = {
  id: "demo",
  name: "Hoa Xinh",
  title: "Đoá Hoa Rực Rỡ 🌸",
  vibe: "Năng Động & Tỏa Sáng ✨",
  stickers: ["🌸", "✨", "👑", "💖", "🎓", "🌺"],
  quote: "Mong bạn luôn xinh đẹp, tự tin và là phiên bản rực rỡ nhất của chính mình!",
  avatar_url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop&q=80",
  sky_messages: [
    "Chào bạn, một ngày 20/10 thật đẹp đã đến! 💖",
    "Gửi tới bạn những tia nắng ấm áp nhất và ngàn nụ cười rạng rỡ ✨",
    "Cảm ơn vì sự hiện diện đáng yêu của bạn luôn mang lại niềm vui cho mọi người 🌹"
  ],
  wishes: [
    {
      from: "Tập thể Lớp 12A",
      avatar: "https://ui-avatars.com/api/?name=Nam+Sinh&background=0284c7&color=fff",
      text: "Chúc bạn ngày 20/10 luôn xinh đẹp, tràn ngập nụ cười và học tốt!"
    }
  ]
};

// ─────────────────────────────────────────────
// Floating Ambient Particles Component
// ─────────────────────────────────────────────
const BACKGROUND_EMOJIS = ["✨", "🌸", "💖", "🎀", "🌺", "🌷", "✨", "🌹"];

function AmbientParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        emoji: BACKGROUND_EMOJIS[i % BACKGROUND_EMOJIS.length],
        left: `${(i * 8 + 3) % 92}%`,
        delay: `${(i * 0.4) % 4}s`,
        duration: `${6 + (i * 0.8) % 4}s`,
        size: `${0.8 + (i * 0.1) % 0.6}rem`,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map(p => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            bottom: "-10%",
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
      transition={{ duration: 2.0, ease: "easeInOut" }}
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
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="absolute top-12 text-amber-300 text-xs pointer-events-none drop-shadow-md"
          >
            ✨
          </motion.div>
          <motion.div
            animate={{ y: [6, -6, 6] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute top-24 left-10 text-pink-300 text-[10px] pointer-events-none"
          >
            🌸
          </motion.div>
          <motion.div
            animate={{ y: [-4, 8, -4] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
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
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
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
// 1) Mini Card Page-Flipping Messages: Plain text without header titles or quote marks.
// 2) Large Centered Bouquet: After flipping through messages, blooming bouquet completes.
// 3) Auto-transitions to Stage 3 immediately after flower bouquet finishes blooming.
// ─────────────────────────────────────────────
function Stage2MiniCardAndBouquet({ skyMessages, onNextStage }) {
  const messages = useMemo(() => {
    const raw = skyMessages && skyMessages.length > 0 ? skyMessages : FALLBACK.sky_messages;
    return raw.map(m => (typeof m === "string" ? m.normalize("NFC") : m));
  }, [skyMessages]);
  const [currentPage, setCurrentPage] = useState(0);
  const [messagesFinished, setMessagesFinished] = useState(false);
  const [flowerStage, setFlowerStage] = useState(0);
  const [fireworksSettled, setFireworksSettled] = useState(false);

  const handleCardFlip = () => {
    if (messagesFinished) return;
    if (currentPage < messages.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      setMessagesFinished(true);
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

  // Fireworks celebration trigger after flower bouquet finishes blooming
  useEffect(() => {
    if (flowerStage !== 4) return;

    // Multi-colored celebratory fireworks bursts using canvas-confetti
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const colors = ["#f43f5e", "#ec4899", "#fbbf24", "#a855f7", "#3b82f6", "#10b981", "#ffffff"];

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        setFireworksSettled(true);
        return;
      }

      const particleCount = 40 * (timeLeft / duration);

      // Left burst
      confetti({
        particleCount,
        angle: 60,
        spread: 70,
        origin: { x: 0.1, y: 0.6 },
        colors,
      });
      // Right burst
      confetti({
        particleCount,
        angle: 120,
        spread: 70,
        origin: { x: 0.9, y: 0.6 },
        colors,
      });
      // Center burst
      confetti({
        particleCount: particleCount * 0.8,
        angle: 90,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors,
      });
    }, 250);

    return () => clearInterval(interval);
  }, [flowerStage]);

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
          {messagesFinished ? "💐 ĐÓA HOA TỎA SÁNG" : "📖 LẬT THẺ THÔNG ĐIỆP"}
        </span>
      </div>

      {/* Center Section: Mini Flip Card OR Large Centered Bouquet */}
      <div className="z-10 my-auto flex flex-col items-center justify-center w-full max-w-xs mx-auto">
        {!messagesFinished ? (
          <div className="flex flex-col items-center w-full gap-4">
            {/* Interactive Mini Flip Card - Plain text with realistic 3D page flip */}
            <div className="w-full [perspective:1000px] flex justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  onClick={handleCardFlip}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  initial={{ rotateY: -90, scale: 0.9, opacity: 0 }}
                  animate={{ rotateY: 0, scale: 1, opacity: 1 }}
                  exit={{ rotateY: 90, scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.25, 0.8, 0.25, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="w-full min-h-[200px] bg-gradient-to-br from-rose-900/90 via-purple-900/90 to-slate-900/90 backdrop-blur-xl border-2 border-pink-400/40 rounded-2xl p-6 shadow-2xl cursor-pointer flex flex-col justify-between relative overflow-hidden select-none text-center"
                >
                  {/* Decorative Corner Stars */}
                  <div className="absolute top-2.5 left-3 text-amber-300 text-xs">✨</div>
                  <div className="absolute top-2.5 right-3 text-pink-300 text-xs">🌸</div>
                  <div className="absolute bottom-2.5 right-3 text-amber-200 text-xs">✨</div>
                  <div className="absolute bottom-2.5 left-3 text-pink-300 text-xs">💖</div>

                  <p className="text-sm sm:text-base font-medium text-pink-100 leading-relaxed my-auto text-glow py-4">
                    {messages[currentPage]}
                  </p>

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
              </AnimatePresence>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {messages.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentPage ? "w-6 bg-pink-400" : "w-2 bg-pink-900/60"
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
            transition={{ duration: 1.2, ease: "easeOut" }}
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
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="text-7xl sm:text-8xl z-20 absolute filter drop-shadow-[0_0_25px_rgba(244,63,94,0.9)] select-none"
              >
                🌺
              </motion.span>

              {/* Side Flowers blooming sequentially around center bouquet */}
              {flowerStage >= 2 && (
                <motion.span
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ scale: 1, x: -55, y: -30, rotate: -22 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="text-5xl sm:text-6xl absolute z-10 select-none"
                >
                  🌸
                </motion.span>
              )}
              {flowerStage >= 2 && (
                <motion.span
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ scale: 1, x: 55, y: -30, rotate: 22 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="text-5xl sm:text-6xl absolute z-10 select-none"
                >
                  🌷
                </motion.span>
              )}
              {flowerStage >= 3 && (
                <motion.span
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ scale: 1, x: -45, y: 38, rotate: -35 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="text-4xl sm:text-5xl absolute z-10 select-none"
                >
                  🌹
                </motion.span>
              )}
              {flowerStage >= 3 && (
                <motion.span
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ scale: 1, x: 45, y: 38, rotate: 35 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
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
              {flowerStage < 4 ? "Đóa hoa đang từ từ nở rộ… 🌸" : "Bó hoa tươi thắm rực rỡ tỏa ngát hương! 💐"}
            </p>
          </motion.div>
        )}
      </div>

      {/* Bottom Action Button: "Xem Thiệp Lời Chúc ✉️ →" */}
      <div className="z-10 pb-4 h-16 flex items-end w-full max-w-xs mx-auto">
        {messagesFinished && flowerStage >= 4 && fireworksSettled && (
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
// STAGE 3: Unfolding Greeting Card with Wax Seal "Mở" & Typewriter Wish Text
// ─────────────────────────────────────────────
function Stage3GreetingCard({ student, onNextStage }) {
  const [isOpen, setIsOpen] = useState(false);
  const rawWishText = student?.wish || student?.quote || student?.wishes?.[0]?.text || FALLBACK.quote;
  const wishText = useMemo(() => (typeof rawWishText === "string" ? rawWishText.normalize("NFC") : rawWishText), [rawWishText]);
  const [displayedText, setDisplayedText] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);

  // Unfold envelope / card handler
  const handleOpenCard = () => {
    if (isOpen) return;
    setIsOpen(true);
  };

  // Graceful typewriter effect starting smoothly after card opens
  useEffect(() => {
    if (!isOpen) return;
    let interval;
    let index = 0;

    setDisplayedText("");
    setTypingComplete(false);

    const startTimeout = setTimeout(() => {
      interval = setInterval(() => {
        if (index < wishText.length) {
          setDisplayedText(wishText.slice(0, index + 1));
          index++;
        } else {
          setTypingComplete(true);
          clearInterval(interval);
        }
      }, 70);
    }, 300);

    return () => {
      clearTimeout(startTimeout);
      if (interval) clearInterval(interval);
    };
  }, [isOpen, wishText]);

  return (
    <motion.div
      key="stage-3"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 z-20 flex flex-col justify-between items-center p-6 bg-gradient-to-b from-slate-950 via-rose-950 to-purple-950 text-white overflow-hidden"
    >
      <AmbientParticles />

      {/* Header */}
      <div className="z-10 text-center pt-2 shrink-0">
        <span className="text-pink-300 text-[10px] font-bold tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full border border-pink-300/30">
          💌 THIỆP CHÚC MƯỜNG 20/10
        </span>
      </div>

      {/* Main Envelope & Card Opening Animation Container */}
      <div className="z-10 my-auto w-full max-w-xs flex flex-col items-center [perspective:1000px]">
        {!isOpen ? (
          /* Sealed Envelope with Wax Seal "Mở" */
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.4 } }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onClick={handleOpenCard}
            className="w-full h-72 rounded-3xl bg-gradient-to-br from-rose-900 via-purple-900 to-slate-900 border-2 border-pink-400/40 p-6 shadow-2xl flex flex-col items-center justify-between relative cursor-pointer group overflow-hidden select-none"
          >
            {/* Top Triangular Flap visual */}
            <div
              className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-pink-500/20 to-transparent pointer-events-none"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
            />

            {/* Corner Decorative Accents */}
            <div className="absolute top-3 left-4 text-pink-300 text-sm">🌸</div>
            <div className="absolute top-3 right-4 text-amber-300 text-sm">✨</div>
            <div className="absolute bottom-3 left-4 text-amber-200 text-sm">✨</div>
            <div className="absolute bottom-3 right-4 text-pink-300 text-sm">💖</div>

            {/* Recipient Title */}
            <div className="text-center pt-3 z-10">
              <p className="text-xs font-bold text-pink-300 uppercase tracking-widest">
                GỬI TỚI
              </p>
              <h3 className="text-xl font-black text-amber-200 mt-1">
                {student?.name || FALLBACK.name}
              </h3>
            </div>

            {/* Wax Seal "Mở" Button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative my-auto cursor-pointer z-10"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-600 to-red-800 border-4 border-amber-300/80 shadow-2xl flex items-center justify-center wax-seal-glow">
                <span className="text-amber-100 font-black text-lg tracking-wider drop-shadow-md">
                  Mở
                </span>
              </div>
            </motion.div>

            <p className="text-[11px] text-pink-200/80 font-medium tracking-wide pb-1 z-10">
              Chạm vào dấu sáp để mở thiệp ✨
            </p>
          </motion.div>
        ) : (
          /* Smooth Scale-Up & Slide-Up Entrance Greeting Card Animation */
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.88 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ transformOrigin: "bottom center" }}
            className="w-full min-h-[310px] rounded-3xl bg-amber-50 text-slate-800 border-4 border-pink-300/80 p-6 shadow-2xl flex flex-col justify-between relative select-none"
          >
            {/* Unfolding top edge ribbon shine */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="absolute -top-1 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent rounded-full"
            />

            {/* Card Top Stamp Header */}
            <div className="flex justify-between items-center border-b border-pink-200 pb-3 mb-3">
              <span className="text-xs font-bold text-rose-600 tracking-wider">
                🌸 20/10 SPECIAL WISH
              </span>
              <span className="text-[10px] bg-rose-100 text-rose-700 font-extrabold px-2 py-0.5 rounded-full border border-rose-300">
                FOR YOU
              </span>
            </div>

            {/* Personalized Typewriter Text with full Vietnamese serif support */}
            <div className="my-auto py-2">
              <p
                className="text-sm sm:text-base font-semibold leading-relaxed text-slate-800 italic min-h-[80px]"
                style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', Times, serif" }}
              >
                {displayedText}
                {!typingComplete && <span className="typing-cursor ml-0.5 font-sans not-italic">|</span>}
              </p>
            </div>

            {/* Sender Sign-off */}
            <div className="pt-3 border-t border-pink-200 text-right">
              <p className="text-xs font-bold text-rose-700">
                — With Love & Admiration 💖
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Button to Stage 4 (Honor Visa Card) - Appears ONLY after typewriter finishes */}
      <div className="z-10 pb-4 h-16 flex items-end w-full max-w-xs shrink-0">
        <AnimatePresence>
          {isOpen && typingComplete && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
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
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// STAGE 4: Honor Visa Card Redesign (White Lined Paper & Green Accent)
// ─────────────────────────────────────────────
function Stage4HonorVisaCard({ student, onRestart }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  const studentData = student || FALLBACK;
  const stickers = studentData.stickers && studentData.stickers.length > 0 ? studentData.stickers : FALLBACK.stickers;
  const wishesList = studentData.wishes && studentData.wishes.length > 0 ? studentData.wishes : FALLBACK.wishes;

  // Staggered framer-motion animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.18,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const stampVariants = {
    hidden: { opacity: 0, scale: 2.2, rotate: -35 },
    visible: {
      opacity: 0.95,
      scale: 1,
      rotate: -12,
      transition: { delay: 1.1, duration: 0.5, type: "spring", stiffness: 220, damping: 15 },
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
        avatarSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(studentData.name || "Hoa")}&background=e11d48&color=fff&size=256`;
      }

      const imgEl = cardRef.current.querySelector("img");
      const originalSrc = imgEl ? imgEl.src : null;
      if (imgEl) imgEl.src = avatarSrc;

      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: "#ffffff",
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      });

      if (imgEl && originalSrc) imgEl.src = originalSrc;

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `Visa-Vinh-Danh-${(studentData.name || "Hoa").replace(/\s+/g, "-")}.png`;
      link.click();
      setDone(true);
      setTimeout(() => setDone(false), 3000);

      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#f43f5e", "#fbbf24", "#ec4899", "#a855f7"],
      });
    } catch (err) {
      console.error("html2canvas download error:", err);
      alert("Không thể tải ảnh. Vui lòng thử lại!");
    } finally {
      setDownloading(false);
    }
  }, [studentData, downloading]);

  return (
    <motion.div
      key="stage-4"
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

      {/* Visa Passport / Boarding Pass Card - Clean Solid White Paper Look with Lined Notebook Effect */}
      <motion.div
        ref={cardRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full aspect-[9/16] max-h-[65vh] rounded-3xl p-6 bg-white text-slate-800 border-2 border-slate-300 shadow-2xl flex flex-col justify-between relative overflow-hidden text-center mx-auto my-auto z-10"
        style={{
          backgroundImage: "linear-gradient(to bottom, transparent 23px, #e2e8f0 24px)",
          backgroundSize: "100% 24px",
        }}
      >
        {/* Large Handmade Scrapbook Stickers Placed Along Outer Margins & Empty Negative Spaces (No Overlapping) */}
        <motion.div
          variants={itemVariants}
          className="absolute top-2 left-2 text-2xl sm:text-3xl filter drop-shadow-md bg-white p-1.5 rounded-full border-2 border-slate-200 select-none z-20 rotate-[-12deg]"
        >
          {stickers[0] || "🌸"}
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="absolute top-2 right-2 text-2xl sm:text-3xl filter drop-shadow-md bg-white p-1.5 rounded-full border-2 border-slate-200 select-none z-20 rotate-[15deg]"
        >
          {stickers[1] || "✨"}
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="absolute top-28 left-2 text-2xl sm:text-3xl filter drop-shadow-md bg-white p-1.5 rounded-full border-2 border-slate-200 select-none z-20 rotate-[-8deg]"
        >
          {stickers[2] || "👑"}
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="absolute top-28 right-2 text-2xl sm:text-3xl filter drop-shadow-md bg-white p-1.5 rounded-full border-2 border-slate-200 select-none z-20 rotate-[12deg]"
        >
          {stickers[4] || "🎓"}
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="absolute bottom-16 left-3 text-2xl sm:text-3xl filter drop-shadow-md bg-white p-1.5 rounded-full border-2 border-slate-200 select-none z-20 rotate-[-15deg]"
        >
          {stickers[3] || "💖"}
        </motion.div>

        {/* Boarding Pass Top Header Accent */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center text-[10px] tracking-widest uppercase font-extrabold text-slate-700 z-10 border-b-2 border-slate-300 pb-2.5 px-7 bg-white/90 backdrop-blur-xs rounded-t-xl"
        >
          <div className="flex items-center gap-1.5 text-rose-600 font-bold">
            <span className="text-sm">✈️</span>
            <span>20-10 OFFICIAL VISA</span>
          </div>
          <div className="bg-rose-600 text-white font-black px-2.5 py-0.5 rounded-md text-[9px] tracking-wider shadow-xs">
            CLASS: VIP
          </div>
        </motion.div>

        {/* Passport Main Section (Avatar, Name, Traits, Wishes) */}
        <div className="flex flex-col items-center justify-center gap-2 my-auto z-10 px-4">
          {/* Main Student Avatar Photo */}
          <motion.div variants={itemVariants} className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-rose-500 p-1 bg-white shadow-lg mx-auto overflow-hidden shrink-0">
              <img
                src={studentData.avatar_url || FALLBACK.avatar_url}
                alt={studentData.name}
                className="w-full h-full object-cover rounded-xl"
                crossOrigin="anonymous"
                onError={e => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(studentData.name || "Hoa")}&background=e11d48&color=fff&size=256`;
                }}
              />
            </div>
          </motion.div>

          {/* Student Name */}
          <motion.h2 variants={itemVariants} className="text-lg sm:text-xl font-black text-slate-900 leading-tight drop-shadow-xs mt-1">
            {studentData.name || FALLBACK.name}
          </motion.h2>

          {/* Individual Traits Badge */}
          <motion.div variants={itemVariants} className="bg-rose-100 border border-rose-300 rounded-full px-3 py-0.5 text-[10px] font-extrabold tracking-wider uppercase text-rose-800 shrink-0 shadow-xs">
            {studentData.vibe || studentData.title || FALLBACK.vibe}
          </motion.div>

          {/* General Class Wishes Box */}
          <motion.div variants={itemVariants} className="bg-rose-50/90 border border-rose-200 rounded-xl p-2.5 max-w-[240px] w-full text-center mt-1 shadow-sm">
            <p className="text-[9px] uppercase font-black text-rose-700 tracking-wider mb-1 flex items-center justify-center gap-1">
              <span>💌</span> LỜI CHÚC TỪ TẬP THỂ
            </p>
            <p className="text-[10px] text-slate-700 font-medium leading-relaxed italic line-clamp-2">
              "{wishesList[0]?.text || studentData.quote || FALLBACK.quote}"
            </p>
          </motion.div>
        </div>

        {/* Circular Red/Navy Departure Stamp Effect ("CÔ GÁI CỦA NĂM") */}
        <motion.div
          variants={stampVariants}
          className="absolute bottom-12 right-2 z-20 pointer-events-none"
        >
          <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-full border-2 border-dashed border-rose-600 text-rose-700 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center p-1 text-center shadow-lg rotate-[-12deg]">
            <span className="text-[7px] font-black uppercase tracking-widest text-slate-600">★ APPROVED ★</span>
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-rose-600 leading-tight my-0.5 drop-shadow-xs">
              CÔ GÁI<br />CỦA NĂM
            </span>
            <span className="text-[7px] font-bold text-slate-600">20/10 VISA</span>
          </div>
        </motion.div>

        {/* Distinct Green Accent Bar & Barcode Footer */}
        <motion.div variants={itemVariants} className="pt-1.5 border-t-2 border-slate-300 text-center z-10 bg-white/95 rounded-b-xl">
          {/* Distinct Green Accent Bar */}
          <div className="w-full h-2 bg-emerald-600 rounded-xs mb-1.5" />

          <div className="flex justify-between items-center text-[8px] text-slate-600 font-mono font-bold tracking-wider mb-1">
            <span>PASSPORT NO: 20-10-2026</span>
            <span>GATE: LOVE-01</span>
          </div>
          <div className="w-full h-4 bg-slate-100 rounded flex items-center justify-center gap-1 overflow-hidden border border-slate-200">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className="h-full bg-slate-900"
                style={{ width: `${(i % 3) * 2 + 1}px`, opacity: i % 2 === 0 ? 1 : 0.4 }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Actions: html2canvas PNG download button & restart button */}
      <div className="w-full max-w-xs flex flex-col gap-2 z-10 pb-2 shrink-0">
        <motion.button
          onClick={handleDownload}
          disabled={downloading}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs text-white transition-all cursor-pointer shadow-lg"
          style={{
            background: done
              ? "linear-gradient(135deg, #16a34a, #15803d)"
              : "linear-gradient(135deg, #e11d48, #be123c)",
            opacity: downloading ? 0.7 : 1,
          }}
        >
          {downloading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                ⏳
              </motion.span>
              Đang tạo Visa Vinh Danh…
            </>
          ) : done ? (
            <>✅ Đã tải Visa Vinh Danh (.png)!</>
          ) : (
            <>
              📥 Tải ảnh Visa Vinh Danh (.png)
            </>
          )}
        </motion.button>

        <motion.button
          onClick={onRestart}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs text-pink-200 bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all"
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
  const [currentStage, setCurrentStage] = useState(1); // Stages 1, 2, 3, 4

  useEffect(() => {
    async function fetchStudent() {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id") || "demo";

      if (supabase) {
        try {
          const { data, error } = await supabase
            .from("students")
            .select("*")
            .eq("id", id)
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
    setCurrentStage(prev => Math.min(4, prev + 1));
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
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
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
              <Stage3GreetingCard
                student={student}
                onNextStage={handleNextStage}
              />
            )}

            {currentStage === 4 && (
              <Stage4HonorVisaCard
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
