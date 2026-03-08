import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import SignalBeam from "@/components/SignalBeam";
import OpportunityCard from "@/components/OpportunityCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import type { Opportunity } from "@/types";
import { toast } from "sonner";

// Mock data fallback for dev / when edge function isn't deployed yet
const mockOpportunities: Opportunity[] = [
  {
    name: "Grace Hopper Celebration 2026",
    type: "Conference",
    organization: "AnitaB.org",
    deadline: "2026-06-15",
    description: "The world's largest gathering of women and non-binary technologists.",
    url: "https://ghc.anitab.org",
    whyMatch: "Perfect for your career stage and interest in tech leadership.",
    location: "Orlando, FL",
  },
  {
    name: "Google Women Techmakers Scholarship",
    type: "Scholarship",
    organization: "Google",
    deadline: "2026-04-10",
    description: "Scholarship for women pursuing computer science degrees.",
    url: "https://www.womentechmakers.com",
    whyMatch: "Matches your field of study and career stage perfectly.",
    fundingAmount: "$10,000",
    location: "Global",
  },
  {
    name: "SheHacks+ Global Hackathon",
    type: "Hackathon",
    organization: "SheHacks+",
    deadline: "2026-03-28",
    description: "48-hour hackathon for women and non-binary individuals in tech.",
    url: "https://shehacks.ca",
    whyMatch: "Aligns with your interests in AI/ML and social impact.",
    location: "Remote",
  },
  {
    name: "Cartier Women's Initiative Award",
    type: "Grant",
    organization: "Cartier",
    deadline: "2026-05-31",
    description: "$100K grant for women entrepreneurs making social impact.",
    url: "https://www.cartierwomensinitiative.com",
    whyMatch: "Great match for your entrepreneurship and social impact interests.",
    fundingAmount: "$100,000",
    location: "Global",
  },
  {
    name: "Women in AI Awards",
    type: "Conference",
    organization: "Women in AI",
    deadline: "2026-07-20",
    description: "Celebrating women leaders in artificial intelligence.",
    url: "https://www.womeninai.co",
    whyMatch: "Directly relevant to your AI/ML interest area.",
    location: "Remote",
  },
];

const Signal = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, field, stage, country, interests")
        .eq("id", user.id)
        .single();

      if (!profile?.field) {
        navigate("/profile");
        return;
      }

      setProfileName(profile.name ?? "");

      // Call edge function
      try {
        const { data, error } = await supabase.functions.invoke("get-opportunities", {
          body: {
            name: profile.name,
            field: profile.field,
            stage: profile.stage,
            country: profile.country,
            interests: profile.interests ?? [],
          },
        });
        if (error) throw error;
        setOpportunities(data.opportunities);
      } catch {
        // Fallback to mock data
        await new Promise((r) => setTimeout(r, 2000));
        setOpportunities(mockOpportunities);
      }
      setLoading(false);
    };

    fetchData();
  }, [user, authLoading, navigate]);

  const trackOpportunity = async (opp: Opportunity) => {
    if (!user) return;

    // Check for existing row
    const { data: existing } = await supabase
      .from("saved_opportunities")
      .select("id")
      .eq("user_id", user.id)
      .eq("name", opp.name)
      .maybeSingle();

    if (existing) {
      toast.info("Already tracking this opportunity!");
      return;
    }

    const { error } = await supabase.from("saved_opportunities").insert({
      user_id: user.id,
      name: opp.name,
      type: opp.type,
      organization: opp.organization,
      deadline: opp.deadline,
      description: opp.description,
      url: opp.url,
      why_match: opp.whyMatch,
      funding_amount: opp.fundingAmount,
      location: opp.location,
      status: "want_to_apply",
    });

    if (error) {
      toast.error("Failed to track opportunity");
    } else {
      toast.success(`Tracking "${opp.name}"!`);
    }
  };

  if (authLoading) return null;

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
                Finding opportunities tailored for you{profileName ? `, ${profileName}` : ""}
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
                Your Signal{profileName ? `, ${profileName}` : ""}
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
