import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";

export interface Competition {
  id: string;
  kidId: string;
  competitionName: string;
  competitionType: string | null;
  eventDate: string;
  result: string | null;
  placement: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompetitionInput {
  competitionName: string;
  competitionType?: string;
  eventDate: string;
  result?: string;
  placement?: string;
  description?: string;
}

export function useCompetitions(kidId: string | undefined) {
  return useQuery({
    queryKey: ["competitions", kidId],
    queryFn: async () => {
      const { data } = await apiClient.get<Competition[]>(`/api/kids/${kidId}/competitions`);
      return data;
    },
    enabled: !!kidId,
  });
}

export function useCreateCompetition(kidId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCompetitionInput) => {
      const { data } = await apiClient.post<Competition>(`/api/kids/${kidId}/competitions`, input);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["competitions", kidId] });
      qc.invalidateQueries({ queryKey: ["timeline"] });
    },
  });
}

export function useUpdateCompetition(kidId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CreateCompetitionInput> & { id: string }) => {
      const { data } = await apiClient.put<Competition>(`/api/kids/${kidId}/competitions/${id}`, input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["competitions", kidId] }),
  });
}

export function useDeleteCompetition(kidId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/kids/${kidId}/competitions/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["competitions", kidId] });
      qc.invalidateQueries({ queryKey: ["timeline"] });
    },
  });
}
