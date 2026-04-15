import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap, Dumbbell, Trophy, TreePine, Plane, HeartPulse, Clock, Home } from "lucide-react";
import { calculateAge, formatDate, getCategoryColor } from "@/lib/constants";
import { useKids } from "@/api/hooks/useKids";
import { useTimeline } from "@/api/hooks/useTimeline";
import { useEducation } from "@/api/hooks/useEducation";
import { useActivities } from "@/api/hooks/useActivities";
import { useCompetitions } from "@/api/hooks/useCompetitions";
import { useCamps } from "@/api/hooks/useCamps";
import { useTrips } from "@/api/hooks/useTrips";
import { useGrowth } from "@/api/hooks/useGrowth";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Education: GraduationCap,
  Activity: Dumbbell,
  Competition: Trophy,
  Camp: TreePine,
  Trip: Plane,
  Growth: HeartPulse,
};

const AVATAR_COLORS = ["#E8913A", "#8B6BAE", "#5B9A6F", "#D4793A", "#4A7FB5", "#D4697A", "#C4A43E"];

export function Dashboard() {
  const navigate = useNavigate();
  const { data: kids, isLoading: kidsLoading } = useKids();
  const { data: events, isLoading: eventsLoading } = useTimeline();
  const { data: trips } = useTrips();

  // Get first kid ID for kid-scoped queries (used for aggregate counts)
  const firstKidId = kids?.[0]?.id;
  const secondKidId = kids?.[1]?.id;

  const { data: edu1 } = useEducation(firstKidId);
  const { data: edu2 } = useEducation(secondKidId);
  const { data: act1 } = useActivities(firstKidId);
  const { data: act2 } = useActivities(secondKidId);
  const { data: comp1 } = useCompetitions(firstKidId);
  const { data: comp2 } = useCompetitions(secondKidId);
  const { data: camp1 } = useCamps(firstKidId);
  const { data: camp2 } = useCamps(secondKidId);
  const { data: growth1 } = useGrowth(firstKidId);
  const { data: growth2 } = useGrowth(secondKidId);

  const eduCount = (edu1?.length ?? 0) + (edu2?.length ?? 0);
  const actCount = (act1?.length ?? 0) + (act2?.length ?? 0);
  const compCount = (comp1?.length ?? 0) + (comp2?.length ?? 0);
  const campCount = (camp1?.length ?? 0) + (camp2?.length ?? 0);
  const growthCount = (growth1?.length ?? 0) + (growth2?.length ?? 0);
  const totalMilestones = eduCount + actCount + compCount + campCount + (trips?.length ?? 0) + growthCount;

  const stats = [
    { label: "Education", count: eduCount, icon: GraduationCap, color: "#4A7FB5" },
    { label: "Activities", count: actCount, icon: Dumbbell, color: "#5B9A6F" },
    { label: "Competitions", count: compCount, icon: Trophy, color: "#D4793A" },
    { label: "Camps", count: campCount, icon: TreePine, color: "#C4A43E" },
    { label: "Trips", count: trips?.length ?? 0, icon: Plane, color: "#8B6BAE" },
    { label: "Growth", count: growthCount, icon: HeartPulse, color: "#D4697A" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl">Kid Chronicle</h1>
        <p className="text-[#6B5B4F] mt-2 text-lg">Every milestone, every memory, one living record</p>
      </div>

      {/* Kid Cards */}
      <section>
        <h3 className="mb-4">Your kids</h3>
        {kidsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        ) : kids && kids.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {kids.map((kid, idx) => {
              const dob = kid.dateOfBirth;
              const age = dob ? calculateAge(dob) : null;
              const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
              const initial = kid.firstName?.charAt(0) ?? "?";

              return (
                <Card
                  key={kid.id}
                  className="cursor-pointer group hover:shadow-md transition-shadow duration-200 border-[#3B2F2F1F] bg-white"
                  onClick={() => navigate(`/kids/${kid.id}`)}
                >
                  <CardContent className="flex items-center gap-5 p-6">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white shrink-0 transition-transform duration-200 group-hover:scale-105"
                      style={{
                        backgroundColor: avatarColor,
                        fontFamily: "'Fraunces', Georgia, serif",
                        fontWeight: 700,
                        fontSize: "24px",
                      }}
                    >
                      {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl group-hover:text-[#E8913A] transition-colors">
                        {kid.firstName} {kid.lastName ?? ""}
                      </h3>
                      <p className="text-sm text-[#6B5B4F] mt-0.5">
                        {kid.gender ?? ""} {age ? ` \u00B7 ${age.years} years, ${age.months} months` : ""}
                      </p>
                      {dob && (
                        <p className="text-xs text-[#6B5B4F] mt-0.5 uppercase tracking-wider">Born {formatDate(dob)}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-[#3B2F2F1F] bg-white">
            <CardContent className="p-8 text-center">
              <p className="text-[#6B5B4F]">No kid profiles yet. Use the + button to get started</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Stats Grid */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h3>At a glance</h3>
          <span className="text-sm text-[#6B5B4F] tabular-nums">{totalMilestones} total entries</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map(stat => (
            <Card key={stat.label} className="border-[#3B2F2F1F] bg-white hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <stat.icon className="size-5" style={{ color: stat.color }} />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold tabular-nums" style={{ color: stat.color }}>
                      {stat.count}
                    </p>
                    <p className="text-xs text-[#6B5B4F] uppercase tracking-wider">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Timeline */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h3>Recent events</h3>
          <button onClick={() => navigate("/timeline")} className="text-sm text-[#E8913A] hover:underline font-medium">
            View all
          </button>
        </div>
        {eventsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="space-y-3">
            {events.slice(0, 5).map(event => {
              const catColor = getCategoryColor(event.eventCategory ?? "");
              const Icon = CATEGORY_ICONS[event.eventCategory ?? ""] ?? Clock;
              const isFamily = !event.kidId;
              const kidObj = kids?.find(k => k.id === event.kidId);
              const kidName = isFamily ? "Family" : (kidObj?.firstName ?? "");
              return (
                <Card
                  key={event.id}
                  className="border-[#3B2F2F1F] bg-white hover:shadow-sm transition-shadow"
                  style={{ borderLeft: `3px solid ${catColor}` }}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${catColor}20` }}
                    >
                      <Icon className="size-5" style={{ color: catColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-[#3B2F2F] truncate">{event.eventTitle}</p>
                        {isFamily && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] gap-1 uppercase tracking-wider shrink-0"
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
                      {event.description && (
                        <p className="text-sm text-[#6B5B4F] truncate mt-0.5">{event.description}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        style={{ backgroundColor: `${catColor}15`, color: catColor }}
                      >
                        {event.eventCategory}
                      </Badge>
                      <div className="flex items-center gap-1.5">
                        {isFamily ? (
                          <div className="flex -space-x-1">
                            {kids?.map((k, idx) => (
                              <div
                                key={k.id}
                                className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] ring-1 ring-white"
                                style={{
                                  backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length],
                                  fontFamily: "'Fraunces', Georgia, serif",
                                  fontWeight: 700,
                                }}
                              >
                                {k.firstName.charAt(0)}
                              </div>
                            ))}
                          </div>
                        ) : null}
                        <span className="text-xs text-[#6B5B4F]">
                          {kidName} &middot; {formatDate(event.eventDate)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-[#3B2F2F1F] bg-white">
            <CardContent className="p-8 text-center">
              <Clock className="size-10 text-[#6B5B4F]/30 mx-auto mb-3" />
              <p className="text-[#6B5B4F]">No events yet. Start adding milestones and memories</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
