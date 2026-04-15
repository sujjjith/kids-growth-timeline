import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Dumbbell, Trophy, TreePine, Plane, HeartPulse, Clock, Filter, Home } from "lucide-react";
import { formatDate, getCategoryColor } from "@/lib/constants";
import { useKids } from "@/api/hooks/useKids";
import { useTimeline } from "@/api/hooks/useTimeline";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Education: GraduationCap,
  Activity: Dumbbell,
  Competition: Trophy,
  Camp: TreePine,
  Trip: Plane,
  Growth: HeartPulse,
};

const ALL_CATEGORIES = ["Education", "Activity", "Competition", "Camp", "Trip", "Growth"];

export function Timeline() {
  const [kidFilter, setKidFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: kids } = useKids();
  const { data: events, isLoading } = useTimeline(
    kidFilter !== "all" ? kidFilter : undefined,
    categoryFilter !== "all" ? categoryFilter : undefined,
  );

  // Group events by year-month
  const grouped = (events ?? []).reduce<Record<string, typeof events>>((acc, ev) => {
    const dateStr = ev.eventDate;
    let key = "Unknown";
    if (dateStr) {
      const d = new Date(dateStr);
      key = d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
    }
    if (!acc[key]) acc[key] = [];
    acc[key]!.push(ev);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">Timeline</h1>
          <p className="text-[#6B5B4F] mt-1">A living record of every milestone and memory</p>
        </div>
        <div className="flex items-center gap-3">
          <Filter className="size-4 text-[#6B5B4F]" />
          <Select value={kidFilter} onValueChange={setKidFilter}>
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All kids</SelectItem>
              {(kids ?? []).map(k => (
                <SelectItem key={k.id} value={k.id}>{k.firstName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {ALL_CATEGORIES.map(c => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Timeline */}
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : events && events.length > 0 ? (
        <div className="relative">
          {/* The Living Timeline Spine */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5" style={{ backgroundColor: "rgba(59, 47, 47, 0.2)" }} />

          {/* Today marker / heartbeat */}
          <div className="relative flex items-center mb-8 ml-5 -translate-x-1/2">
            <div className="w-3 h-3 rounded-full bg-[#E8913A] animate-heartbeat z-10" />
            <span className="ml-5 text-xs uppercase tracking-widest text-[#E8913A] font-semibold">Today</span>
          </div>

          {/* Grouped events */}
          {Object.entries(grouped).map(([monthYear, monthEvents]) => (
            <div key={monthYear} className="mb-8">
              {/* Month-year label */}
              <div className="relative flex items-center mb-4 ml-5">
                <span
                  className="relative z-10 bg-[#FAF4ED] pr-3 text-xs uppercase tracking-widest text-[#6B5B4F] font-semibold"
                  style={{ marginLeft: "16px" }}
                >
                  {monthYear}
                </span>
              </div>

              {/* Events in this month */}
              {monthEvents?.map(event => {
                const catColor = getCategoryColor(event.eventCategory ?? "");
                const Icon = CATEGORY_ICONS[event.eventCategory ?? ""] ?? Clock;
                const isFamily = !event.kidId;
                const kidObj = kids?.find(k => k.id === event.kidId);
                const kidName = isFamily ? "Family" : (kidObj?.firstName ?? "");

                return (
                  <div key={event.id} className="relative flex items-start mb-4 group">
                    {/* Timeline dot */}
                    <div className="absolute left-5 -translate-x-1/2 mt-5 z-10">
                      <div
                        className="w-3 h-3 rounded-full transition-all duration-150 group-hover:scale-150"
                        style={{ backgroundColor: catColor }}
                      />
                    </div>

                    {/* Horizontal connector */}
                    <div
                      className="absolute left-5 top-[23px] w-6 h-px"
                      style={{ backgroundColor: "rgba(59,47,47,0.15)" }}
                    />

                    {/* Card */}
                    <Card
                      className="ml-14 flex-1 border-[#3B2F2F1F] bg-white transition-shadow duration-200 group-hover:shadow-md"
                      style={{ borderLeft: `3px solid ${catColor}` }}
                    >
                      <CardContent className="flex items-start gap-4 p-4">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: `${catColor}20` }}
                        >
                          <Icon className="size-5" style={{ color: catColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-[#3B2F2F]">{event.eventTitle}</p>
                            <Badge
                              variant="secondary"
                              className="text-[10px] uppercase tracking-wider"
                              style={{
                                backgroundColor: `${catColor}15`,
                                color: catColor,
                              }}
                            >
                              {event.eventCategory}
                            </Badge>
                            {isFamily && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] gap-1 uppercase tracking-wider"
                                style={{
                                  backgroundColor: "#E8913A15",
                                  color: "#E8913A",
                                }}
                              >
                                <Home className="size-2.5" />
                                Family
                              </Badge>
                            )}
                          </div>
                          {event.description && <p className="text-sm text-[#6B5B4F] mt-1">{event.description}</p>}
                          <div className="flex items-center gap-2 mt-2">
                            {isFamily ? (
                              <>
                                <div className="flex -space-x-1.5">
                                  {(kids ?? []).map((k, idx) => {
                                    const colors = ["#E8913A", "#8B6BAE", "#5B9A6F", "#D4793A", "#4A7FB5"];
                                    return (
                                      <div
                                        key={k.id}
                                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] ring-1 ring-white"
                                        style={{
                                          backgroundColor: colors[idx % colors.length],
                                          fontFamily: "'Fraunces', Georgia, serif",
                                          fontWeight: 700,
                                        }}
                                      >
                                        {k.firstName.charAt(0)}
                                      </div>
                                    );
                                  })}
                                </div>
                                <span className="text-xs text-[#6B5B4F]">Family</span>
                              </>
                            ) : (
                              <>
                                <div
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
                                  style={{
                                    backgroundColor: kidObj ? ["#E8913A", "#8B6BAE", "#5B9A6F"][(kids ?? []).indexOf(kidObj) % 3] : "#6B5B4F",
                                    fontFamily: "'Fraunces', Georgia, serif",
                                    fontWeight: 700,
                                  }}
                                >
                                  {kidName.charAt(0)}
                                </div>
                                <span className="text-xs text-[#6B5B4F]">{kidName}</span>
                              </>
                            )}
                            <span className="text-xs text-[#6B5B4F]">&middot;</span>
                            <span className="text-xs text-[#6B5B4F]">{formatDate(event.eventDate)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <Card className="border-[#3B2F2F1F] bg-white">
          <CardContent className="p-12 text-center">
            <Clock className="size-12 text-[#6B5B4F]/30 mx-auto mb-4" />
            <h3 className="text-lg mb-2">No timeline events yet</h3>
            <p className="text-sm text-[#6B5B4F]">Start adding milestones and memories using the + button</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
