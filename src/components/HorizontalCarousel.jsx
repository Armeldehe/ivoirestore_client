import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

/**
 * HorizontalCarousel — Premium horizontal scrolling carousel
 *
 * Features:
 * - Mouse drag scroll with inertia
 * - Touch swipe (mobile)
 * - Mouse wheel horizontal scroll
 * - Navigation arrows (futuristic design)
 * - Auto-scroll with pause on hover
 * - Snap scrolling
 * - Invisible scrollbar
 * - Progressive reveal animations
 *
 * Props:
 * - children: React nodes (cards)
 * - autoScrollSpeed: ms interval (default 4000)
 * - itemWidth: CSS class override for item width
 */
export default function HorizontalCarousel({
  children,
  autoScrollSpeed = 4000,
  className = "",
}) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const dragState = useRef({
    startX: 0,
    scrollLeft: 0,
    velocity: 0,
    lastX: 0,
    lastTime: 0,
  });
  const autoScrollRef = useRef(null);
  const rafRef = useRef(null);

  // ── Check scroll bounds ──
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState, children]);

  // ── Arrow navigation ──
  const scrollBy = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  // ── Mouse wheel → horizontal scroll ──
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  // ── Mouse drag with inertia ──
  const onPointerDown = (e) => {
    if (e.pointerType === "touch") return; // let touch scroll handle it
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    el.setPointerCapture(e.pointerId);
    dragState.current = {
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      velocity: 0,
      lastX: e.clientX,
      lastTime: Date.now(),
    };
  };

  const onPointerMove = (e) => {
    if (!isDragging || e.pointerType === "touch") return;
    const el = scrollRef.current;
    if (!el) return;
    const dx = e.clientX - dragState.current.startX;
    el.scrollLeft = dragState.current.scrollLeft - dx;
    // track velocity
    const now = Date.now();
    const dt = now - dragState.current.lastTime;
    if (dt > 0) {
      dragState.current.velocity = (e.clientX - dragState.current.lastX) / dt;
    }
    dragState.current.lastX = e.clientX;
    dragState.current.lastTime = now;
  };

  const onPointerUp = (e) => {
    if (!isDragging || e.pointerType === "touch") return;
    setIsDragging(false);
    const el = scrollRef.current;
    if (!el) return;
    el.releasePointerCapture(e.pointerId);
    // apply inertia
    let velocity = -dragState.current.velocity * 800;
    const decay = () => {
      if (Math.abs(velocity) < 0.5) return;
      el.scrollLeft += velocity * 0.016;
      velocity *= 0.95;
      rafRef.current = requestAnimationFrame(decay);
    };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(decay);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Auto-scroll ──
  useEffect(() => {
    if (isHovering || isDragging) {
      clearInterval(autoScrollRef.current);
      return;
    }
    autoScrollRef.current = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, autoScrollSpeed);
    return () => clearInterval(autoScrollRef.current);
  }, [isHovering, isDragging, autoScrollSpeed]);

  return (
    <div
      className={`relative group/carousel ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Scroll container */}
      <div
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => setIsDragging(false)}
        className={`flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory ${
          isDragging ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Left edge fade */}
        <div className="shrink-0 w-0" />
        {Array.isArray(children)
          ? children.map((child, i) => (
              <div
                key={i}
                className="shrink-0 snap-start"
                style={{ width: "clamp(260px, 28vw, 320px)" }}
              >
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {child}
                </motion.div>
              </div>
            ))
          : children}
        <div className="shrink-0 w-4" />
      </div>

      {/* Hide webkit scrollbar via CSS */}
      <style>{`
        div[class*="overflow-x-auto"]::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── Navigation arrows ── */}
      {canScrollLeft && (
        <motion.button
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          onClick={() => scrollBy(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-11 h-11 bg-white/[0.07] hover:bg-orange-500/20 border border-white/[0.12] hover:border-orange-500/40 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:text-orange-400 transition-all duration-300 shadow-xl shadow-black/20 opacity-0 group-hover/carousel:opacity-100"
          aria-label="Défiler à gauche"
        >
          <HiChevronLeft className="w-5 h-5" />
        </motion.button>
      )}
      {canScrollRight && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          onClick={() => scrollBy(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-11 h-11 bg-white/[0.07] hover:bg-orange-500/20 border border-white/[0.12] hover:border-orange-500/40 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:text-orange-400 transition-all duration-300 shadow-xl shadow-black/20 opacity-0 group-hover/carousel:opacity-100"
          aria-label="Défiler à droite"
        >
          <HiChevronRight className="w-5 h-5" />
        </motion.button>
      )}

      {/* Edge gradient fades */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-4 w-16 bg-gradient-to-r from-navy-950 to-transparent pointer-events-none z-[1]" />
      )}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-navy-950 to-transparent pointer-events-none z-[1]" />
      )}
    </div>
  );
}
