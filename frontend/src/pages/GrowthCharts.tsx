import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Ruler, Weight, TrendingUp } from "lucide-react";
import { formatDate } from "@/lib/constants";
import { useKids } from "@/api/hooks/useKids";
import { useGrowth, GrowthMeasurement } from "@/api/hooks/useGrowth";

const CHART_COLORS = ["#E8913A", "#8B6BAE", "#5B9A6F", "#D4793A", "#4A7FB5", "#D4697A", "#C4A43E"];

export function GrowthCharts() {
  const [kidFilter, setKidFilter] = useState("all");
  const { data: kids, isLoading: kidsLoading } = useKids();

  // Fetch growth data per kid
  const kid0 = kids?.[0];
  const kid1 = kids?.[1];
  const { data: growth0, isLoading: g0Loading } = useGrowth(kid0?.id);
  const { data: growth1, isLoading: g1Loading } = useGrowth(kid1?.id);

  const isLoading = kidsLoading || g0Loading || g1Loading;

  // Build per-kid measurement map
  const kidMeasurements = useMemo(() => {
    const map = new Map<string, GrowthMeasurement[]>();
    if (kid0 && growth0) map.set(kid0.id, [...growth0].sort((a, b) => a.measurementDate.localeCompare(b.measurementDate)));
    if (kid1 && growth1) map.set(kid1.id, [...growth1].sort((a, b) => a.measurementDate.localeCompare(b.measurementDate)));
    return map;
  }, [kid0, kid1, growth0, growth1]);

  // Build chart data
  const buildChartData = (field: "heightInches" | "weightLbs") => {
    const targetKids = kidFilter === "all" ? (kids ?? []) : (kids ?? []).filter(k => k.id === kidFilter);
    const points: Array<Record<string, unknown>> = [];
    for (const kid of targetKids) {
      const measurements = kidMeasurements.get(kid.id) ?? [];
      for (const m of measurements) {
        if (m[field] != null) {
          points.push({
            date: formatDate(m.measurementDate),
            rawDate: m.measurementDate,
            [kid.firstName]: m[field],
          });
        }
      }
    }
    points.sort((a, b) => String(a.rawDate).localeCompare(String(b.rawDate)));
    return points;
  };

  const heightData = buildChartData("heightInches");
  const weightData = buildChartData("weightLbs");

  const visibleKids = kidFilter === "all" ? (kids ?? []) : (kids ?? []).filter(k => k.id === kidFilter);

  // Latest measurement per kid
  const getLatest = (kidId: string) => {
    const m = kidMeasurements.get(kidId);
    return m && m.length > 0 ? m[m.length - 1] : null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">Growth Charts</h1>
          <p className="text-[#6B5B4F] mt-1">Track height and weight over time</p>
        </div>
        <Select value={kidFilter} onValueChange={setKidFilter}>
          <SelectTrigger className="w-[160px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All kids</SelectItem>
            {(kids ?? []).map(k => (
              <SelectItem key={k.id} value={k.id}>{k.firstName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Latest Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleKids.map((kid, idx) => {
          const latest = getLatest(kid.id);
          const color = CHART_COLORS[idx % CHART_COLORS.length];
          return (
            <Card key={kid.id} className="border-[#3B2F2F1F] bg-white">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                    style={{
                      backgroundColor: color,
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontWeight: 700,
                    }}
                  >
                    {kid.firstName.charAt(0)}
                  </div>
                  <span className="font-medium">{kid.firstName} &mdash; Latest</span>
                </div>
                {latest ? (
                  <div className="flex gap-6">
                    {latest.heightInches != null && (
                      <div className="flex items-center gap-2">
                        <Ruler className="size-4 text-[#D4697A]" />
                        <span className="text-2xl font-semibold tabular-nums">{latest.heightInches}&quot;</span>
                      </div>
                    )}
                    {latest.weightLbs != null && (
                      <div className="flex items-center gap-2">
                        <Weight className="size-4 text-[#D4697A]" />
                        <span className="text-2xl font-semibold tabular-nums">{latest.weightLbs} lbs</span>
                      </div>
                    )}
                    <span className="text-xs text-[#6B5B4F] self-end">{formatDate(latest.measurementDate)}</span>
                  </div>
                ) : (
                  <p className="text-sm text-[#6B5B4F]">No measurements yet</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Height Chart */}
      <Card className="border-[#3B2F2F1F] bg-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Ruler className="size-5 text-[#D4697A]" />
            <h3>Height over time (inches)</h3>
          </div>
          {isLoading ? (
            <Skeleton className="h-64 rounded-xl" />
          ) : heightData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={heightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,47,47,0.1)" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6B5B4F" }} />
                <YAxis tick={{ fontSize: 12, fill: "#6B5B4F" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FAF4ED",
                    border: "1px solid #3B2F2F1F",
                    borderRadius: "8px",
                    fontFamily: "'Source Sans 3', sans-serif",
                  }}
                />
                <Legend />
                {visibleKids.map((kid, idx) => (
                  <Line
                    key={kid.id}
                    type="monotone"
                    dataKey={kid.firstName}
                    stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS[idx % CHART_COLORS.length], r: 4 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-[#6B5B4F]">
              <TrendingUp className="size-10 opacity-30 mb-3" />
              <p>No height data to display</p>
              <p className="text-sm mt-1">Add growth measurements to see the chart</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weight Chart */}
      <Card className="border-[#3B2F2F1F] bg-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Weight className="size-5 text-[#D4697A]" />
            <h3>Weight over time (lbs)</h3>
          </div>
          {isLoading ? (
            <Skeleton className="h-64 rounded-xl" />
          ) : weightData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,47,47,0.1)" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6B5B4F" }} />
                <YAxis tick={{ fontSize: 12, fill: "#6B5B4F" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FAF4ED",
                    border: "1px solid #3B2F2F1F",
                    borderRadius: "8px",
                    fontFamily: "'Source Sans 3', sans-serif",
                  }}
                />
                <Legend />
                {visibleKids.map((kid, idx) => (
                  <Line
                    key={kid.id}
                    type="monotone"
                    dataKey={kid.firstName}
                    stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS[idx % CHART_COLORS.length], r: 4 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-[#6B5B4F]">
              <TrendingUp className="size-10 opacity-30 mb-3" />
              <p>No weight data to display</p>
              <p className="text-sm mt-1">Add growth measurements to see the chart</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
