import { useQuery } from "@tanstack/react-query";
import apiClient from "../client";

export interface TimelineEvent {
  id: string;
  kidId: string | null;
  userId: string;
  eventDate: string;
  eventTitle: string;
  eventCategory: string;
  description: string | null;
  relatedEntityId: string | null;
  createdAt: string;
}

export function useTimeline(kidId?: string, category?: string) {
  return useQuery({
    queryKey: ["timeline", kidId, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (kidId) params.set("kidId", kidId);
      if (category) params.set("category", category);
      const qs = params.toString();
      const { data } = await apiClient.get<TimelineEvent[]>(`/api/timeline${qs ? `?${qs}` : ""}`);
      return data;
    },
  });
}
