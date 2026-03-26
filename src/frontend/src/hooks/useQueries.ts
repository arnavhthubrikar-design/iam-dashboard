import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AccessRequest,
  AuditLog,
  Permission,
  Policy,
  Role,
  User,
} from "../backend";
import {
  sampleAccessRequests,
  sampleAuditLogs,
  samplePermissions,
  samplePolicies,
  sampleRoles,
  sampleUsers,
} from "../data/sampleData";
import { useActor } from "./useActor";

const USERS_STORAGE_KEY = "apex_iam_users";

function saveUsersToStorage(users: User[]) {
  try {
    const serializable = users.map((u) => ({ ...u, id: u.id.toString() }));
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(serializable));
  } catch {
    // ignore storage errors
  }
}

function loadUsersFromStorage(): User[] | null {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Array<Record<string, unknown>>;
    return parsed.map((u) => ({ ...u, id: BigInt(u.id as string) })) as User[];
  } catch {
    return null;
  }
}

function useActorQuery<T>(
  key: string[],
  fn: (actor: any) => Promise<T>,
  fallback: T,
) {
  const { actor, isFetching } = useActor();
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      if (!actor) return fallback;
      try {
        return await fn(actor);
      } catch {
        return fallback;
      }
    },
    enabled: !isFetching,
    initialData: fallback,
  });
}

export function useGetUsers() {
  const { actor, isFetching } = useActor();
  const stored = loadUsersFromStorage();
  const fallback = stored ?? sampleUsers;

  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      if (!actor) return fallback;
      try {
        return await actor.getUsers();
      } catch {
        return fallback;
      }
    },
    enabled: !isFetching,
    initialData: fallback,
  });
}

export function useGetRoles() {
  return useActorQuery<Role[]>(["roles"], (a) => a.getRoles(), sampleRoles);
}
export function useGetPermissions() {
  return useActorQuery<Permission[]>(
    ["permissions"],
    (a) => a.getPermissions(),
    samplePermissions,
  );
}
export function useGetAccessRequests() {
  return useActorQuery<AccessRequest[]>(
    ["accessRequests"],
    (a) => a.getAccessRequests(),
    sampleAccessRequests,
  );
}
export function useGetAuditLogs() {
  return useActorQuery<AuditLog[]>(
    ["auditLogs"],
    (a) => a.getAuditLogs(),
    sampleAuditLogs,
  );
}
export function useGetPolicies() {
  return useActorQuery<Policy[]>(
    ["policies"],
    (a) => a.getPolicies(),
    samplePolicies,
  );
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      role: string;
      department: string;
    }) => {
      const today = new Date().toISOString().slice(0, 10);
      const current = qc.getQueryData<User[]>(["users"]) ?? sampleUsers;
      const maxId = current.reduce((m, u) => (u.id > m ? u.id : m), 0n);
      const newUser: User = {
        id: maxId + 1n,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        status: "active",
        createdAt: today,
        lastLogin: "Never",
      };
      const updated = [...current, newUser];
      qc.setQueryData<User[]>(["users"], updated);
      saveUsersToStorage(updated);
      return newUser;
    },
  });
}

export function useUpdateUserStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: string }) => {
      if (!actor) {
        const current = qc.getQueryData<User[]>(["users"]) ?? sampleUsers;
        const updated = current.map((u) =>
          u.id === id ? { ...u, status } : u,
        );
        qc.setQueryData<User[]>(["users"], updated);
        saveUsersToStorage(updated);
        return;
      }
      return actor.updateUserStatus(id, status);
    },
    onSuccess: () => {
      if (actor) qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useCreateRole() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.createRole(data.name, data.description);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roles"] }),
  });
}

export function useUpdateAccessRequest() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      resolvedBy,
    }: { id: bigint; status: string; resolvedBy: string }) => {
      if (!actor) {
        const current =
          qc.getQueryData<AccessRequest[]>(["accessRequests"]) ??
          sampleAccessRequests;
        qc.setQueryData<AccessRequest[]>(
          ["accessRequests"],
          current.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status,
                  resolvedBy,
                  resolvedAt: new Date().toISOString(),
                }
              : r,
          ),
        );
        return;
      }
      return actor.updateAccessRequestStatus(id, status, resolvedBy);
    },
    onSuccess: () => {
      if (actor) qc.invalidateQueries({ queryKey: ["accessRequests"] });
    },
  });
}

export function useCreatePolicy() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      rules: string;
      priority: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createPolicy(
        data.name,
        data.description,
        data.rules,
        data.priority,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["policies"] }),
  });
}

export function useUpdatePolicyStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.updatePolicyStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["policies"] }),
  });
}
