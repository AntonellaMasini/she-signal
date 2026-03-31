import { Calendar, ExternalLink, Bookmark, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import BatwomanSilhouette from "@/components/BatwomanSilhouette";
import type { Opportunity } from "@/types";
import { buildCalendarUrl, buildReminderUrl } from "@/lib/calendar";

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
  Fellowship: "badge-scholarship",
};

const isUrgent = (deadline: string) => {
  const diff = new Date(deadline).getTime() - Date.now();
  return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
};

const formatDate = (d: string) => {
  if (d === "Rolling" || d === "TBD") return d;
  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) return d;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const OpportunityCard = ({ opportunity, onTrack, showTrack = true, notes, onNotesChange }: OpportunityCardProps) => {
  const { name, type, deadline, whyMatch, organization, fundingAmount, location } = opportunity;
  const urgent = isUrgent(deadline);
  const hasCalendar = deadline !== "Rolling" && deadline !== "TBD";

  return (
    <div className="group relative card-glow rounded-lg bg-card p-5 transition-all duration-300 hover:translate-y-[-2px] overflow-hidden">
      <div className="flex items-start justify-between gap-3 mb-1">
        <h3 className="font-semibold text-foreground text-lg leading-tight">{name}</h3>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${typeBadgeClass[type] ?? "badge-grant"}`}>
          {type}
        </span>
      </div>

      {organization && (
        <p className="text-xs text-muted-foreground mb-2">{organization}</p>
      )}

      {opportunity.description && (
        <p className="text-sm text-foreground/70 mb-2">{opportunity.description}</p>
      )}
      <p className="text-sm italic text-muted-foreground mb-3">{whyMatch}</p>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className={`text-sm font-semibold ${urgent ? "text-signal-urgent" : "text-muted-foreground"}`}>
          {urgent && "⚡ "}Deadline: {formatDate(deadline)}
        </div>
        {location && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
            <MapPin className="w-3 h-3" />{location}
          </span>
        )}
        {fundingAmount && (
          <span className="text-xs font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5">
            {fundingAmount}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {hasCalendar && (
          <>
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
          </>
        )}
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
      <BatwomanSilhouette />
    </div>
  );
};

export default OpportunityCard;
