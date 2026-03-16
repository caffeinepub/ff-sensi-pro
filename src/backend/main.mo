import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";
import MixinAuthorization "authorization/MixinAuthorization";

actor {

  // ── Legacy stable variables (kept for upgrade compatibility) ──────────────

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  let approvalState = UserApproval.initState(accessControlState);

  public type DeviceDetails = {
    ramGb : Nat;
    deviceModel : Text;
    screenSizeInches : Nat;
  };

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

  // Old PaymentRequest type kept for stable variable compatibility
  public type LegacyPaymentRequest = {
    user : Principal;
    paymentReference : Text;
    status : { #pending; #approved };
    createdAt : Int;
  };

  // Keep old stable maps to avoid discard errors
  let settingsMap = Map.empty<Principal, LegacySensitivitySettings>();
  let settingsMapV2 = Map.empty<Principal, SensitivitySettings>();
  let paymentRequests = Map.empty<Nat, LegacyPaymentRequest>();
  var nextPaymentRequestId : Nat = 0;

  // ── New data (v2) ─────────────────────────────────────────────────────────

  public type PackLevel = Nat; // 1, 2, or 3

  public type NewPaymentRequest = {
    id : Nat;
    name : Text;
    pack : PackLevel;
    upiTxnId : Text;
    status : Text; // "pending", "approved", "rejected"
    createdAt : Int;
  };

  public type UserAccount = {
    username : Text;
    password : Text;
    pack : PackLevel;
  };

  let newPaymentRequests = Map.empty<Nat, NewPaymentRequest>();
  var nextNewRequestId : Nat = 0;
  let userAccounts = Map.empty<Text, UserAccount>();

  // ── Payment Requests (v2) ─────────────────────────────────────────────────

  public shared func submitNewPaymentRequest(name : Text, pack : PackLevel, upiTxnId : Text) : async Nat {
    let id = nextNewRequestId;
    nextNewRequestId += 1;
    let req : NewPaymentRequest = {
      id;
      name;
      pack;
      upiTxnId;
      status = "pending";
      createdAt = Time.now();
    };
    newPaymentRequests.add(id, req);
    id;
  };

  public query func getAllNewPaymentRequests() : async [NewPaymentRequest] {
    newPaymentRequests.values().toArray();
  };

  public shared func updateNewRequestStatus(id : Nat, status : Text) : async Bool {
    switch (newPaymentRequests.get(id)) {
      case null { false };
      case (?req) {
        newPaymentRequests.add(id, { req with status });
        true;
      };
    };
  };

  // ── User Accounts ─────────────────────────────────────────────────────────

  public shared func createUser(username : Text, password : Text, pack : PackLevel) : async Bool {
    if (userAccounts.get(username) != null) {
      return false;
    };
    userAccounts.add(username, { username; password; pack });
    true;
  };

  public shared func deleteUser(username : Text) : async () {
    userAccounts.remove(username);
  };

  public query func loginUser(username : Text, password : Text) : async ?PackLevel {
    switch (userAccounts.get(username)) {
      case null { null };
      case (?u) {
        if (u.password == password) { ?u.pack } else { null };
      };
    };
  };

  public query func getAllUsers() : async [UserAccount] {
    userAccounts.values().toArray();
  };

};
