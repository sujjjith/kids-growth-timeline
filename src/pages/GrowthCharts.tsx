import { useState } from "react";
import { useOsdkObjects } from "@osdk/react/experimental";
import { growthMeasurement } from "../../.osdk/src";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Ruler, Weight, TrendingUp } from "lucide-react";
import { formatDate } from "@/lib/constants";

export function GrowthCharts() {
  const [kidFilter, setKidFilter] = useState("all");

  const { data: nirekMeasurements, isLoading: nirekLoading } = useOsdkObjects(growthMeasurement, {
    where: { kidId: { $eq: "nirek" } },
    orderBy: { measurementDate: "asc" },
    pageSize: 200,
  });

  const { data: mishkaMeasurements, isLoading: mishkaLoading } = useOsdkObjects(growthMeasurement, {
    where: { kidId: { $eq: "mishka" } },
    orderBy: { measurementDate: "asc" },
    pageSize: 200,
  });

  const isLoading = nirekLoading || mishkaLoading;

  // Prepare chart data for height
  const nirekHeightData = (nirekMeasurements ?? [])
    .filter(m => m.heightInches != null)
    .map(m => ({
      date: formatDate(m.measurementDate),
      rawDate: m.measurementDate ?? "",
      Nirek: m.heightInches,
    }));

  const mishkaHeightData = (mishkaMeasurements ?? [])
    .filter(m => m.heightInches != null)
    .map(m => ({
      date: formatDate(m.measurementDate),
      rawDate: m.measurementDate ?? "",
      Mishka: m.heightInches,
    }));

  // Prepare chart data for weight
  const nirekWeightData = (nirekMeasurements ?? [])
    .filter(m => m.weightLbs != null)
    .map(m => ({
      date: formatDate(m.measurementDate),
      rawDate: m.measurementDate ?? "",
      Nirek: m.weightLbs,
    }));

  const mishkaWeightData = (mishkaMeasurements ?? [])
    .filter(m => m.weightLbs != null)
    .map(m => ({
      date: formatDate(m.measurementDate),
      rawDate: m.measurementDate ?? "",
      Mishka: m.weightLbs,
    }));

  // Merge data for combined view
  const mergeData = (nirekData: Array<Record<string, unknown>>, mishkaData: Array<Record<string, unknown>>) => {
    const all = [...nirekData.map(d => ({ ...d })), ...mishkaData.map(d => ({ ...d }))];
    // Sort by raw date
    all.sort((a, b) => String(a.rawDate).localeCompare(String(b.rawDate)));
    return all;
  };

  const getHeightData = () => {
    if (kidFilter === "nirek") return nirekHeightData;
    if (kidFilter === "mishka") return mishkaHeightData;
    return mergeData(nirekHeightData, mishkaHeightData);
  };

  const getWeightData = () => {
    if (kidFilter === "nirek") return nirekWeightData;
    if (kidFilter === "mishka") return mishkaWeightData;
    return mergeData(nirekWeightData, mishkaWeightData);
  };

  const heightData = getHeightData();
  const weightData = getWeightData();

  const showNirek = kidFilter === "all" || kidFilter === "nirek";
  const showMishka = kidFilter === "all" || kidFilter === "mishka";

  // Get latest measurements
  const latestNirek =
    nirekMeasurements && nirekMeasurements.length > 0 ? nirekMeasurements[nirekMeasurements.length - 1] : null;
  const latestMishka =
    mishkaMeasurements && mishkaMeasurements.length > 0 ? mishkaMeasurements[mishkaMeasurements.length - 1] : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">Growth Charts</h1>
          <p className="text-[#6B5B4F] mt-1">Track height and weight over time</p>
        </div>
        <Select value={kidFilter} onValueChange={setKidFilter}>
          <SelectTrigger className="w-[140px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Both kids</SelectItem>
            <SelectItem value="nirek">Nirek</SelectItem>
            <SelectItem value="mishka">Mishka</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Latest Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {showNirek && (
          <Card className="border-[#3B2F2F1F] bg-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                  style={{
                    backgroundColor: "#E8913A",
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontWeight: 700,
                  }}
                >
                  N
                </div>
                <span className="font-medium">Nirek &mdash; Latest</span>
              </div>
              {latestNirek ? (
                <div className="flex gap-6">
                  {latestNirek.heightInches != null && (
                    <div className="flex items-center gap-2">
                      <Ruler className="size-4 text-[#D4697A]" />
                      <span className="text-2xl font-semibold tabular-nums">{latestNirek.heightInches}&quot;</span>
                    </div>
                  )}
                  {latestNirek.weightLbs != null && (
                    <div className="flex items-center gap-2">
                      <Weight className="size-4 text-[#D4697A]" />
                      <span className="text-2xl font-semibold tabular-nums">{latestNirek.weightLbs} lbs</span>
                    </div>
                  )}
                  <span className="text-xs text-[#6B5B4F] self-end">{formatDate(latestNirek.measurementDate)}</span>
                </div>
              ) : (
                <p className="text-sm text-[#6B5B4F]">No measurements yet</p>
              )}
            </CardContent>
          </Card>
        )}
        {showMishka && (
          <Card className="border-[#3B2F2F1F] bg-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                  style={{
                    backgroundColor: "#8B6BAE",
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontWeight: 700,
                  }}
                >
                  M
                </div>
                <span className="font-medium">Mishka &mdash; Latest</span>
              </div>
              {latestMishka ? (
                <div className="flex gap-6">
                  {latestMishka.heightInches != null && (
                    <div className="flex items-center gap-2">
                      <Ruler className="size-4 text-[#D4697A]" />
                      <span className="text-2xl font-semibold tabular-nums">{latestMishka.heightInches}&quot;</span>
                    </div>
                  )}
                  {latestMishka.weightLbs != null && (
                    <div className="flex items-center gap-2">
                      <Weight className="size-4 text-[#D4697A]" />
                      <span className="text-2xl font-semibold tabular-nums">{latestMishka.weightLbs} lbs</span>
                    </div>
                  )}
                  <span className="text-xs text-[#6B5B4F] self-end">{formatDate(latestMishka.measurementDate)}</span>
                </div>
              ) : (
                <p className="text-sm text-[#6B5B4F]">No measurements yet</p>
              )}
            </CardContent>
          </Card>
        )}
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
                {showNirek && (
                  <Line
                    type="monotone"
                    dataKey="Nirek"
                    stroke="#E8913A"
                    strokeWidth={2}
                    dot={{ fill: "#E8913A", r: 4 }}
                    connectNulls
                  />
                )}
                {showMishka && (
                  <Line
                    type="monotone"
                    dataKey="Mishka"
                    stroke="#8B6BAE"
                    strokeWidth={2}
                    dot={{ fill: "#8B6BAE", r: 4 }}
                    connectNulls
                  />
                )}
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
                {showNirek && (
                  <Line
                    type="monotone"
                    dataKey="Nirek"
                    stroke="#E8913A"
                    strokeWidth={2}
                    dot={{ fill: "#E8913A", r: 4 }}
                    connectNulls
                  />
                )}
                {showMishka && (
                  <Line
                    type="monotone"
                    dataKey="Mishka"
                    stroke="#8B6BAE"
                    strokeWidth={2}
                    dot={{ fill: "#8B6BAE", r: 4 }}
                    connectNulls
                  />
                )}
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
