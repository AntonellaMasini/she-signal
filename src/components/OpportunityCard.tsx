import { Calendar, ExternalLink, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Opportunity {
  name: string;
  type: "Hackathon" | "Scholarship" | "Conference" | "Grant";
  deadline: string;
  description: string;
  url: string;
  whyMatch: string;
}

interface OpportunityCardProps {
  opportunity: Opportunity;
  onTrack?: (opp: Opportunity) => void;
  showTrack?: boolean;
  notes?: string;
  onNotesChange?: (notes: string) => void;
}

const typeBadgeClass: Record<string, string> = {
  Hackathon: "badge-hackathon",
  Scholarship: "badge-scholarship",
  Conference: "badge-conference",
  Grant: "badge-grant",
};

const isUrgent = (deadline: string) => {
  const diff = new Date(deadline).getTime() - Date.now();
  return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const buildCalendarUrl = (name: string, deadline: string) => {
  const date = new Date(deadline);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const start = fmt(date);
  const end = fmt(new Date(date.getTime() + 3600000));
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `[SheSignal] Apply by: ${name}`
  )}&dates=${start}/${end}&details=${encodeURIComponent(
    "Deadline reminder from SheSignal"
  )}`;
};

const buildReminderUrl = (name: string, deadline: string) => {
  const date = new Date(new Date(deadline).getTime() - 86400000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const start = fmt(date);
  const end = fmt(new Date(date.getTime() + 3600000));
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `[SheSignal] TOMORROW: ${name} deadline!`
  )}&dates=${start}/${end}&details=${encodeURIComponent(
    "Tomorrow is the deadline! Don't miss it."
  )}`;
};

const OpportunityCard = ({ opportunity, onTrack, showTrack = true, notes, onNotesChange }: OpportunityCardProps) => {
  const { name, type, deadline, whyMatch } = opportunity;
  const urgent = isUrgent(deadline);

  return (
    <div className="card-glow rounded-lg bg-card p-5 transition-all duration-300 hover:translate-y-[-2px]">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-foreground text-lg leading-tight">{name}</h3>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${typeBadgeClass[type]}`}>
          {type}
        </span>
      </div>

      <p className="text-sm italic text-muted-foreground mb-3">{whyMatch}</p>

      <div className={`text-sm font-semibold mb-4 ${urgent ? "text-signal-urgent" : "text-muted-foreground"}`}>
        {urgent && "⚡ "} Deadline: {formatDate(deadline)}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          className="text-xs border-border hover:border-primary hover:text-primary"
          onClick={() => window.open(buildCalendarUrl(name, deadline), "_blank")}
        >
          <Calendar className="w-3 h-3 mr-1" /> Add to Calendar
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-xs border-border hover:border-primary hover:text-primary"
          onClick={() => window.open(buildReminderUrl(name, deadline), "_blank")}
        >
          <Calendar className="w-3 h-3 mr-1" /> Remind 1 Day Before
        </Button>
        {showTrack && onTrack && (
          <Button
            size="sm"
            className="text-xs bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => onTrack(opportunity)}
          >
            <Bookmark className="w-3 h-3 mr-1" /> Track This
          </Button>
        )}
        {opportunity.url && (
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={() => window.open(opportunity.url, "_blank")}
          >
            <ExternalLink className="w-3 h-3 mr-1" /> Visit
          </Button>
        )}
      </div>

      {onNotesChange !== undefined && (
        <textarea
          className="mt-3 w-full rounded-md border border-border bg-muted/50 p-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          placeholder="Add notes..."
          rows={2}
          value={notes || ""}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      )}
    </div>
  );
};

export default OpportunityCard;
