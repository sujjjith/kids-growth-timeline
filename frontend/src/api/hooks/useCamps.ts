import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";

export interface Camp {
  id: string;
  kidId: string;
  campName: string;
  campType: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  highlights: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampInput {
  campName: string;
  campType?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  highlights?: string;
  description?: string;
}

export function useCamps(kidId: string | undefined) {
  return useQuery({
    queryKey: ["camps", kidId],
    queryFn: async () => {
      const { data } = await apiClient.get<Camp[]>(`/api/kids/${kidId}/camps`);
      return data;
    },
    enabled: !!kidId,
  });
}

export function useCreateCamp(kidId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCampInput) => {
      const { data } = await apiClient.post<Camp>(`/api/kids/${kidId}/camps`, input);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["camps", kidId] });
      qc.invalidateQueries({ queryKey: ["timeline"] });
    },
  });
}

export function useUpdateCamp(kidId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CreateCampInput> & { id: string }) => {
      const { data } = await apiClient.put<Camp>(`/api/kids/${kidId}/camps/${id}`, input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["camps", kidId] }),
  });
}

export function useDeleteCamp(kidId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/kids/${kidId}/camps/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["camps", kidId] });
      qc.invalidateQueries({ queryKey: ["timeline"] });
    },
  });
}
