import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AccessRequest {
    id: bigint;
    status: string;
    resourceName: string;
    requesterName: string;
    requestType: string;
    requestedAt: string;
    resolvedAt: string;
    resolvedBy: string;
    reason: string;
}
export interface AuditLog {
    id: bigint;
    status: string;
    userName: string;
    resource: string;
    action: string;
    timestamp: string;
    ipAddress: string;
}
export interface Policy {
    id: bigint;
    status: string;
    name: string;
    createdAt: string;
    description: string;
    priority: bigint;
    rules: string;
}
export interface Permission {
    id: bigint;
    resource: string;
    name: string;
    description: string;
    category: string;
}
export interface User {
    id: bigint;
    status: string;
    name: string;
    createdAt: string;
    role: string;
    email: string;
    department: string;
    lastLogin: string;
}
export interface Role {
    id: bigint;
    permissions: Array<string>;
    name: string;
    createdAt: string;
    memberCount: bigint;
    description: string;
}
export interface backendInterface {
    createAccessRequest(requesterName: string, resourceName: string, requestType: string, reason: string): Promise<bigint>;
    createPolicy(name: string, description: string, rules: string, priority: bigint): Promise<bigint>;
    createRole(name: string, description: string): Promise<bigint>;
    createUser(name: string, email: string, role: string, department: string): Promise<bigint>;
    getAccessRequests(): Promise<Array<AccessRequest>>;
    getAuditLogs(): Promise<Array<AuditLog>>;
    getPermissions(): Promise<Array<Permission>>;
    getPolicies(): Promise<Array<Policy>>;
    getRoles(): Promise<Array<Role>>;
    getUsers(): Promise<Array<User>>;
    updateAccessRequestStatus(id: bigint, status: string, resolvedBy: string): Promise<void>;
    updatePolicyStatus(id: bigint, status: string): Promise<void>;
    updateUserStatus(id: bigint, status: string): Promise<void>;
}
