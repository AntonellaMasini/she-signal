import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SignalBeam from "@/components/SignalBeam";
import Navbar from "@/components/Navbar";
import { ArrowRight, Zap, TrendingUp, Users } from "lucide-react";

const stats = [
  {
    icon: Zap,
    value: "67%",
    label: "of women in STEM don't hear about relevant opportunities until after the deadline",
  },
  {
    icon: TrendingUp,
    value: "$4.5B",
    label: "in scholarships and grants go unclaimed every year",
  },
  {
    icon: Users,
    value: "3x",
    label: "more likely to succeed with the right opportunity at the right time",
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden pt-16">
        {/* Sky background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background to-signal-navy/50" />

        {/* Stars */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-foreground/30"
            style={{
              width: 1 + Math.random() * 2,
              height: 1 + Math.random() * 2,
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}

        {/* Signal beam behind content */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-[70vh]">
          <SignalBeam className="w-full h-full" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl md:text-9xl font-display tracking-wider mb-2">
              <span className="text-gradient-gold">SheSignal</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 font-light mb-2 font-body">
              The signal goes up. You show up.
            </p>
            <p className="text-sm text-muted-foreground mb-10 font-body max-w-md mx-auto">
              Discover hackathons, scholarships, conferences, and grants tailored for women in STEM. Never miss a deadline again.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-xl tracking-wider px-10 py-6 signal-glow"
              onClick={() => navigate("/profile")}
            >
              Find My Signal <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Why SheSignal */}
      <section className="relative py-24 px-4">
        <div className="container max-w-5xl">
          <motion.h2
            className="text-5xl md:text-6xl font-display text-center mb-16 tracking-wider text-gradient-gold"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Why SheSignal
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="card-glow rounded-xl bg-card p-8 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <div className="text-4xl font-display text-gradient-gold mb-3">{stat.value}</div>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-4">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-xl text-primary tracking-wider">SheSignal</span>
          <p className="text-sm text-muted-foreground">
            © 2026 SheSignal. Empowering women in STEM, one signal at a time.
          </p>
          <div className="flex gap-4 text-muted-foreground text-sm">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
