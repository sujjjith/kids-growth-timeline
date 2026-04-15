import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";

export interface GrowthMeasurement {
  id: string;
  kidId: string;
  measurementDate: string;
  heightInches: number | null;
  weightLbs: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGrowthInput {
  measurementDate: string;
  heightInches?: number;
  weightLbs?: number;
  notes?: string;
}

export function useGrowth(kidId: string | undefined) {
  return useQuery({
    queryKey: ["growth", kidId],
    queryFn: async () => {
      const { data } = await apiClient.get<GrowthMeasurement[]>(`/api/kids/${kidId}/growth`);
      return data;
    },
    enabled: !!kidId,
  });
}

export function useCreateGrowth(kidId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateGrowthInput) => {
      const { data } = await apiClient.post<GrowthMeasurement>(`/api/kids/${kidId}/growth`, input);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["growth", kidId] });
      qc.invalidateQueries({ queryKey: ["timeline"] });
    },
  });
}

export function useUpdateGrowth(kidId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CreateGrowthInput> & { id: string }) => {
      const { data } = await apiClient.put<GrowthMeasurement>(`/api/kids/${kidId}/growth/${id}`, input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["growth", kidId] }),
  });
}

export function useDeleteGrowth(kidId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/kids/${kidId}/growth/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["growth", kidId] });
      qc.invalidateQueries({ queryKey: ["timeline"] });
    },
  });
}
