import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import SignalBeam from "@/components/SignalBeam";
import OpportunityCard, { Opportunity } from "@/components/OpportunityCard";
import { toast } from "sonner";

// Mock data for demo — will be replaced by /api/opportunities
const mockOpportunities: Opportunity[] = [
  {
    name: "Grace Hopper Celebration 2026",
    type: "Conference",
    deadline: "2026-06-15",
    description: "The world's largest gathering of women and non-binary technologists.",
    url: "https://ghc.anitab.org",
    whyMatch: "Perfect for your career stage and interest in tech leadership.",
  },
  {
    name: "Google Women Techmakers Scholarship",
    type: "Scholarship",
    deadline: "2026-04-10",
    description: "Scholarship for women pursuing computer science degrees.",
    url: "https://www.womentechmakers.com",
    whyMatch: "Matches your field of study and career stage perfectly.",
  },
  {
    name: "SheHacks+ Global Hackathon",
    type: "Hackathon",
    deadline: "2026-03-28",
    description: "48-hour hackathon for women and non-binary individuals in tech.",
    url: "https://shehacks.ca",
    whyMatch: "Aligns with your interests in AI/ML and social impact.",
  },
  {
    name: "Cartier Women's Initiative Award",
    type: "Grant",
    deadline: "2026-05-31",
    description: "$100K grant for women entrepreneurs making social impact.",
    url: "https://www.cartierwomensinitiative.com",
    whyMatch: "Great match for your entrepreneurship and social impact interests.",
  },
  {
    name: "Women in AI Awards",
    type: "Conference",
    deadline: "2026-07-20",
    description: "Celebrating women leaders in artificial intelligence.",
    url: "https://www.womeninai.co",
    whyMatch: "Directly relevant to your AI/ML interest area.",
  },
];

const Signal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem("shesignal-profile");
    if (!raw) {
      navigate("/profile");
      return;
    }
    const profile = JSON.parse(raw);
    setProfileName(profile.name);

    // Try fetching from API, fallback to mock
    const fetchOpportunities = async () => {
      try {
        const res = await fetch("/api/opportunities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        });
        if (res.ok) {
          const data = await res.json();
          setOpportunities(data.opportunities);
        } else {
          throw new Error("API not available");
        }
      } catch {
        // Use mock data as fallback
        await new Promise((r) => setTimeout(r, 3500));
        setOpportunities(mockOpportunities);
      }
      setLoading(false);
    };

    fetchOpportunities();
  }, [navigate]);

  const trackOpportunity = (opp: Opportunity) => {
    const raw = localStorage.getItem("shesignal-tracker");
    const tracker = raw ? JSON.parse(raw) : { want: [], applied: [], heard: [] };

    const exists = [...tracker.want, ...tracker.applied, ...tracker.heard].some(
      (t: any) => t.name === opp.name
    );
    if (exists) {
      toast.info("Already tracking this opportunity!");
      return;
    }

    tracker.want.push({ ...opp, notes: "" });
    localStorage.setItem("shesignal-tracker", JSON.stringify(tracker));
    toast.success(`Tracking "${opp.name}"!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-3xl pt-28 pb-16 px-4">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-40 h-64 mb-8">
                <SignalBeam scanning className="w-full h-full" />
              </div>
              <h2 className="text-3xl font-display tracking-wider text-gradient-gold mb-2">
                Scanning for signals...
              </h2>
              <p className="text-muted-foreground text-sm font-body">
                Finding opportunities tailored for you, {profileName}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-6xl font-display tracking-wider text-gradient-gold mb-2 text-center">
                Your Signal, {profileName}
              </h1>
              <p className="text-muted-foreground text-center mb-10 text-sm font-body">
                {opportunities.length} opportunities found just for you
              </p>

              {opportunities.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-xl text-muted-foreground mb-4">
                    No signals found right now — but don't worry.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    New opportunities are added constantly. Update your profile and check back soon!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {opportunities.map((opp, i) => (
                    <motion.div
                      key={opp.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <OpportunityCard opportunity={opp} onTrack={trackOpportunity} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Signal;
