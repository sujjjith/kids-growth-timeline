import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOsdkAction } from "@osdk/react/experimental";
import { $Actions } from "../../.osdk/src";
import { generateId } from "@/lib/constants";
import { toast } from "sonner";
import { Home, User } from "lucide-react";

interface QuickAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultKidId?: string;
  defaultCategory?: string;
}

const CATEGORIES = [
  { value: "Education", label: "Education" },
  { value: "Activity", label: "Activity" },
  { value: "Competition", label: "Competition" },
  { value: "Camp", label: "Summer Camp" },
  { value: "Trip", label: "Vacation Trip" },
  { value: "Growth", label: "Growth Measurement" },
];

const KIDS = [
  { value: "nirek", label: "Nirek" },
  { value: "mishka", label: "Mishka" },
];

export function QuickAddDialog({ open, onOpenChange, defaultKidId, defaultCategory }: QuickAddDialogProps) {
  const [category, setCategory] = useState(defaultCategory ?? "");
  const [kidId, setKidId] = useState(defaultKidId ?? "");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  // Category-specific fields
  const [schoolName, setSchoolName] = useState("");
  const [grade, setGrade] = useState("");
  const [activityName, setActivityName] = useState("");
  const [activityType, setActivityType] = useState("");
  const [competitionName, setCompetitionName] = useState("");
  const [campName, setCampName] = useState("");
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [tripType, setTripType] = useState<"Family" | "Individual">("Family");
  const [heightInches, setHeightInches] = useState("");
  const [weightLbs, setWeightLbs] = useState("");

  const { applyAction: createTimelineEvent, isPending: isCreatingEvent } = useOsdkAction($Actions.createTimelineEvent);
  const { applyAction: createEducation, isPending: isCreatingEdu } = useOsdkAction($Actions.createEducationRecord);
  const { applyAction: createActivity, isPending: isCreatingAct } = useOsdkAction($Actions.createKidActivity);
  const { applyAction: createCompetition, isPending: isCreatingComp } = useOsdkAction($Actions.createKidCompetition);
  const { applyAction: createCamp, isPending: isCreatingCamp } = useOsdkAction($Actions.createSummerCamp);
  const { applyAction: createTrip, isPending: isCreatingTrip } = useOsdkAction($Actions.createVacationTrip);
  const { applyAction: createGrowth, isPending: isCreatingGrowth } = useOsdkAction($Actions.createGrowthMeasurement);

  const isPending =
    isCreatingEvent ||
    isCreatingEdu ||
    isCreatingAct ||
    isCreatingComp ||
    isCreatingCamp ||
    isCreatingTrip ||
    isCreatingGrowth;

  const resetForm = () => {
    setCategory(defaultCategory ?? "");
    setKidId(defaultKidId ?? "");
    setTitle("");
    setDate("");
    setDescription("");
    setSchoolName("");
    setGrade("");
    setActivityName("");
    setActivityType("");
    setCompetitionName("");
    setCampName("");
    setTripName("");
    setDestination("");
    setTripType("Family");
    setHeightInches("");
    setWeightLbs("");
  };

  const handleSubmit = async () => {
    const isFamilyTrip = category === "Trip" && tripType === "Family";
    if ((!kidId && !isFamilyTrip) || !category || !date) {
      toast.error("Please fill in all required fields");
      return;
    }

    const entityId = generateId();
    const eventTitle =
      title || schoolName || activityName || competitionName || campName || tripName || "Growth Measurement";

    try {
      // Create the category-specific entity
      switch (category) {
        case "Education":
          if (!schoolName) {
            toast.error("School name is required");
            return;
          }
          await createEducation({
            educationId: entityId,
            kidId,
            schoolName,
            grade: grade || undefined,
            startDate: date,
            description: description || undefined,
          });
          break;
        case "Activity":
          if (!activityName || !activityType) {
            toast.error("Activity name and type are required");
            return;
          }
          await createActivity({
            activityId: entityId,
            kidId,
            activityName,
            activityType,
            startDate: date,
            description: description || undefined,
          });
          break;
        case "Competition":
          if (!competitionName) {
            toast.error("Competition name is required");
            return;
          }
          await createCompetition({
            competitionId: entityId,
            kidId,
            competitionName,
            eventDate: date,
            description: description || undefined,
          });
          break;
        case "Camp":
          if (!campName) {
            toast.error("Camp name is required");
            return;
          }
          await createCamp({
            campId: entityId,
            kidId,
            campName,
            startDate: date,
            description: description || undefined,
          });
          break;
        case "Trip":
          if (!tripName || !destination) {
            toast.error("Trip name and destination are required");
            return;
          }
          await createTrip({
            tripId: entityId,
            kidId: tripType === "Family" ? "family" : kidId,
            tripType,
            tripName,
            destination,
            startDate: date,
            description: description || undefined,
          });
          break;
        case "Growth":
          await createGrowth({
            measurementId: entityId,
            kidId,
            measurementDate: date,
            heightInches: heightInches ? parseFloat(heightInches) : undefined,
            weightLbs: weightLbs ? parseFloat(weightLbs) : undefined,
            notes: description || undefined,
          });
          break;
      }

      // Also create a timeline event for everything
      // For family trips, set timeline event kidId to "family" too
      const timelineKidId = category === "Trip" && tripType === "Family" ? "family" : kidId;
      await createTimelineEvent({
        eventId: generateId(),
        kidId: timelineKidId,
        eventDate: date,
        eventTitle,
        eventCategory: category,
        description: description || undefined,
        relatedEntityId: entityId,
      });

      toast.success("Entry added");
      resetForm();
      onOpenChange(false);
    } catch {
      toast.error("Failed to add entry");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-[#FAF4ED] border-[#3B2F2F1F] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
            Add new entry
          </DialogTitle>
          <DialogDescription>Record a new milestone, activity, or measurement</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Kid selector - hidden when Trip category with Family trip type */}
          {!(category === "Trip" && tripType === "Family") && (
            <div className="space-y-2">
              <Label>Kid</Label>
              <Select value={kidId} onValueChange={setKidId}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select kid" />
                </SelectTrigger>
                <SelectContent>
                  {KIDS.map(k => (
                    <SelectItem key={k.value} value={k.value}>
                      {k.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Category selector */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-white" />
          </div>

          {/* Category-specific fields */}
          {category === "Education" && (
            <>
              <div className="space-y-2">
                <Label>School name</Label>
                <Input
                  value={schoolName}
                  onChange={e => setSchoolName(e.target.value)}
                  placeholder="School name"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Grade / Year (optional)</Label>
                <Input
                  value={grade}
                  onChange={e => setGrade(e.target.value)}
                  placeholder="e.g. 1st Grade"
                  className="bg-white"
                />
              </div>
            </>
          )}

          {category === "Activity" && (
            <>
              <div className="space-y-2">
                <Label>Activity name</Label>
                <Input
                  value={activityName}
                  onChange={e => setActivityName(e.target.value)}
                  placeholder="Activity name"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Input
                  value={activityType}
                  onChange={e => setActivityType(e.target.value)}
                  placeholder="e.g. Sports, Music, Art"
                  className="bg-white"
                />
              </div>
            </>
          )}

          {category === "Competition" && (
            <div className="space-y-2">
              <Label>Competition name</Label>
              <Input
                value={competitionName}
                onChange={e => setCompetitionName(e.target.value)}
                placeholder="Competition name"
                className="bg-white"
              />
            </div>
          )}

          {category === "Camp" && (
            <div className="space-y-2">
              <Label>Camp name</Label>
              <Input
                value={campName}
                onChange={e => setCampName(e.target.value)}
                placeholder="Camp name"
                className="bg-white"
              />
            </div>
          )}

          {category === "Trip" && (
            <>
              {/* Trip type selector */}
              <div className="space-y-2">
                <Label>Trip type</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTripType("Family")}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                      tripType === "Family"
                        ? "border-[#E8913A] bg-[#E8913A]/10 text-[#E8913A]"
                        : "border-[#3B2F2F1F] bg-white text-[#6B5B4F] hover:border-[#3B2F2F3F]"
                    }`}
                  >
                    <Home className="size-4" />
                    Family
                  </button>
                  <button
                    type="button"
                    onClick={() => setTripType("Individual")}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                      tripType === "Individual"
                        ? "border-[#E8913A] bg-[#E8913A]/10 text-[#E8913A]"
                        : "border-[#3B2F2F1F] bg-white text-[#6B5B4F] hover:border-[#3B2F2F3F]"
                    }`}
                  >
                    <User className="size-4" />
                    Individual
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Trip name</Label>
                <Input
                  value={tripName}
                  onChange={e => setTripName(e.target.value)}
                  placeholder="Trip name"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Destination</Label>
                <Input
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  placeholder="Destination"
                  className="bg-white"
                />
              </div>
            </>
          )}

          {category === "Growth" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Height (inches)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={heightInches}
                  onChange={e => setHeightInches(e.target.value)}
                  placeholder="Height"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Weight (lbs)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={weightLbs}
                  onChange={e => setWeightLbs(e.target.value)}
                  placeholder="Weight"
                  className="bg-white"
                />
              </div>
            </div>
          )}

          {/* Title override (for non-category specific title) */}
          {category && category !== "Growth" && (
            <div className="space-y-2">
              <Label>Timeline title (optional)</Label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Override the timeline event title"
                className="bg-white"
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add details, memories, or notes..."
              className="bg-white min-h-[80px]"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isPending || (!kidId && !(category === "Trip" && tripType === "Family")) || !category || !date}
            className="w-full bg-[#E8913A] hover:bg-[#d4822e] text-white"
          >
            {isPending ? "Adding..." : "Add entry"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
