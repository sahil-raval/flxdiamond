import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  type Variants,
} from "framer-motion";

const CUBIC: [number, number, number, number] = [0.76, 0, 0.24, 1];

/* ─── LineMask ─────────────────────────────────────────────────────────────
   The pieterkoopt.nl signature: content lives inside overflow:hidden and
   slides up from 100% → 0% on scroll-enter. One div = one masked line.     */
interface LineMaskProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}
export function LineMask({
  children,
  delay = 0,
  duration = 0.9,
  className = "",
  once = true,
}: LineMaskProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, {
    once,
    margin: "-60px",
  });
  return (
    <div
      ref={ref}
      className={className}
      style={{ overflow: "hidden", display: "block" }}
    >
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={inView ? { y: "0%", opacity: 1 } : {}}
        transition={{ duration, ease: CUBIC, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─── ScrollReveal ──────────────────────────────────────────────────────────
   Fade + directional slide for blocks/cards. Default y:64px for drama.      */
type Direction = "up" | "down" | "left" | "right";
interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: Direction;
  distance?: number;
  className?: string;
  once?: boolean;
}
export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.85,
  direction = "up",
  distance = 64,
  className = "",
  once = true,
}: ScrollRevealProps) {
  const hidden: { opacity: number; x?: number; y?: number } = { opacity: 0 };
  if (direction === "up")    hidden.y =  distance;
  if (direction === "down")  hidden.y = -distance;
  if (direction === "left")  hidden.x =  distance;
  if (direction === "right") hidden.x = -distance;

  const visible = { opacity: 1, x: 0, y: 0 };

  return (
    <motion.div
      initial={hidden}
      whileInView={visible}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration, ease: CUBIC, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── StaggerGroup ──────────────────────────────────────────────────────────
   Parent that orchestrates staggered children. Wrap your grid then use
   <StaggerItem> for each child.                                              */
const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const staggerChild: Variants = {
  hidden: { opacity: 0, y: 56 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: CUBIC },
  },
};

interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}
export function StaggerGroup({
  children,
  className = "",
  stagger = 0.1,
  delay = 0.05,
}: StaggerGroupProps) {
  const variants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerChild} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── ParallaxLayer ─────────────────────────────────────────────────────────
   Wraps an element and moves it at `speed` fraction of scroll progress as
   the section passes through the viewport.                                   */
interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}
export function ParallaxLayer({
  children,
  speed = 0.25,
  className = "",
  style,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const range = speed * 100;
  const rawY = useTransform(scrollYProgress, [0, 1], [`${range}px`, `-${range}px`]);
  const y = useSpring(rawY, { stiffness: 60, damping: 20 });

  return (
    <motion.div ref={ref} style={{ y, ...style }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── Marquee ───────────────────────────────────────────────────────────────
   Infinite horizontal ticker. Renders children twice for a seamless loop.   */
interface MarqueeProps {
  children: React.ReactNode;
  duration?: number;
  gap?: number;
  className?: string;
  pauseOnHover?: boolean;
  reverse?: boolean;
}
export function Marquee({
  children,
  duration = 36,
  gap = 48,
  className = "",
  pauseOnHover = false,
  reverse = false,
}: MarqueeProps) {
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}
    >
      <div
        style={{
          display: "flex",
          width: "max-content",
          gap,
          animationName: "flx-marquee",
          animationDuration: `${duration}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDirection: reverse ? "reverse" : "normal",
        }}
        className={pauseOnHover ? "marquee-pause-hover" : ""}
      >
        {/* Two copies for seamless loop */}
        <div style={{ display: "flex", gap, flexShrink: 0 }}>{children}</div>
        <div style={{ display: "flex", gap, flexShrink: 0 }} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── SectionReveal ─────────────────────────────────────────────────────────
   Full-section clip reveal: clip-path shrinks vertically as section enters.  */
interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}
export function SectionReveal({
  children,
  className = "",
  style,
  delay = 0,
}: SectionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, clipPath: "inset(6% 0% 6% 0%)" }}
      whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.05, ease: CUBIC, delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
