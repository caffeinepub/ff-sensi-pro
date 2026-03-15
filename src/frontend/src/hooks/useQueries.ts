import type { DeviceDetails } from "@/backend.d";
import { useActor } from "@/hooks/useActor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsApproved() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isApproved"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerApproved();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSensitivitySettings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["sensitivitySettings"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getSensitivitySettings();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllPaymentRequests() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["paymentRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPaymentRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListApprovals() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["approvals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitDeviceDetails() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (device: DeviceDetails) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitDeviceDetails(device);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sensitivitySettings"] });
    },
  });
}

export function useSubmitPaymentRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (paymentReference: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitPaymentRequest(paymentReference);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentRequests"] });
    },
  });
}

export function useApprovePaymentRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.approvePaymentRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentRequests"] });
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
    },
  });
}

export function useRevokeAccess() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: import("@icp-sdk/core/principal").Principal) => {
      if (!actor) throw new Error("Not connected");
      return actor.revokeAccess(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      queryClient.invalidateQueries({ queryKey: ["paymentRequests"] });
    },
  });
}
