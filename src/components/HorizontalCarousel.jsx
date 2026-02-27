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
 * - Click-through: short taps navigate, drags scroll
 */

const DRAG_THRESHOLD = 5; // px — ignore drags smaller than this

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
    hasDragged: false, // true only if mouse moved beyond threshold
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
    // Do NOT setPointerCapture here — that would steal clicks from child Links.
    // We'll capture only after the drag threshold is exceeded.
    dragState.current = {
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      velocity: 0,
      lastX: e.clientX,
      lastTime: Date.now(),
      hasDragged: false,
      pointerId: e.pointerId,
      pointerActive: true,
    };
  };

  const onPointerMove = (e) => {
    if (!dragState.current.pointerActive || e.pointerType === "touch") return;
    const el = scrollRef.current;
    if (!el) return;
    const dx = e.clientX - dragState.current.startX;

    // Only start scrolling after threshold is crossed
    if (!dragState.current.hasDragged) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      dragState.current.hasDragged = true;
      setIsDragging(true);
      // NOW capture the pointer so we keep getting events even outside the element
      try {
        el.setPointerCapture(e.pointerId);
      } catch (_) {}
    }

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
    if (!dragState.current.pointerActive || e.pointerType === "touch") return;
    dragState.current.pointerActive = false;
    setIsDragging(false);
    const el = scrollRef.current;
    if (!el) return;
    try {
      el.releasePointerCapture(e.pointerId);
    } catch (_) {}

    // If we didn't actually drag, do nothing — the click naturally reaches child Links
    if (!dragState.current.hasDragged) return;

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

  // Block click events only when the user was actually dragging
  const onClickCapture = (e) => {
    if (dragState.current.hasDragged) {
      e.preventDefault();
      e.stopPropagation();
      // Reset so next click works normally
      dragState.current.hasDragged = false;
    }
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
        onPointerCancel={() => {
          dragState.current.pointerActive = false;
          setIsDragging(false);
        }}
        onClickCapture={onClickCapture}
        className={`flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory ${
          isDragging && dragState.current.hasDragged
            ? "cursor-grabbing select-none"
            : "cursor-grab"
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
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-11 h-11 backdrop-blur-xl rounded-full flex items-center justify-center transition-all duration-300 shadow-xl opacity-0 group-hover/carousel:opacity-100"
          style={{
            backgroundColor: "var(--bg-glass)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
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
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-11 h-11 backdrop-blur-xl rounded-full flex items-center justify-center transition-all duration-300 shadow-xl opacity-0 group-hover/carousel:opacity-100"
          style={{
            backgroundColor: "var(--bg-glass)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
          aria-label="Défiler à droite"
        >
          <HiChevronRight className="w-5 h-5" />
        </motion.button>
      )}

      {/* Edge gradient fades */}
      {canScrollLeft && (
        <div
          className="absolute left-0 top-0 bottom-4 w-16 pointer-events-none z-[1]"
          style={{
            background:
              "linear-gradient(to right, var(--bg-primary), transparent)",
          }}
        />
      )}
      {canScrollRight && (
        <div
          className="absolute right-0 top-0 bottom-4 w-16 pointer-events-none z-[1]"
          style={{
            background:
              "linear-gradient(to left, var(--bg-primary), transparent)",
          }}
        />
      )}
    </div>
  );
}
