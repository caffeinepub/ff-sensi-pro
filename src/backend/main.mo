import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Int "mo:core/Int";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  let approvalState = UserApproval.initState(accessControlState);

  public type DeviceDetails = {
    ramGb : Nat;
    deviceModel : Text;
    screenSizeInches : Nat;
  };

  // Legacy type kept for stable variable compatibility during upgrade
  type LegacySensitivitySettings = {
    sensitivity : Nat;
    dpi : Nat;
    fireButtonSize : Nat;
    gameBoosterTips : Text;
    deviceDetails : DeviceDetails;
  };

  public type SensitivitySettings = {
    generalSensitivity : Nat;
    noScopeSensitivity : Nat;
    redDotSensitivity : Nat;
    scope2xSensitivity : Nat;
    scope4xSensitivity : Nat;
    awmScopeSensitivity : Nat;
    fireButtonSize : Nat;
    gameBoosterTips : Text;
    deviceDetails : DeviceDetails;
  };

  public type PaymentRequestStatus = {
    #pending;
    #approved;
  };

  public type PaymentRequest = {
    user : Principal;
    paymentReference : Text;
    status : PaymentRequestStatus;
    createdAt : Int;
  };

  // Old stable map retained with legacy type so upgrade checker is satisfied
  let settingsMap = Map.empty<Principal, LegacySensitivitySettings>();

  // New stable map for the updated sensitivity schema
  let settingsMapV2 = Map.empty<Principal, SensitivitySettings>();

  let paymentRequests = Map.empty<Nat, PaymentRequest>();
  var nextPaymentRequestId = 0;

  module PaymentRequest {
    public func compare(request1 : PaymentRequest, request2 : PaymentRequest) : Order.Order {
      Nat.compare(
        request1.createdAt.toNat(),
        request2.createdAt.toNat(),
      );
    };
  };

  // Migrate any legacy entries into the new map
  system func postupgrade() {
    for ((k, old) in settingsMap.entries()) {
      if (settingsMapV2.get(k) == null) {
        let migrated = calculateSensitivity(old.deviceDetails);
        settingsMapV2.add(k, migrated);
      };
    };
  };

  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  func calculateSensitivity(device : DeviceDetails) : SensitivitySettings {
    let base : Nat = if (device.ramGb >= 16) {
      65;
    } else if (device.ramGb >= 8) {
      58;
    } else if (device.ramGb >= 6) {
      50;
    } else if (device.ramGb >= 4) {
      42;
    } else {
      35;
    };

    let generalSensitivity = base;
    let noScopeSensitivity = if (base > 5) { base - 5 } else { base };
    let redDotSensitivity = if (base > 8) { base - 8 } else { base };
    let scope2xSensitivity = if (base > 12) { base - 12 } else { base };
    let scope4xSensitivity = if (base > 18) { base - 18 } else { base };
    let awmScopeSensitivity = if (base > 25) { base - 25 } else { base };

    let fireButtonSize = if (device.screenSizeInches >= 30) {
      45;
    } else if (device.screenSizeInches >= 24) {
      35;
    } else {
      25;
    };

    let gameBoosterTips = if (device.ramGb >= 16) {
      "Your PC is powerful. Run Free Fire emulator in high graphics mode with performance mode enabled.";
    } else if (device.ramGb >= 8) {
      "Enable performance mode in emulator settings and close heavy background apps for smooth gameplay.";
    } else if (device.ramGb >= 6) {
      "Set emulator graphics to medium and close background apps for optimal Free Fire performance.";
    } else if (device.ramGb >= 4) {
      "Use low graphics settings and reduce emulator virtual memory usage for best results.";
    } else {
      "Consider upgrading RAM for a better Free Fire experience on PC.";
    };

    {
      generalSensitivity;
      noScopeSensitivity;
      redDotSensitivity;
      scope2xSensitivity;
      scope4xSensitivity;
      awmScopeSensitivity;
      fireButtonSize;
      gameBoosterTips;
      deviceDetails = device;
    };
  };

  public shared ({ caller }) func submitDeviceDetails(device : DeviceDetails) : async SensitivitySettings {
    let settings = calculateSensitivity(device);
    settingsMapV2.add(caller, settings);
    settings;
  };

  public query ({ caller }) func getSensitivitySettings() : async SensitivitySettings {
    switch (settingsMapV2.get(caller)) {
      case (null) { Runtime.trap("No sensitivity settings found. Please submit device details first.") };
      case (?settings) { settings };
    };
  };

  public shared ({ caller }) func submitPaymentRequest(paymentReference : Text) : async Nat {
    let request : PaymentRequest = {
      user = caller;
      paymentReference;
      status = #pending;
      createdAt = Time.now();
    };
    paymentRequests.add(nextPaymentRequestId, request);
    nextPaymentRequestId += 1;
    nextPaymentRequestId - 1;
  };

  public query ({ caller }) func getPaymentRequest(requestId : Nat) : async PaymentRequest {
    switch (paymentRequests.get(requestId)) {
      case (null) { Runtime.trap("Payment request not found") };
      case (?request) {
        if (caller != request.user and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own payment requests");
        };
        request;
      };
    };
  };

  public query ({ caller }) func getAllPaymentRequests() : async [PaymentRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    paymentRequests.values().toArray().sort();
  };

  public shared ({ caller }) func approvePaymentRequest(requestId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (paymentRequests.get(requestId)) {
      case (null) { Runtime.trap("Payment request not found") };
      case (?request) {
        paymentRequests.add(requestId, { request with status = #approved });
        UserApproval.setApproval(approvalState, request.user, #approved);
      };
    };
  };

  public shared ({ caller }) func revokeAccess(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, #rejected);
  };
};
