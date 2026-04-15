import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";

export interface EducationRecord {
  id: string;
  kidId: string;
  schoolName: string;
  grade: string | null;
  startDate: string;
  endDate: string | null;
  achievement: string | null;
  description: string | null;
  category: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEducationInput {
  schoolName: string;
  grade?: string;
  startDate: string;
  endDate?: string;
  achievement?: string;
  description?: string;
  category?: string;
}

export function useEducation(kidId: string | undefined) {
  return useQuery({
    queryKey: ["education", kidId],
    queryFn: async () => {
      const { data } = await apiClient.get<EducationRecord[]>(`/api/kids/${kidId}/education`);
      return data;
    },
    enabled: !!kidId,
  });
}

export function useCreateEducation(kidId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateEducationInput) => {
      const { data } = await apiClient.post<EducationRecord>(`/api/kids/${kidId}/education`, input);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["education", kidId] });
      qc.invalidateQueries({ queryKey: ["timeline"] });
    },
  });
}

export function useUpdateEducation(kidId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CreateEducationInput> & { id: string }) => {
      const { data } = await apiClient.put<EducationRecord>(`/api/kids/${kidId}/education/${id}`, input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["education", kidId] }),
  });
}

export function useDeleteEducation(kidId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/kids/${kidId}/education/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["education", kidId] });
      qc.invalidateQueries({ queryKey: ["timeline"] });
    },
  });
}
