import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";

export interface Activity {
  id: string;
  kidId: string;
  activityName: string;
  activityType: string;
  provider: string | null;
  startDate: string;
  endDate: string | null;
  dayOfWeek: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityInput {
  activityName: string;
  activityType: string;
  provider?: string;
  startDate: string;
  endDate?: string;
  dayOfWeek?: string;
  description?: string;
}

export function useActivities(kidId: string | undefined) {
  return useQuery({
    queryKey: ["activities", kidId],
    queryFn: async () => {
      const { data } = await apiClient.get<Activity[]>(`/api/kids/${kidId}/activities`);
      return data;
    },
    enabled: !!kidId,
  });
}

export function useCreateActivity(kidId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateActivityInput) => {
      const { data } = await apiClient.post<Activity>(`/api/kids/${kidId}/activities`, input);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activities", kidId] });
      qc.invalidateQueries({ queryKey: ["timeline"] });
    },
  });
}

export function useUpdateActivity(kidId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CreateActivityInput> & { id: string }) => {
      const { data } = await apiClient.put<Activity>(`/api/kids/${kidId}/activities/${id}`, input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["activities", kidId] }),
  });
}

export function useDeleteActivity(kidId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/kids/${kidId}/activities/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activities", kidId] });
      qc.invalidateQueries({ queryKey: ["timeline"] });
    },
  });
}
