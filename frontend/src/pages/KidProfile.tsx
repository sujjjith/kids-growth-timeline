import { useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Dumbbell, Trophy, TreePine, Plane, HeartPulse, Ruler, Weight, Home } from "lucide-react";
import { calculateAge, formatDate } from "@/lib/constants";
import { useState } from "react";
import { QuickAddDialog } from "@/components/QuickAddDialog";
import { Button } from "@/components/ui/button";
import { useKid } from "@/api/hooks/useKids";
import { useEducation } from "@/api/hooks/useEducation";
import { useActivities } from "@/api/hooks/useActivities";
import { useCompetitions } from "@/api/hooks/useCompetitions";
import { useCamps } from "@/api/hooks/useCamps";
import { useTrips } from "@/api/hooks/useTrips";
import { useGrowth } from "@/api/hooks/useGrowth";

const AVATAR_COLORS = ["#E8913A", "#8B6BAE", "#5B9A6F", "#D4793A", "#4A7FB5", "#D4697A", "#C4A43E"];

export function KidProfile() {
  const { kidId } = useParams<{ kidId: string }>();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddCategory, setQuickAddCategory] = useState("");

  const { data: kid, isLoading: kidsLoading } = useKid(kidId);

  const { data: eduRecords, isLoading: eduLoading } = useEducation(kidId);
  const { data: activities, isLoading: actLoading } = useActivities(kidId);
  const { data: competitions, isLoading: compLoading } = useCompetitions(kidId);
  const { data: camps, isLoading: campLoading } = useCamps(kidId);
  const { data: allTrips, isLoading: tripLoading } = useTrips();
  const { data: measurements, isLoading: growthLoading } = useGrowth(kidId);

  // Filter trips: show trips for this kid + family trips (no kidId)
  const trips = allTrips?.filter(t => t.kidId === kidId || !t.kidId);

  if (kidsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const avatarColor = AVATAR_COLORS[0];
  const firstName = kid?.firstName ?? "";
  const dob = kid?.dateOfBirth ?? "";
  const age = dob ? calculateAge(dob) : { years: 0, months: 0 };
  const gender = kid?.gender ?? "";
  const initial = firstName.charAt(0) || "?";

  const openQuickAdd = (cat: string) => {
    setQuickAddCategory(cat);
    setQuickAddOpen(true);
  };

  const defaultTab = () => {
    if (tabParam === "education") return "education";
    if (tabParam === "activities") return "activities";
    if (tabParam === "competitions") return "competitions";
    if (tabParam === "camps") return "camps";
    if (tabParam === "trips") return "trips";
    if (tabParam === "growth") return "growth";
    return "education";
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex items-center gap-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-white shrink-0"
          style={{
            backgroundColor: avatarColor,
            fontFamily: "'Fraunces', Georgia, serif",
            fontWeight: 700,
            fontSize: "32px",
          }}
        >
          {initial}
        </div>
        <div>
          <h1 className="text-3xl">{firstName}</h1>
          <p className="text-[#6B5B4F] mt-1">
            {gender} &middot; {age.years} years, {age.months} months
          </p>
          <p className="text-xs text-[#6B5B4F] uppercase tracking-wider mt-0.5">Born {formatDate(dob)}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab()} className="w-full">
        <TabsList className="bg-[#F0E8DE] border border-[#3B2F2F1F] w-full flex flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="education" className="gap-1.5 text-xs">
            <GraduationCap className="size-3.5" /> Education
          </TabsTrigger>
          <TabsTrigger value="activities" className="gap-1.5 text-xs">
            <Dumbbell className="size-3.5" /> Activities
          </TabsTrigger>
          <TabsTrigger value="competitions" className="gap-1.5 text-xs">
            <Trophy className="size-3.5" /> Competitions
          </TabsTrigger>
          <TabsTrigger value="camps" className="gap-1.5 text-xs">
            <TreePine className="size-3.5" /> Camps
          </TabsTrigger>
          <TabsTrigger value="trips" className="gap-1.5 text-xs">
            <Plane className="size-3.5" /> Trips
          </TabsTrigger>
          <TabsTrigger value="growth" className="gap-1.5 text-xs">
            <HeartPulse className="size-3.5" /> Growth
          </TabsTrigger>
        </TabsList>

        {/* Education Tab */}
        <TabsContent value="education" className="mt-6">
          <SectionHeader
            title="Education records"
            count={eduRecords?.length ?? 0}
            onAdd={() => openQuickAdd("Education")}
          />
          {eduLoading ? (
            <LoadingSkeleton />
          ) : eduRecords && eduRecords.length > 0 ? (
            <div className="space-y-3">
              {eduRecords.map(rec => (
                <Card
                  key={rec.id}
                  className="border-[#3B2F2F1F] bg-white"
                  style={{ borderLeft: "3px solid #4A7FB5" }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-[#3B2F2F]">{rec.schoolName}</p>
                        {rec.grade && <p className="text-sm text-[#6B5B4F] mt-0.5">{rec.grade}</p>}
                        {rec.achievement && (
                          <Badge
                            variant="secondary"
                            className="mt-2 text-xs"
                            style={{
                              backgroundColor: "#4A7FB515",
                              color: "#4A7FB5",
                            }}
                          >
                            {rec.achievement}
                          </Badge>
                        )}
                        {rec.description && <p className="text-sm text-[#6B5B4F] mt-2">{rec.description}</p>}
                      </div>
                      <span className="text-xs text-[#6B5B4F] shrink-0">
                        {formatDate(rec.startDate)}
                        {rec.endDate ? ` \u2013 ${formatDate(rec.endDate)}` : ""}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState label="education records" onAdd={() => openQuickAdd("Education")} />
          )}
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="mt-6">
          <SectionHeader title="Activities" count={activities?.length ?? 0} onAdd={() => openQuickAdd("Activity")} />
          {actLoading ? (
            <LoadingSkeleton />
          ) : activities && activities.length > 0 ? (
            <div className="space-y-3">
              {activities.map(act => (
                <Card
                  key={act.id}
                  className="border-[#3B2F2F1F] bg-white"
                  style={{ borderLeft: "3px solid #5B9A6F" }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-[#3B2F2F]">{act.activityName}</p>
                        <p className="text-sm text-[#6B5B4F] mt-0.5">
                          {act.activityType}
                          {act.provider ? ` \u00B7 ${act.provider}` : ""}
                        </p>
                        {act.dayOfWeek && (
                          <Badge
                            variant="secondary"
                            className="mt-2 text-xs"
                            style={{
                              backgroundColor: "#5B9A6F15",
                              color: "#5B9A6F",
                            }}
                          >
                            {act.dayOfWeek}
                          </Badge>
                        )}
                        {act.description && <p className="text-sm text-[#6B5B4F] mt-2">{act.description}</p>}
                      </div>
                      <span className="text-xs text-[#6B5B4F] shrink-0">
                        {formatDate(act.startDate)}
                        {act.endDate ? ` \u2013 ${formatDate(act.endDate)}` : ""}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState label="activities" onAdd={() => openQuickAdd("Activity")} />
          )}
        </TabsContent>

        {/* Competitions Tab */}
        <TabsContent value="competitions" className="mt-6">
          <SectionHeader
            title="Competitions"
            count={competitions?.length ?? 0}
            onAdd={() => openQuickAdd("Competition")}
          />
          {compLoading ? (
            <LoadingSkeleton />
          ) : competitions && competitions.length > 0 ? (
            <div className="space-y-3">
              {competitions.map(comp => (
                <Card
                  key={comp.id}
                  className="border-[#3B2F2F1F] bg-white"
                  style={{ borderLeft: "3px solid #D4793A" }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-[#3B2F2F]">{comp.competitionName}</p>
                        {comp.competitionType && (
                          <p className="text-sm text-[#6B5B4F] mt-0.5">{comp.competitionType}</p>
                        )}
                        {(comp.result || comp.placement) && (
                          <div className="flex gap-2 mt-2">
                            {comp.result && (
                              <Badge
                                variant="secondary"
                                className="text-xs"
                                style={{
                                  backgroundColor: "#D4793A15",
                                  color: "#D4793A",
                                }}
                              >
                                {comp.result}
                              </Badge>
                            )}
                            {comp.placement && (
                              <Badge
                                variant="secondary"
                                className="text-xs"
                                style={{
                                  backgroundColor: "#D4793A15",
                                  color: "#D4793A",
                                }}
                              >
                                {comp.placement}
                              </Badge>
                            )}
                          </div>
                        )}
                        {comp.description && <p className="text-sm text-[#6B5B4F] mt-2">{comp.description}</p>}
                      </div>
                      <span className="text-xs text-[#6B5B4F] shrink-0">{formatDate(comp.eventDate)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState label="competitions" onAdd={() => openQuickAdd("Competition")} />
          )}
        </TabsContent>

        {/* Camps Tab */}
        <TabsContent value="camps" className="mt-6">
          <SectionHeader title="Summer camps" count={camps?.length ?? 0} onAdd={() => openQuickAdd("Camp")} />
          {campLoading ? (
            <LoadingSkeleton />
          ) : camps && camps.length > 0 ? (
            <div className="space-y-3">
              {camps.map(camp => (
                <Card
                  key={camp.id}
                  className="border-[#3B2F2F1F] bg-white"
                  style={{ borderLeft: "3px solid #C4A43E" }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-[#3B2F2F]">{camp.campName}</p>
                        {camp.campType && (
                          <p className="text-sm text-[#6B5B4F] mt-0.5">
                            {camp.campType}
                            {camp.location ? ` \u00B7 ${camp.location}` : ""}
                          </p>
                        )}
                        {camp.highlights && (
                          <Badge
                            variant="secondary"
                            className="mt-2 text-xs"
                            style={{
                              backgroundColor: "#C4A43E15",
                              color: "#C4A43E",
                            }}
                          >
                            {camp.highlights}
                          </Badge>
                        )}
                        {camp.description && <p className="text-sm text-[#6B5B4F] mt-2">{camp.description}</p>}
                      </div>
                      <span className="text-xs text-[#6B5B4F] shrink-0">
                        {formatDate(camp.startDate)}
                        {camp.endDate ? ` \u2013 ${formatDate(camp.endDate)}` : ""}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState label="summer camps" onAdd={() => openQuickAdd("Camp")} />
          )}
        </TabsContent>

        {/* Trips Tab */}
        <TabsContent value="trips" className="mt-6">
          <SectionHeader title="Vacation trips" count={trips?.length ?? 0} onAdd={() => openQuickAdd("Trip")} />
          {tripLoading ? (
            <LoadingSkeleton />
          ) : trips && trips.length > 0 ? (
            <div className="space-y-3">
              {trips.map(trip => {
                const isFamily = trip.tripType === "Family" || trip.kidId === "family";
                return (
                  <Card
                    key={trip.id}
                    className="border-[#3B2F2F1F] bg-white"
                    style={{ borderLeft: "3px solid #8B6BAE" }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-[#3B2F2F]">{trip.tripName}</p>
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
                          <p className="text-sm text-[#6B5B4F] mt-0.5">{trip.destination}</p>
                          {trip.highlights && (
                            <Badge
                              variant="secondary"
                              className="mt-2 text-xs"
                              style={{
                                backgroundColor: "#8B6BAE15",
                                color: "#8B6BAE",
                              }}
                            >
                              {trip.highlights}
                            </Badge>
                          )}
                          {trip.description && <p className="text-sm text-[#6B5B4F] mt-2">{trip.description}</p>}
                        </div>
                        <span className="text-xs text-[#6B5B4F] shrink-0">
                          {formatDate(trip.startDate)}
                          {trip.endDate ? ` \u2013 ${formatDate(trip.endDate)}` : ""}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <EmptyState label="vacation trips" onAdd={() => openQuickAdd("Trip")} />
          )}
        </TabsContent>

        {/* Growth Tab */}
        <TabsContent value="growth" className="mt-6">
          <SectionHeader
            title="Growth measurements"
            count={measurements?.length ?? 0}
            onAdd={() => openQuickAdd("Growth")}
          />
          {growthLoading ? (
            <LoadingSkeleton />
          ) : measurements && measurements.length > 0 ? (
            <div className="space-y-3">
              {measurements.map(m => (
                <Card
                  key={m.id}
                  className="border-[#3B2F2F1F] bg-white"
                  style={{ borderLeft: "3px solid #D4697A" }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-6">
                        {m.heightInches != null && (
                          <div className="flex items-center gap-2">
                            <Ruler className="size-4" style={{ color: "#D4697A" }} />
                            <span className="font-semibold tabular-nums">{m.heightInches}&quot;</span>
                            <span className="text-xs text-[#6B5B4F]">height</span>
                          </div>
                        )}
                        {m.weightLbs != null && (
                          <div className="flex items-center gap-2">
                            <Weight className="size-4" style={{ color: "#D4697A" }} />
                            <span className="font-semibold tabular-nums">{m.weightLbs} lbs</span>
                            <span className="text-xs text-[#6B5B4F]">weight</span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-[#6B5B4F] shrink-0">{formatDate(m.measurementDate)}</span>
                    </div>
                    {m.notes && <p className="text-sm text-[#6B5B4F] mt-2">{m.notes}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState label="growth measurements" onAdd={() => openQuickAdd("Growth")} />
          )}
        </TabsContent>
      </Tabs>

      <QuickAddDialog
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
        defaultKidId={kidId}
        defaultCategory={quickAddCategory}
      />
    </div>
  );
}

function SectionHeader({ title, count, onAdd }: { title: string; count: number; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-baseline gap-2">
        <h3>{title}</h3>
        <span className="text-sm text-[#6B5B4F] tabular-nums">({count})</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onAdd}
        className="text-[#E8913A] border-[#E8913A] hover:bg-[#E8913A]/10"
      >
        Add new
      </Button>
    </div>
  );
}

function EmptyState({ label, onAdd }: { label: string; onAdd: () => void }) {
  return (
    <Card className="border-[#3B2F2F1F] bg-white">
      <CardContent className="p-8 text-center">
        <p className="text-[#6B5B4F] mb-3">No {label} yet</p>
        <Button
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="text-[#E8913A] border-[#E8913A] hover:bg-[#E8913A]/10"
        >
          Add first {label.endsWith("s") ? label.slice(0, -1) : label}
        </Button>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>
  );
}
