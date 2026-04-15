import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";

export interface Kid {
  id: string;
  userId: string;
  firstName: string;
  lastName: string | null;
  dateOfBirth: string;
  gender: string;
  nickname: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKidInput {
  firstName: string;
  lastName?: string;
  dateOfBirth: string;
  gender: string;
  nickname?: string;
  notes?: string;
}

export function useKids() {
  return useQuery({
    queryKey: ["kids"],
    queryFn: async () => {
      const { data } = await apiClient.get<Kid[]>("/api/kids");
      return data;
    },
  });
}

export function useKid(id: string | undefined) {
  return useQuery({
    queryKey: ["kids", id],
    queryFn: async () => {
      const { data } = await apiClient.get<Kid>(`/api/kids/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateKid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateKidInput) => {
      const { data } = await apiClient.post<Kid>("/api/kids", input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["kids"] }),
  });
}

export function useUpdateKid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: CreateKidInput & { id: string }) => {
      const { data } = await apiClient.put<Kid>(`/api/kids/${id}`, input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["kids"] }),
  });
}

export function useDeleteKid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/kids/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["kids"] }),
  });
}
