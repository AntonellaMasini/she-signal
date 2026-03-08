import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

const fields = [
  "Engineering",
  "Computer Science",
  "Design",
  "Biology/Life Sciences",
  "Physics",
  "Business/Entrepreneurship",
  "Other",
];

const stages = [
  "High School Student",
  "Undergraduate",
  "Graduate Student",
  "Early Career (0-3 yrs)",
  "Mid Career (3-7 yrs)",
];

const interestOptions = [
  "AI/ML",
  "Sustainability/Climate",
  "Hardware",
  "Space",
  "Social Impact",
  "Biotech",
  "Robotics",
  "Fintech",
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [field, setField] = useState("");
  const [stage, setStage] = useState("");
  const [country, setCountry] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    if (user) {
      supabase
        .from("profiles")
        .select("name, field, stage, country, interests")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            if (data.name) setName(data.name);
            if (data.field) setField(data.field);
            if (data.stage) setStage(data.stage);
            if (data.country) setCountry(data.country);
            if (data.interests) setInterests(data.interests);
          }
        });
    }
  }, [user, authLoading, navigate]);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    if (!name.trim() || !field || !stage || !user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        name: name.trim(),
        field,
        stage,
        country: country.trim(),
        interests,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      navigate("/signals");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-lg pt-28 pb-16 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-5xl font-display tracking-wider text-gradient-gold mb-2 text-center">Your Profile</h1>
          <p className="text-muted-foreground text-center mb-10 font-body text-sm">
            Tell us about yourself so we can find opportunities that match.
          </p>

          <div className="space-y-6">
            <div>
              <Label className="text-foreground mb-2 block">First Name</Label>
              <Input
                placeholder="Your first name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-muted border-border focus:border-primary"
              />
            </div>

            <div>
              <Label className="text-foreground mb-2 block">Field of Work/Study</Label>
              <Select value={field} onValueChange={setField}>
                <SelectTrigger className="bg-muted border-border">
                  <SelectValue placeholder="Select your field" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {fields.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-foreground mb-2 block">Career Stage</Label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger className="bg-muted border-border">
                  <SelectValue placeholder="Select your stage" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {stages.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-foreground mb-2 block">Country / Region</Label>
              <Input
                placeholder="e.g. United States, Europe, Global"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="bg-muted border-border focus:border-primary"
              />
            </div>

            <div>
              <Label className="text-foreground mb-2 block">Interests</Label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all border ${
                      interests.includes(interest)
                        ? "bg-primary/15 border-primary text-primary"
                        : "bg-muted border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display text-lg tracking-wider py-6 signal-glow mt-4"
              onClick={handleSubmit}
              disabled={saving || !name.trim() || !field || !stage}
            >
              <Sparkles className="w-5 h-5 mr-2" /> Find My Opportunities
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
