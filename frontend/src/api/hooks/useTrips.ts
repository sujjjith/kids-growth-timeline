import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../client";

export interface Trip {
  id: string;
  kidId: string | null;
  userId: string;
  tripType: string;
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string | null;
  highlights: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripInput {
  tripType: string;
  kidId?: string;
  tripName: string;
  destination: string;
  startDate: string;
  endDate?: string;
  highlights?: string;
  description?: string;
}

export function useTrips() {
  return useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      const { data } = await apiClient.get<Trip[]>("/api/trips");
      return data;
    },
  });
}

export function useTrip(id: string | undefined) {
  return useQuery({
    queryKey: ["trips", id],
    queryFn: async () => {
      const { data } = await apiClient.get<Trip>(`/api/trips/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateTripInput) => {
      const { data } = await apiClient.post<Trip>("/api/trips", input);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["trips"] });
      qc.invalidateQueries({ queryKey: ["timeline"] });
    },
  });
}

export function useUpdateTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CreateTripInput> & { id: string }) => {
      const { data } = await apiClient.put<Trip>(`/api/trips/${id}`, input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["trips"] }),
  });
}

export function useDeleteTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/trips/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["trips"] });
      qc.invalidateQueries({ queryKey: ["timeline"] });
    },
  });
}
