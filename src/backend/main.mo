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
  // Mix in authorization using persistent state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Initialize user approval state
  let approvalState = UserApproval.initState(accessControlState);

  public type DeviceDetails = {
    ramGb : Nat; // RAM in GB
    deviceModel : Text;
    screenSizeInches : Nat;
  };

  public type SensitivitySettings = {
    sensitivity : Nat; // (0-200)
    dpi : Nat; // (0-1000)
    fireButtonSize : Nat; // (0-50)
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

  // User sensitivity settings storage
  let settingsMap = Map.empty<Principal, SensitivitySettings>();

  // Payment requests storage
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
    let sensitivity = if (device.ramGb >= 8) {
      180;
    } else if (device.ramGb >= 6) {
      160;
    } else if (device.ramGb >= 4) {
      120;
    } else {
      100;
    };

    let dpi = if (device.screenSizeInches >= 7) {
      900;
    } else if (device.screenSizeInches >= 5) {
      700;
    } else {
      500;
    };

    let fireButtonSize = if (device.screenSizeInches >= 7) {
      40;
    } else if (device.screenSizeInches >= 5) {
      30;
    } else {
      20;
    };

    let gameBoosterTips = if (device.ramGb >= 8) {
      "Enable performance mode in settings for optimal performance.";
    } else if (device.ramGb >= 6) {
      "Close background apps and enable performance mode for best results.";
    } else if (device.ramGb >= 4) {
      "Reduce graphics settings and clear cache regularly.";
    } else {
      "Consider upgrading your device for better performance.";
    };

    {
      sensitivity;
      dpi;
      fireButtonSize;
      gameBoosterTips;
      deviceDetails = device;
    };
  };

  // Anyone can submit device details and get sensitivity settings
  public shared ({ caller }) func submitDeviceDetails(device : DeviceDetails) : async SensitivitySettings {
    let settings = calculateSensitivity(device);
    settingsMap.add(caller, settings);
    settings;
  };

  // Anyone can retrieve their sensitivity settings
  public query ({ caller }) func getSensitivitySettings() : async SensitivitySettings {
    switch (settingsMap.get(caller)) {
      case (null) { Runtime.trap("No sensitivity settings found. Please submit device details first.") };
      case (?settings) { settings };
    };
  };

  // Anyone can submit a payment request
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
        paymentRequests.add(
          requestId,
          {
            request with
            status = #approved
          },
        );
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
