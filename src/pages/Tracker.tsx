import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import OpportunityCard, { Opportunity } from "@/components/OpportunityCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, CheckCircle, PartyPopper } from "lucide-react";

interface TrackedOpp extends Opportunity {
  notes: string;
}

interface TrackerState {
  want: TrackedOpp[];
  applied: TrackedOpp[];
  heard: TrackedOpp[];
}

const columns = [
  { key: "want" as const, label: "Want to Apply", icon: Eye, emoji: "👀" },
  { key: "applied" as const, label: "Applied", icon: CheckCircle, emoji: "✅" },
  { key: "heard" as const, label: "Heard Back", icon: PartyPopper, emoji: "🎉" },
];

const Tracker = () => {
  const [tracker, setTracker] = useState<TrackerState>({ want: [], applied: [], heard: [] });
  const [activeTab, setActiveTab] = useState<keyof TrackerState>("want");

  useEffect(() => {
    const raw = localStorage.getItem("shesignal-tracker");
    if (raw) setTracker(JSON.parse(raw));
  }, []);

  const save = (updated: TrackerState) => {
    setTracker(updated);
    localStorage.setItem("shesignal-tracker", JSON.stringify(updated));
  };

  const moveOpp = (opp: TrackedOpp, from: keyof TrackerState, to: keyof TrackerState) => {
    const updated = { ...tracker };
    updated[from] = updated[from].filter((o) => o.name !== opp.name);
    updated[to] = [...updated[to], opp];
    save(updated);
  };

  const updateNotes = (column: keyof TrackerState, index: number, notes: string) => {
    const updated = { ...tracker };
    updated[column] = [...updated[column]];
    updated[column][index] = { ...updated[column][index], notes };
    save(updated);
  };

  const total = tracker.want.length + tracker.applied.length + tracker.heard.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-5xl pt-28 pb-16 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-display tracking-wider text-gradient-gold mb-2 text-center">My Tracker</h1>
          <p className="text-muted-foreground text-center mb-10 text-sm font-body">
            {total} opportunities tracked
          </p>

          {total === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-2">No opportunities tracked yet.</p>
              <p className="text-sm text-muted-foreground">
                Find opportunities first, then click "Track This" to add them here.
              </p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex gap-1 mb-8 bg-muted rounded-lg p-1">
                {columns.map((col) => (
                  <button
                    key={col.key}
                    onClick={() => setActiveTab(col.key)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-all ${
                      activeTab === col.key
                        ? "bg-card text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{col.emoji}</span>
                    {col.label}
                    <span className="ml-1 text-xs bg-muted rounded-full px-2 py-0.5">
                      {tracker[col.key].length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Cards */}
              <div className="space-y-4">
                {tracker[activeTab].length === 0 ? (
                  <p className="text-center text-muted-foreground py-10">
                    No opportunities in this column yet.
                  </p>
                ) : (
                  tracker[activeTab].map((opp, i) => (
                    <motion.div
                      key={opp.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="relative">
                        <OpportunityCard
                          opportunity={opp}
                          showTrack={false}
                          notes={opp.notes}
                          onNotesChange={(notes) => updateNotes(activeTab, i, notes)}
                        />
                        <div className="absolute top-4 right-4">
                          <Select
                            value={activeTab}
                            onValueChange={(val) =>
                              moveOpp(opp, activeTab, val as keyof TrackerState)
                            }
                          >
                            <SelectTrigger className="w-36 bg-muted border-border text-xs h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                              {columns.map((c) => (
                                <SelectItem key={c.key} value={c.key} className="text-xs">
                                  {c.emoji} {c.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Tracker;
