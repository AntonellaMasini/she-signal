import { motion } from "framer-motion";

interface SignalBeamProps {
  scanning?: boolean;
  className?: string;
}

const SignalBeam = ({ scanning = false, className = "" }: SignalBeamProps) => {
  return (
    <div className={`relative flex items-end justify-center ${className}`}>
      {/* Main beam */}
      <motion.div
        className="signal-beam w-32 origin-bottom"
        style={{ height: "100%", clipPath: "polygon(35% 100%, 65% 100%, 90% 0%, 10% 0%)" }}
        animate={scanning ? {
          rotateZ: [-3, 3, -3],
          opacity: [0.7, 1, 0.7],
        } : {
          opacity: [0.6, 1, 0.6],
          scaleX: [1, 1.05, 1],
        }}
        transition={{ duration: scanning ? 2 : 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Glow particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary"
          style={{
            width: 3 + Math.random() * 4,
            height: 3 + Math.random() * 4,
            left: `${40 + Math.random() * 20}%`,
          }}
          animate={{
            y: [0, -300 - Math.random() * 200],
            opacity: [0, 0.8, 0],
            x: [0, (Math.random() - 0.5) * 60],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Base glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-8 rounded-full bg-primary/30 blur-xl" />
    </div>
  );
};

export default SignalBeam;
