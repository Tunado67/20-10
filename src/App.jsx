import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import bgImage from "./assets/IMG_20261018_222005.jpg";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const DEFAULT_STUDENT = {
  id: "1",
  name: "Bạn",
  wish: "Chúc bạn luôn tươi trẻ, rạng rỡ, tự tin và thành công trên con đường đã chọn!",
  avatar_url: "",
  title: "NĂNG ĐỘNG & TỎA SÁNG"
};

// ─────────────────────────────────────────────
// Constants & Sequential Messages
// ─────────────────────────────────────────────
const DEFAULT_NAME = "Bạn";
const DEFAULT_WISH = "Chúc bạn luôn tươi trẻ, rạng rỡ, tự tin và thành công trên con đường đã chọn!";
const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><rect width='100%' height='100%' fill='%23e11d48'/><text x='50%' y='55%' dominant-baseline='central' text-anchor='middle' fill='%23ffffff' font-size='110' font-family='sans-serif'>👩</text></svg>";

const DEFAULT_STICKERS = ["🌸", "✨", "👑", "💖", "🎓", "🌺"];

const SEQUENTIAL_MESSAGES = [
  "Chúc các bạn nữ lớp 12¹",
  "Ngày phụ nữ Việt Nam 20/10",
  "Luôn xinh đẹp, tràn ngập niềm vui",
  "Tự tin toả sáng theo cách riêng của mình"
].map(m => m.normalize("NFC"));

// ─────────────────────────────────────────────
// Floating Ambient Particles Component (Reduced for Elegance)
// ─────────────────────────────────────────────
const BACKGROUND_EMOJIS = ["✨", "🌸", "💖", "✨"];

function AmbientParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        emoji: BACKGROUND_EMOJIS[i % BACKGROUND_EMOJIS.length],
        left: `${(i * 16 + 8) % 88}%`,
        delay: `${(i * 0.7) % 3}s`,
        duration: `${7 + (i * 1.2) % 4}s`,
        size: `${0.7 + (i * 0.1) % 0.4}rem`,
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
// STAGE 1: Enchanted Glass Rose (Press & Hold to Unlock)
// ─────────────────────────────────────────────
function Stage1EnchantedRose({ onRoseTap }) {
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 1
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const holdIntervalRef = useRef(null);
  const holdStartTimeRef = useRef(null);
  const justUnlockedRef = useRef(false);

  const HOLD_DURATION = 1500; // 1.5 seconds required hold time

  const startHolding = useCallback(() => {
    if (isUnlocked) return;
    holdStartTimeRef.current = Date.now();
    justUnlockedRef.current = false;

    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartTimeRef.current;
      const progress = Math.min(1, elapsed / HOLD_DURATION);
      setHoldProgress(progress);

      if (progress >= 1) {
        clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
        justUnlockedRef.current = true;
        setIsUnlocked(true);
      }
    }, 30);
  }, [isUnlocked]);

  const stopHolding = useCallback(() => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    if (!isUnlocked) {
      setHoldProgress(0);
    }
  }, [isUnlocked]);

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  const handleTapToProceed = () => {
    if (!isUnlocked || flashing || justUnlockedRef.current) return;
    setFlashing(true);
    setTimeout(() => {
      onRoseTap();
    }, 500);
  };

  const handleMouseUp = () => {
    stopHolding();
    if (justUnlockedRef.current) {
      setTimeout(() => {
        justUnlockedRef.current = false;
      }, 300);
    }
  };

  return (
    <motion.div
      key="stage-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 1.8, ease: "easeInOut" }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-between py-12 px-6 bg-slate-950 text-white select-none overflow-hidden"
    >
      {/* Bloom Flash Overlay on Tap */}
      {flashing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.9] }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-white z-50 pointer-events-none"
        />
      )}

      {/* Very subtle Glimmer Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { top: "15%", left: "12%", delay: "0s" },
          { top: "25%", left: "82%", delay: "0.8s" },
          { top: "70%", left: "18%", delay: "1.4s" },
          { top: "78%", left: "80%", delay: "0.4s" },
        ].map((p, i) => (
          <div
            key={i}
            className="glimmer-particle text-amber-200/70"
            style={{
              top: p.top,
              left: p.left,
              animationDelay: p.delay,
              animationDuration: "4s",
              fontSize: "0.8rem",
            }}
          >
            ✨
          </div>
        ))}
      </div>

      <div className="h-6" />

      {/* Glass Dome & Glowing Rose with Hold-to-Unlock Interaction */}
      <motion.div
        onMouseDown={startHolding}
        onMouseUp={handleMouseUp}
        onMouseLeave={stopHolding}
        onTouchStart={startHolding}
        onTouchEnd={handleMouseUp}
        onTouchCancel={stopHolding}
        onClick={handleTapToProceed}
        whileTap={{ scale: 0.98 }}
        className="relative z-10 cursor-pointer my-auto flex flex-col items-center group touch-none glass-rose-container"
      >
        <div
          className="absolute w-64 h-80 rounded-full blur-3xl -z-10 transition-all duration-150"
          style={{
            backgroundColor: isUnlocked
              ? "rgba(244, 63, 94, 0.55)"
              : `rgba(225, 29, 72, ${0.1 + holdProgress * 0.45})`,
            transform: `scale(${1 + holdProgress * 0.2})`,
          }}
        />

        <div
          className="relative w-56 sm:w-64 h-80 sm:h-88 rounded-t-full rounded-b-3xl glass-dome flex flex-col items-center justify-end pb-8 px-4 border border-white/30 shadow-2xl overflow-hidden transition-all duration-300"
          style={{
            boxShadow: isUnlocked
              ? "0 0 50px rgba(244, 114, 182, 0.6), inset 0 0 30px rgba(255, 255, 255, 0.4)"
              : `0 0 ${15 + holdProgress * 30}px rgba(244, 114, 182, ${0.2 + holdProgress * 0.4})`,
          }}
        >
          <div className="absolute top-4 left-6 w-3 h-44 bg-gradient-to-b from-white/60 via-white/10 to-transparent rounded-full rotate-[-12deg] pointer-events-none" />
          <div className="absolute top-8 right-8 w-1.5 h-32 bg-gradient-to-b from-white/40 via-white/5 to-transparent rounded-full rotate-[8deg] pointer-events-none" />

          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute top-12 text-amber-300 text-xs pointer-events-none opacity-80"
          >
            ✨
          </motion.div>

          <div className="mb-3 text-center select-none transition-all duration-200">
            <span
              className="text-8xl sm:text-9xl block transition-all duration-200"
              style={{
                filter: isUnlocked
                  ? "drop-shadow(0 0 35px rgba(244, 63, 94, 1)) drop-shadow(0 0 50px rgba(236, 72, 153, 0.9))"
                  : `drop-shadow(0 0 ${8 + holdProgress * 25}px rgba(244, 63, 94, ${0.4 + holdProgress * 0.6}))`,
                transform: `scale(${1 + holdProgress * 0.08})`,
              }}
            >
              🌹
            </span>
          </div>

          <div className="flex gap-2 text-sm opacity-70 mt-1">
            <span className="rotate-[-25deg] transform translate-y-1">🥀</span>
            <span className="rotate-[15deg] transform translate-y-2">🌸</span>
            <span className="rotate-[-10deg] transform">🥀</span>
          </div>
        </div>

        <div className="w-64 sm:w-72 h-5 bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 rounded-lg shadow-2xl border-t border-amber-700/60 -mt-1 flex items-center justify-center">
          <div className="w-52 h-1 bg-amber-600/40 rounded-full" />
        </div>
      </motion.div>

      {/* Action Prompt Text */}
      <div className="z-10 text-center pb-6 flex flex-col items-center gap-2 min-h-[60px] justify-center">
        {isUnlocked ? (
          <p
            onClick={handleTapToProceed}
            className="text-glow text-base sm:text-lg font-extrabold text-pink-200 tracking-wide cursor-pointer transition-transform hover:scale-105"
          >
            Nhấn vào để mở ✨
          </p>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-semibold text-pink-200/90 tracking-wide">
              {holdProgress > 0 ? "Đang thắp sáng hoa hồng..." : "Nhấn & Giữ lồng kính ✨"}
            </p>
            <div className="w-36 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/20 mt-1">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-75"
                style={{ width: `${holdProgress * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// STAGE 2: Sequential Messages & Large Centered Blooming Bouquet
// ─────────────────────────────────────────────
function Stage2SequentialMessagesAndBouquet({ onNextStage }) {
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
  const [messagesFinished, setMessagesFinished] = useState(false);
  const [showBouquet, setShowBouquet] = useState(false);
  const [flowerStage, setFlowerStage] = useState(0);
  const [fireworksSettled, setFireworksSettled] = useState(false);

  useEffect(() => {
    if (messagesFinished) return;

    const timer = setTimeout(() => {
      if (currentMsgIndex < SEQUENTIAL_MESSAGES.length - 1) {
        setCurrentMsgIndex(prev => prev + 1);
      } else {
        setMessagesFinished(true);
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, [currentMsgIndex, messagesFinished]);

  const handleRevealBouquet = () => {
    setShowBouquet(true);
  };

  useEffect(() => {
    if (!showBouquet) return;
    const timers = [];
    timers.push(setTimeout(() => setFlowerStage(1), 500));
    timers.push(setTimeout(() => setFlowerStage(2), 1500));
    timers.push(setTimeout(() => setFlowerStage(3), 2500));
    timers.push(setTimeout(() => setFlowerStage(4), 3600));

    return () => timers.forEach(t => clearTimeout(t));
  }, [showBouquet]);

  useEffect(() => {
    if (flowerStage !== 4) return;

    const duration = 2200;
    const animationEnd = Date.now() + duration;
    const colors = ["#f43f5e", "#ec4899", "#fbbf24", "#a855f7", "#3b82f6", "#10b981", "#ffffff"];

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        setFireworksSettled(true);
        return;
      }

      const particleCount = 45 * (timeLeft / duration);

      confetti({
        particleCount,
        angle: 60,
        spread: 75,
        origin: { x: 0.1, y: 0.6 },
        colors,
      });
      confetti({
        particleCount,
        angle: 120,
        spread: 75,
        origin: { x: 0.9, y: 0.6 },
        colors,
      });
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
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 z-20 flex flex-col justify-between p-6 text-white overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] -z-10" />

      <AmbientParticles />

      <div className="h-6 shrink-0" />

      <div className="z-10 my-auto flex flex-col items-center justify-center w-full max-w-xs mx-auto">
        {!messagesFinished ? (
          <div className="w-full flex justify-center min-h-[160px] items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMsgIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-full text-center p-6 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-pink-300/30 shadow-2xl"
              >
                <p className="text-base sm:text-lg font-bold text-pink-100 leading-relaxed drop-shadow-md text-glow">
                  {SEQUENTIAL_MESSAGES[currentMsgIndex]}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : !showBouquet ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRevealBouquet}
              className="py-4 px-6 rounded-2xl font-extrabold text-base text-white shadow-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 border border-pink-300/50 cursor-pointer flex items-center gap-2"
            >
              <span>Mở đóa hoa rực rỡ 💐</span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center gap-4 my-auto w-full py-2"
          >
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
              <div className="absolute inset-0 bg-pink-500/25 blur-3xl rounded-full -z-10" />

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

            <p className="text-xs sm:text-sm font-bold text-pink-200 tracking-wide text-center drop-shadow-md">
              {flowerStage < 4 ? "Đóa hoa đang từ từ nở rộ… 🌸" : "Bó hoa tươi thắm rực rỡ tỏa ngát hương! 💐"}
            </p>
          </motion.div>
        )}
      </div>

      <div className="z-10 pb-4 h-16 flex items-end w-full max-w-xs mx-auto shrink-0">
        {showBouquet && flowerStage >= 4 && fireworksSettled && (
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
// STAGE 3: Unfolding Greeting Card with Wax Seal & Typewriter Wish Text
// ─────────────────────────────────────────────
function Stage3GreetingCard({ student, onNextStage }) {
  const [isOpen, setIsOpen] = useState(false);
  const name = student?.name || DEFAULT_NAME;
  const wish = (student?.wish || DEFAULT_WISH).normalize("NFC");
  const fullText = `Thân gửi ${name}\n\n${wish}`;

  const [typedCount, setTypedCount] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);

  const handleOpenCard = () => {
    if (isOpen) return;
    setTypedCount(0);
    setTypingComplete(false);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    let current = 0;

    const interval = setInterval(() => {
      current++;
      setTypedCount(current);
      if (current >= fullText.length) {
        setTypingComplete(true);
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [isOpen, fullText.length]);

  return (
    <motion.div
      key="stage-3"
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="absolute inset-0 z-20 flex flex-col justify-between items-center p-6 text-white overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] -z-10" />

      <AmbientParticles />

      <div className="h-6 shrink-0" />

      <div className="z-10 my-auto w-full max-w-xs flex flex-col items-center [perspective:1000px]">
        {!isOpen ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.4 } }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onClick={handleOpenCard}
            className="w-full h-72 rounded-3xl bg-slate-50 text-slate-800 border-2 border-slate-200/80 p-6 shadow-2xl flex flex-col items-center justify-between relative cursor-pointer group overflow-hidden select-none"
          >
            <div
              className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-rose-100/60 via-slate-100/40 to-transparent pointer-events-none border-b border-slate-200/50"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
            />

            <div className="absolute top-3 left-4 text-pink-500 text-sm">🌸</div>
            <div className="absolute top-3 right-4 text-amber-500 text-sm">✨</div>
            <div className="absolute bottom-3 left-4 text-amber-500 text-sm">✨</div>
            <div className="absolute bottom-3 right-4 text-pink-500 text-sm">💖</div>

            <div className="text-center pt-3 z-10">
              <p className="text-xs font-bold text-rose-600 uppercase tracking-widest">
                GỬI TỚI
              </p>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                {name}
              </h3>
            </div>

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

            <p className="text-[11px] text-slate-500 font-medium tracking-wide pb-1 z-10">
              Chạm vào dấu sáp để mở thiệp ✨
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: -50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full min-h-[310px] rounded-3xl bg-amber-50 text-slate-800 border-4 border-pink-300/80 p-6 sm:p-7 shadow-2xl flex flex-col justify-between relative select-none"
            style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', Times, serif" }}
          >
            <div className="my-auto py-2 flex flex-col justify-between h-full">
              <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-800 whitespace-pre-line">
                {fullText.slice(0, typedCount)}
                {!typingComplete && (
                  <span className="typing-cursor ml-0.5 font-sans not-italic">|</span>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </div>

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
// STAGE 4: Honor Visa Card
// ─────────────────────────────────────────────
function Stage4HonorVisaCard({ student, onRestart }) {
  const stickers = DEFAULT_STICKERS;
  const name = student?.name || DEFAULT_NAME;
  const avatarUrl = student?.avatar_url || DEFAULT_AVATAR;

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
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
      transition: { delay: 0.9, duration: 0.5, type: "spring", stiffness: 220, damping: 15 },
    },
  };

  return (
    <motion.div
      key="stage-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-20 flex flex-col justify-between items-center p-4 sm:p-5 text-white overflow-y-auto no-scrollbar bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] -z-10" />

      <AmbientParticles />

      <div className="h-4 shrink-0" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full aspect-[9/16] max-h-[65vh] rounded-3xl p-5 sm:p-6 bg-white text-slate-800 border-2 border-slate-300 shadow-2xl flex flex-col justify-between relative overflow-hidden text-center mx-auto my-auto z-10"
        style={{
          backgroundImage: "linear-gradient(to bottom, transparent 23px, #e2e8f0 24px)",
          backgroundSize: "100% 24px",
        }}
      >
        <motion.div
          variants={itemVariants}
          className="absolute top-2 left-2 text-2xl filter drop-shadow-md bg-white/90 p-1 rounded-full border border-slate-200 select-none z-20 rotate-[-12deg]"
        >
          {stickers[0] || "🌸"}
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="absolute top-2 right-2 text-2xl filter drop-shadow-md bg-white/90 p-1 rounded-full border border-slate-200 select-none z-20 rotate-[15deg]"
        >
          {stickers[1] || "✨"}
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="absolute top-28 left-2 text-2xl filter drop-shadow-md bg-white/90 p-1 rounded-full border border-slate-200 select-none z-20 rotate-[-8deg]"
        >
          {stickers[2] || "👑"}
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="absolute top-28 right-2 text-2xl filter drop-shadow-md bg-white/90 p-1 rounded-full border border-slate-200 select-none z-20 rotate-[12deg]"
        >
          {stickers[4] || "🎓"}
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="absolute bottom-16 left-3 text-2xl filter drop-shadow-md bg-white/90 p-1 rounded-full border border-slate-200 select-none z-20 rotate-[-15deg]"
        >
          {stickers[3] || "💖"}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center text-[10px] tracking-widest uppercase font-extrabold text-slate-700 z-10 border-b-2 border-slate-300 pb-2 px-6 bg-white/95 rounded-t-xl"
        >
          <div className="flex items-center gap-1.5 text-rose-600 font-bold">
            <span className="text-sm">✈️</span>
            <span>20-10 OFFICIAL VISA</span>
          </div>
          <div className="bg-rose-600 text-white font-black px-2 py-0.5 rounded text-[9px] tracking-wider shadow-xs">
            VIP
          </div>
        </motion.div>

        <div className="flex flex-col items-center justify-center gap-2 my-auto z-10 px-4">
          <motion.div variants={itemVariants} className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-rose-500 p-1 bg-white shadow-lg mx-auto overflow-hidden shrink-0">
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover rounded-xl"
                onError={e => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
            </div>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-lg sm:text-xl font-black text-slate-900 leading-tight drop-shadow-xs mt-0.5">
            {name}
          </motion.h2>

          <motion.div variants={itemVariants} className="bg-rose-100 border border-rose-300 rounded-full px-3 py-0.5 text-[10px] font-extrabold tracking-wider uppercase text-rose-800 shrink-0 shadow-xs">
            {student?.title || "NĂNG ĐỘNG & TỎA SÁNG"} ✨
          </motion.div>

          <motion.div variants={itemVariants} className="bg-rose-50/95 border border-rose-200 rounded-xl p-2 max-w-[240px] w-full text-center mt-0.5 shadow-sm">
            <p className="text-[9px] uppercase font-black text-rose-700 tracking-wider mb-0.5 flex items-center justify-center gap-1">
              <span>✨</span> LỜI CHÚC TỪ TẬP THỂ ✨
            </p>
            <p className="text-[10px] text-slate-700 font-medium leading-relaxed italic line-clamp-2">
              "Chúc bạn ngày 20/10 luôn tươi trẻ, tự tin, rạng rỡ và thành công!"
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={stampVariants}
          className="absolute bottom-12 right-2 z-20 pointer-events-none"
        >
          <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full border-2 border-dashed border-rose-600 text-rose-700 bg-white/95 flex flex-col items-center justify-center p-1 text-center shadow-lg rotate-[-12deg]">
            <span className="text-[6px] font-black uppercase tracking-widest text-slate-600">★ APPROVED ★</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 leading-tight my-0.5 drop-shadow-xs">
              CÔ GÁI<br />CỦA NĂM
            </span>
            <span className="text-[6px] font-bold text-slate-600">20/10 VISA</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-1 border-t-2 border-slate-300 text-center z-10 bg-white/95 rounded-b-xl">
          <div className="w-full h-2 bg-emerald-600 rounded-xs mb-1" />

          <div className="flex justify-between items-center text-[8px] text-slate-700 font-mono font-bold tracking-wider mb-1">
            <span>PASSPORT NO: 20-10-2026</span>
            <span>GATE: LOVE-01</span>
          </div>
          <div className="w-full h-3.5 bg-slate-100 rounded flex items-center justify-center gap-1 overflow-hidden border border-slate-200">
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

      <div className="w-full max-w-xs flex flex-col gap-2 z-10 pb-2 shrink-0">
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
  const [student, setStudent] = useState(DEFAULT_STUDENT);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStage, setCurrentStage] = useState(1);

  useEffect(() => {
    let isMounted = true;

    async function loadStudentData() {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlId = params.get('id') || '1';

        console.log("[DEBUG] Extracted URL id:", urlId);

        if (!supabase) {
          console.warn("[DEBUG] Supabase client missing env vars, using fallback.");
          if (isMounted) setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('students')
          .select('id, name, wish, avatar_url, title')
          .eq('id', String(urlId))
          .maybeSingle();

        if (error) {
          console.error("[DEBUG] Supabase query error:", error.message);
        }

        if (isMounted) {
          if (data) {
            console.log("[DEBUG] Successfully fetched student:", data);
            setStudent({
              ...DEFAULT_STUDENT,
              ...data,
              name: data.name || DEFAULT_STUDENT.name,
              wish: data.wish || DEFAULT_STUDENT.wish
            });
          } else {
            console.warn("[DEBUG] No student found for ID:", urlId);
          }
        }
      } catch (err) {
        console.error("[DEBUG] Unexpected runtime error during fetch:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadStudentData();

    return () => { isMounted = false; };
  }, []);

  const handleNextStage = () => {
    setCurrentStage(prev => Math.min(4, prev + 1));
  };

  const handleRestart = () => {
    setCurrentStage(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-rose-300 flex items-center justify-center font-sans">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Đang tải thiệp chúc mừng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md h-dvh mx-auto relative overflow-hidden bg-slate-950 text-white font-sans flex flex-col justify-between">
      <AnimatePresence mode="wait">
        {currentStage === 1 && (
          <Stage1EnchantedRose onRoseTap={handleNextStage} />
        )}

        {currentStage === 2 && (
          <Stage2SequentialMessagesAndBouquet
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
      </AnimatePresence>
    </div>
  );
}
