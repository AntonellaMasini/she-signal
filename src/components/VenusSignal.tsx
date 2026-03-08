import { motion } from "framer-motion";

const VenusSignal = () => {
  return (
    <div className="absolute top-[8%] left-1/2 -translate-x-1/2 z-[5] pointer-events-none">
      {/* Bloom / haze layers */}
      <div className="absolute inset-0 -m-16 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute inset-0 -m-10 rounded-full bg-signal-amber/8 blur-2xl" />

      <motion.svg
        width="180"
        height="260"
        viewBox="0 0 180 260"
        fill="none"
        className="relative z-10 drop-shadow-[0_0_40px_hsl(43,96%,56%,0.5)]"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Outer glow circle */}
        <circle cx="90" cy="80" r="62" stroke="hsl(43, 96%, 56%)" strokeWidth="2.5" opacity="0.15" />
        {/* Main circle */}
        <circle
          cx="90"
          cy="80"
          r="50"
          stroke="hsl(43, 96%, 56%)"
          strokeWidth="4.5"
          fill="none"
          filter="url(#venusGlow)"
        />
        {/* Vertical line extending down from circle */}
        <line
          x1="90" y1="130" x2="90" y2="210"
          stroke="hsl(43, 96%, 56%)"
          strokeWidth="4.5"
          strokeLinecap="round"
          filter="url(#venusGlow)"
        />
        {/* Horizontal cross bar */}
        <line
          x1="58" y1="175" x2="122" y2="175"
          stroke="hsl(43, 96%, 56%)"
          strokeWidth="4.5"
          strokeLinecap="round"
          filter="url(#venusGlow)"
        />
        <defs>
          <filter id="venusGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </motion.svg>
    </div>
  );
};

export default VenusSignal;
