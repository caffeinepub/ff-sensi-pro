import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface PaymentRequest {
    status: PaymentRequestStatus;
    createdAt: bigint;
    user: Principal;
    paymentReference: string;
}
export interface SensitivitySettings {
    dpi: bigint;
    deviceDetails: DeviceDetails;
    gameBoosterTips: string;
    sensitivity: bigint;
    fireButtonSize: bigint;
}
export interface DeviceDetails {
    ramGb: bigint;
    screenSizeInches: bigint;
    deviceModel: string;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum PaymentRequestStatus {
    pending = "pending",
    approved = "approved"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approvePaymentRequest(requestId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllPaymentRequests(): Promise<Array<PaymentRequest>>;
    getCallerUserRole(): Promise<UserRole>;
    getPaymentRequest(requestId: bigint): Promise<PaymentRequest>;
    getSensitivitySettings(): Promise<SensitivitySettings>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    requestApproval(): Promise<void>;
    revokeAccess(user: Principal): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    submitDeviceDetails(device: DeviceDetails): Promise<SensitivitySettings>;
    submitPaymentRequest(paymentReference: string): Promise<bigint>;
}
