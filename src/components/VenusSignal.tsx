import { motion } from "framer-motion";

const VenusSignal = () => {
  return (
    <div className="absolute top-[6%] left-1/2 -translate-x-1/2 z-[5] pointer-events-none">
      {/* Ambient bloom */}
      <div className="absolute inset-0 -m-20 rounded-full bg-primary/10 blur-3xl" />

      <motion.svg
        width="160"
        height="280"
        viewBox="0 0 160 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_0_20px_hsl(43,96%,56%)]"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Outer halo */}
        <circle cx="80" cy="80" r="70" stroke="hsl(43,96%,56%)" strokeWidth="1" opacity="0.2" />

        {/* Venus circle */}
        <circle cx="80" cy="80" r="55" stroke="hsl(43,96%,56%)" strokeWidth="5" fill="none" />

        {/* Vertical stem */}
        <line x1="80" y1="135" x2="80" y2="240" stroke="hsl(43,96%,56%)" strokeWidth="5" strokeLinecap="round" />

        {/* Horizontal crossbar */}
        <line x1="48" y1="195" x2="112" y2="195" stroke="hsl(43,96%,56%)" strokeWidth="5" strokeLinecap="round" />
      </motion.svg>
    </div>
  );
};

export default VenusSignal;
