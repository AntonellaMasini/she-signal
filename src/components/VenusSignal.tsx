import { motion } from "framer-motion";

const VenusSignal = () => {
  return (
    <div className="absolute top-[8%] left-1/2 -translate-x-1/2 z-[5] pointer-events-none">
      {/* Bloom / haze layers */}
      <div className="absolute inset-0 -m-16 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute inset-0 -m-10 rounded-full bg-signal-amber/8 blur-2xl" />

      <motion.svg
        width="160"
        height="220"
        viewBox="0 0 160 220"
        fill="none"
        className="relative z-10 drop-shadow-[0_0_40px_hsl(43,96%,56%,0.5)]"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Outer glow circle */}
        <circle cx="80" cy="70" r="58" stroke="hsl(43, 96%, 56%)" strokeWidth="3" opacity="0.15" />
        {/* Main circle */}
        <circle
          cx="80"
          cy="70"
          r="48"
          stroke="hsl(43, 96%, 56%)"
          strokeWidth="4"
          filter="url(#venusGlow)"
        />
        {/* Vertical line */}
        <line
          x1="80" y1="118" x2="80" y2="190"
          stroke="hsl(43, 96%, 56%)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#venusGlow)"
        />
        {/* Horizontal cross */}
        <line
          x1="55" y1="155" x2="105" y2="155"
          stroke="hsl(43, 96%, 56%)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#venusGlow)"
        />
        <defs>
          <filter id="venusGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </motion.svg>
    </div>
  );
};

export default VenusSignal;
