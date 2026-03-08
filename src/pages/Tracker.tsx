import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import OpportunityCard from "@/components/OpportunityCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, CheckCircle, PartyPopper, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTracker } from "@/hooks/useTracker";
import type { TrackerStatus } from "@/types";
import { useState } from "react";

const columns = [
  { key: "want_to_apply" as TrackerStatus, label: "Want to Apply", icon: Eye, emoji: "👀" },
  { key: "applied" as TrackerStatus, label: "Applied", icon: CheckCircle, emoji: "✅" },
  { key: "heard_back" as TrackerStatus, label: "Heard Back", icon: PartyPopper, emoji: "🎉" },
];

const Tracker = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { tracker, loading, moveOpp, updateNotes, deleteOpp } = useTracker();
  const [activeTab, setActiveTab] = useState<TrackerStatus>("want_to_apply");

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  const total = tracker.want_to_apply.length + tracker.applied.length + tracker.heard_back.length;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-5xl pt-28 pb-16 px-4">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg bg-card p-5 animate-pulse h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

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
                      {tracker[activeTab === col.key ? col.key : col.key].length}
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
                      key={opp.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="relative">
                        <OpportunityCard
                          opportunity={opp}
                          showTrack={false}
                          notes={opp.notes}
                          onNotesChange={(notes) => updateNotes(opp.id, notes)}
                        />
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          <Select
                            value={activeTab}
                            onValueChange={(val) => moveOpp(opp.id, val as TrackerStatus)}
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
                          <button
                            onClick={() => deleteOpp(opp.id)}
                            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
