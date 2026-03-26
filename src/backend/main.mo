import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";

actor {
  // Types
  type User = {
    id : Nat;
    name : Text;
    email : Text;
    role : Text;
    status : Text;
    department : Text;
    lastLogin : Text;
    createdAt : Text;
  };

  type Role = {
    id : Nat;
    name : Text;
    description : Text;
    permissions : [Text];
    memberCount : Nat;
    createdAt : Text;
  };

  type Permission = {
    id : Nat;
    name : Text;
    description : Text;
    category : Text;
    resource : Text;
  };

  type AccessRequest = {
    id : Nat;
    requesterName : Text;
    resourceName : Text;
    requestType : Text;
    status : Text;
    reason : Text;
    requestedAt : Text;
    resolvedAt : Text;
    resolvedBy : Text;
  };

  type AuditLog = {
    id : Nat;
    userName : Text;
    action : Text;
    resource : Text;
    ipAddress : Text;
    timestamp : Text;
    status : Text;
  };

  type Policy = {
    id : Nat;
    name : Text;
    description : Text;
    status : Text;
    rules : Text;
    priority : Nat;
    createdAt : Text;
  };

  // Helpers
  module User {
    public func compare(u1 : User, u2 : User) : Order.Order {
      Nat.compare(u1.id, u2.id);
    };
  };

  module Role {
    public func compare(r1 : Role, r2 : Role) : Order.Order {
      Nat.compare(r1.id, r2.id);
    };
  };

  module Permission {
    public func compare(p1 : Permission, p2 : Permission) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  module AccessRequest {
    public func compare(a1 : AccessRequest, a2 : AccessRequest) : Order.Order {
      Nat.compare(a1.id, a2.id);
    };
  };

  module AuditLog {
    public func compare(a1 : AuditLog, a2 : AuditLog) : Order.Order {
      Nat.compare(a1.id, a2.id);
    };
  };

  module Policy {
    public func compare(p1 : Policy, p2 : Policy) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  var nextUserId = 11;
  var nextRoleId = 6;
  var nextPermissionId = 13;
  var nextAccessRequestId = 9;
  var nextAuditLogId = 21;
  var nextPolicyId = 5;

  let users = Map.fromIter<Nat, User>([
    (
      1,
      {
        id = 1;
        name = "Alice Anderson";
        email = "alice@company.com";
        role = "Admin";
        status = "Active";
        department = "Engineering";
        lastLogin = "2024-06-01T10:15:00Z";
        createdAt = "2023-10-01T09:00:00Z";
      },
    ),
    (
      2,
      {
        id = 2;
        name = "Bob Brown";
        email = "bob@company.com";
        role = "Developer";
        status = "Active";
        department = "Engineering";
        lastLogin = "2024-05-30T14:20:00Z";
        createdAt = "2023-11-15T11:30:00Z";
      },
    ),
    (
      3,
      {
        id = 3;
        name = "Charlie Clark";
        email = "charlie@company.com";
        role = "Analyst";
        status = "Inactive";
        department = "Finance";
        lastLogin = "2024-05-25T09:00:00Z";
        createdAt = "2024-01-05T13:45:00Z";
      },
    ),
    (
      4,
      {
        id = 4;
        name = "Diana Davis";
        email = "diana@company.com";
        role = "Manager";
        status = "Active";
        department = "HR";
        lastLogin = "2024-06-02T08:10:00Z";
        createdAt = "2024-02-10T16:00:00Z";
      },
    ),
    (
      5,
      {
        id = 5;
        name = "Edward Evans";
        email = "edward@company.com";
        role = "Viewer";
        status = "Active";
        department = "IT";
        lastLogin = "2024-05-28T13:30:00Z";
        createdAt = "2023-12-20T10:00:00Z";
      },
    ),
    (
      6,
      {
        id = 6;
        name = "Fiona Foster";
        email = "fiona@company.com";
        role = "Developer";
        status = "Inactive";
        department = "Engineering";
        lastLogin = "2024-05-18T11:15:00Z";
        createdAt = "2024-03-01T15:40:00Z";
      },
    ),
    (
      7,
      {
        id = 7;
        name = "George Green";
        email = "george@company.com";
        role = "Developer";
        status = "Active";
        department = "Engineering";
        lastLogin = "2024-06-03T09:50:00Z";
        createdAt = "2023-11-25T14:20:00Z";
      },
    ),
    (
      8,
      {
        id = 8;
        name = "Hannah Harris";
        email = "hannah@company.com";
        role = "Analyst";
        status = "Active";
        department = "Finance";
        lastLogin = "2024-05-27T08:00:00Z";
        createdAt = "2024-04-15T17:10:00Z";
      },
    ),
    (
      9,
      {
        id = 9;
        name = "Ian Iron";
        email = "ian@company.com";
        role = "Manager";
        status = "Active";
        department = "Marketing";
        lastLogin = "2024-05-29T12:25:00Z";
        createdAt = "2023-10-10T12:30:00Z";
      },
    ),
    (
      10,
      {
        id = 10;
        name = "Julia Jones";
        email = "julia@company.com";
        role = "Viewer";
        status = "Active";
        department = "IT";
        lastLogin = "2024-06-04T10:45:00Z";
        createdAt = "2024-01-25T09:15:00Z";
      },
    ),
  ].values());

  let roles = Map.fromIter<Nat, Role>([
    (
      1,
      {
        id = 1;
        name = "Admin";
        description = "Full access to all system features";
        permissions = [
          "manage_users",
          "view_reports",
          "access_dashboard",
          "edit_settings",
          "delete_resources",
        ];
        memberCount = 1;
        createdAt = "2023-10-01T09:00:00Z";
      },
    ),
    (
      2,
      {
        id = 2;
        name = "Developer";
        description = "Access to development resources and restricted management tools";
        permissions = ["code_access", "view_logs", "deploy_services", "access_api"];
        memberCount = 3;
        createdAt = "2023-11-15T11:30:00Z";
      },
    ),
    (
      3,
      {
        id = 3;
        name = "Analyst";
        description = "Access to analytics and reporting features";
        permissions = ["data_analysis", "view_reports", "export_data"];
        memberCount = 2;
        createdAt = "2024-01-05T13:45:00Z";
      },
    ),
    (
      4,
      {
        id = 4;
        name = "Viewer";
        description = "Read-only access to resources and reports";
        permissions = ["view_resources", "view_reports"];
        memberCount = 2;
        createdAt = "2023-12-20T10:00:00Z";
      },
    ),
    (
      5,
      {
        id = 5;
        name = "Manager";
        description = "Management access to department-level features";
        permissions = [
          "manage_department",
          "approve_requests",
          "view_reports",
          "edit_settings",
        ];
        memberCount = 2;
        createdAt = "2024-02-10T16:00:00Z";
      },
    ),
  ].values());

  let permissions = Map.fromIter<Nat, Permission>([
    (
      1,
      {
        id = 1;
        name = "manage_users";
        description = "Ability to create, update, and delete user accounts";
        category = "user-management";
        resource = "users";
      },
    ),
    (
      2,
      {
        id = 2;
        name = "view_reports";
        description = "Permission to view all system reports and analytics";
        category = "reporting";
        resource = "reports";
      },
    ),
    (
      3,
      {
        id = 3;
        name = "access_dashboard";
        description = "Access to the main dashboard with summary metrics";
        category = "data-access";
        resource = "dashboard";
      },
    ),
    (
      4,
      {
        id = 4;
        name = "edit_settings";
        description = "Ability to modify system and user settings";
        category = "system-config";
        resource = "settings";
      },
    ),
    (
      5,
      {
        id = 5;
        name = "delete_resources";
        description = "Permission to remove or delete system resources";
        category = "data-access";
        resource = "resources";
      },
    ),
    (
      6,
      {
        id = 6;
        name = "code_access";
        description = "Access to code repositories and development tools";
        category = "data-access";
        resource = "code";
      },
    ),
    (
      7,
      {
        id = 7;
        name = "view_logs";
        description = "Permission to view system and application logs";
        category = "reporting";
        resource = "logs";
      },
    ),
    (
      8,
      {
        id = 8;
        name = "deploy_services";
        description = "Ability to deploy and manage cloud services";
        category = "system-config";
        resource = "services";
      },
    ),
    (
      9,
      {
        id = 9;
        name = "data_analysis";
        description = "Access to advanced data analysis tools";
        category = "reporting";
        resource = "analytics";
      },
    ),
    (
      10,
      {
        id = 10;
        name = "export_data";
        description = "Permission to export reports and data sets";
        category = "data-access";
        resource = "exports";
      },
    ),
    (
      11,
      {
        id = 11;
        name = "manage_department";
        description = "Ability to manage department-specific resources";
        category = "system-config";
        resource = "departments";
      },
    ),
    (
      12,
      {
        id = 12;
        name = "approve_requests";
        description = "Permission to approve or reject access requests";
        category = "user-management";
        resource = "requests";
      },
    ),
  ].values());

  let accessRequests = Map.fromIter<Nat, AccessRequest>([
    (
      1,
      {
        id = 1;
        requesterName = "Alice Anderson";
        resourceName = "Department Report";
        requestType = "Read";
        status = "Pending";
        reason = "Need access to review department performance";
        requestedAt = "2024-06-01T10:00:00Z";
        resolvedAt = "";
        resolvedBy = "";
      },
    ),
    (
      2,
      {
        id = 2;
        requesterName = "Bob Brown";
        resourceName = "HR Documents";
        requestType = "Edit";
        status = "Approved";
        reason = "Update HR policies";
        requestedAt = "2024-06-02T11:30:00Z";
        resolvedAt = "2024-06-03T12:00:00Z";
        resolvedBy = "Diana Davis";
      },
    ),
    (
      3,
      {
        id = 3;
        requesterName = "Charlie Clark";
        resourceName = "Financial Report";
        requestType = "Read";
        status = "Rejected";
        reason = "Review year-end financials";
        requestedAt = "2024-06-03T09:15:00Z";
        resolvedAt = "2024-06-04T10:00:00Z";
        resolvedBy = "Ian Iron";
      },
    ),
    (
      4,
      {
        id = 4;
        requesterName = "Fiona Foster";
        resourceName = "Marketing Strategy";
        requestType = "Edit";
        status = "Pending";
        reason = "Update marketing plans for next quarter";
        requestedAt = "2024-06-04T08:20:00Z";
        resolvedAt = "";
        resolvedBy = "";
      },
    ),
    (
      5,
      {
        id = 5;
        requesterName = "Edward Evans";
        resourceName = "IT Configuration";
        requestType = "Read";
        status = "Approved";
        reason = "Troubleshoot system issue";
        requestedAt = "2024-06-05T14:45:00Z";
        resolvedAt = "2024-06-06T15:00:00Z";
        resolvedBy = "Alice Anderson";
      },
    ),
    (
      6,
      {
        id = 6;
        requesterName = "Hannah Harris";
        resourceName = "Analytics Dashboard";
        requestType = "Read";
        status = "Pending";
        reason = "Analyze sales data";
        requestedAt = "2024-06-06T13:10:00Z";
        resolvedAt = "";
        resolvedBy = "";
      },
    ),
    (
      7,
      {
        id = 7;
        requesterName = "Ian Iron";
        resourceName = "Project Plan";
        requestType = "Edit";
        status = "Approved";
        reason = "Update project timeline";
        requestedAt = "2024-06-07T07:50:00Z";
        resolvedAt = "2024-06-08T08:30:00Z";
        resolvedBy = "Bob Brown";
      },
    ),
    (
      8,
      {
        id = 8;
        requesterName = "Julia Jones";
        resourceName = "Department Budget";
        requestType = "Read";
        status = "Rejected";
        reason = "Review current spending";
        requestedAt = "2024-06-08T10:25:00Z";
        resolvedAt = "2024-06-09T11:00:00Z";
        resolvedBy = "Fiona Foster";
      },
    ),
  ].values());

  let auditLogs = Map.fromIter<Nat, AuditLog>([
    (
      1,
      {
        id = 1;
        userName = "Alice Anderson";
        action = "Login";
        resource = "Dashboard";
        ipAddress = "192.168.1.10";
        timestamp = "2024-06-01T10:15:00Z";
        status = "Success";
      },
    ),
    (
      2,
      {
        id = 2;
        userName = "Bob Brown";
        action = "View Report";
        resource = "Finance";
        ipAddress = "192.168.1.11";
        timestamp = "2024-06-01T10:20:00Z";
        status = "Success";
      },
    ),
    (
      3,
      {
        id = 3;
        userName = "Charlie Clark";
        action = "Edit Settings";
        resource = "System";
        ipAddress = "192.168.1.12";
        timestamp = "2024-06-01T10:25:00Z";
        status = "Failed";
      },
    ),
    (
      4,
      {
        id = 4;
        userName = "Diana Davis";
        action = "Logout";
        resource = "Dashboard";
        ipAddress = "192.168.1.13";
        timestamp = "2024-06-01T10:30:00Z";
        status = "Success";
      },
    ),
    (
      5,
      {
        id = 5;
        userName = "Edward Evans";
        action = "View Log";
        resource = "IT";
        ipAddress = "192.168.1.14";
        timestamp = "2024-06-01T10:35:00Z";
        status = "Success";
      },
    ),
    (
      6,
      {
        id = 6;
        userName = "Fiona Foster";
        action = "Export Data";
        resource = "Analytics";
        ipAddress = "192.168.1.15";
        timestamp = "2024-06-01T10:40:00Z";
        status = "Success";
      },
    ),
    (
      7,
      {
        id = 7;
        userName = "George Green";
        action = "Login";
        resource = "Dashboard";
        ipAddress = "192.168.1.16";
        timestamp = "2024-06-01T10:45:00Z";
        status = "Success";
      },
    ),
    (
      8,
      {
        id = 8;
        userName = "Hannah Harris";
        action = "View Report";
        resource = "Finance";
        ipAddress = "192.168.1.17";
        timestamp = "2024-06-01T10:50:00Z";
        status = "Success";
      },
    ),
    (
      9,
      {
        id = 9;
        userName = "Ian Iron";
        action = "Edit Settings";
        resource = "System";
        ipAddress = "192.168.1.18";
        timestamp = "2024-06-01T10:55:00Z";
        status = "Failed";
      },
    ),
    (
      10,
      {
        id = 10;
        userName = "Julia Jones";
        action = "Logout";
        resource = "Dashboard";
        ipAddress = "192.168.1.19";
        timestamp = "2024-06-01T11:00:00Z";
        status = "Success";
      },
    ),
    (
      11,
      {
        id = 11;
        userName = "Alice Anderson";
        action = "Create User";
        resource = "Admin";
        ipAddress = "192.168.1.20";
        timestamp = "2024-06-01T11:05:00Z";
        status = "Success";
      },
    ),
    (
      12,
      {
        id = 12;
        userName = "Bob Brown";
        action = "Deploy Service";
        resource = "Development";
        ipAddress = "192.168.1.21";
        timestamp = "2024-06-01T11:10:00Z";
        status = "Success";
      },
    ),
    (
      13,
      {
        id = 13;
        userName = "Charlie Clark";
        action = "View API";
        resource = "Development";
        ipAddress = "192.168.1.22";
        timestamp = "2024-06-01T11:15:00Z";
        status = "Success";
      },
    ),
    (
      14,
      {
        id = 14;
        userName = "Diana Davis";
        action = "Edit Department";
        resource = "HR";
        ipAddress = "192.168.1.23";
        timestamp = "2024-06-01T11:20:00Z";
        status = "Success";
      },
    ),
    (
      15,
      {
        id = 15;
        userName = "Edward Evans";
        action = "Approve Request";
        resource = "IT";
        ipAddress = "192.168.1.24";
        timestamp = "2024-06-01T11:25:00Z";
        status = "Success";
      },
    ),
    (
      16,
      {
        id = 16;
        userName = "Fiona Foster";
        action = "View Report";
        resource = "Marketing";
        ipAddress = "192.168.1.25";
        timestamp = "2024-06-01T11:30:00Z";
        status = "Success";
      },
    ),
    (
      17,
      {
        id = 17;
        userName = "George Green";
        action = "Edit User";
        resource = "Engineering";
        ipAddress = "192.168.1.26";
        timestamp = "2024-06-01T11:35:00Z";
        status = "Success";
      },
    ),
    (
      18,
      {
        id = 18;
        userName = "Hannah Harris";
        action = "Delete User";
        resource = "Admin";
        ipAddress = "192.168.1.27";
        timestamp = "2024-06-01T11:40:00Z";
        status = "Failed";
      },
    ),
    (
      19,
      {
        id = 19;
        userName = "Ian Iron";
        action = "View Report";
        resource = "Finance";
        ipAddress = "192.168.1.28";
        timestamp = "2024-06-01T11:45:00Z";
        status = "Success";
      },
    ),
    (
      20,
      {
        id = 20;
        userName = "Julia Jones";
        action = "Export Data";
        resource = "Analytics";
        ipAddress = "192.168.1.29";
        timestamp = "2024-06-01T11:50:00Z";
        status = "Success";
      },
    ),
  ].values());

  let policies = Map.fromIter<Nat, Policy>([
    (
      1,
      {
        id = 1;
        name = "Data Retention";
        description = "Policy for retaining user data";
        status = "Active";
        rules = "Retain data for 5 years then delete";
        priority = 1;
        createdAt = "2024-06-01T09:00:00Z";
      },
    ),
    (
      2,
      {
        id = 2;
        name = "Access Control";
        description = "Policy for managing access to resources";
        status = "Active";
        rules = "Access requires multi-factor authentication";
        priority = 2;
        createdAt = "2024-06-01T09:15:00Z";
      },
    ),
    (
      3,
      {
        id = 3;
        name = "Audit Logging";
        description = "Policy for logging system activity";
        status = "Inactive";
        rules = "Log all user actions with timestamps";
        priority = 3;
        createdAt = "2024-06-01T09:30:00Z";
      },
    ),
    (
      4,
      {
        id = 4;
        name = "Role Management";
        description = "Policy for creating and assigning roles";
        status = "Active";
        rules = "Roles must have specific permissions defined";
        priority = 4;
        createdAt = "2024-06-01T09:45:00Z";
      },
    ),
  ].values());

  // Functions
  public query ({ caller }) func getUsers() : async [User] {
    users.values().toArray().sort();
  };

  public shared ({ caller }) func createUser(name : Text, email : Text, role : Text, department : Text) : async Nat {
    let id = nextUserId;
    let user : User = {
      id;
      name;
      email;
      role;
      status = "Active";
      department;
      lastLogin = "";
      createdAt = "";
    };
    users.add(id, user);
    nextUserId += 1;
    id;
  };

  public shared ({ caller }) func updateUserStatus(id : Nat, status : Text) : async () {
    switch (users.get(id)) {
      case (null) {
        Runtime.trap("User not found");
      };
      case (?user) {
        let updatedUser = { user with status };
        users.add(id, updatedUser);
      };
    };
  };

  public query ({ caller }) func getRoles() : async [Role] {
    roles.values().toArray().sort();
  };

  public shared ({ caller }) func createRole(name : Text, description : Text) : async Nat {
    let id = nextRoleId;
    let role : Role = {
      id;
      name;
      description;
      permissions = [];
      memberCount = 0;
      createdAt = "";
    };
    roles.add(id, role);
    nextRoleId += 1;
    id;
  };

  public query ({ caller }) func getPermissions() : async [Permission] {
    permissions.values().toArray().sort();
  };

  public query ({ caller }) func getAccessRequests() : async [AccessRequest] {
    accessRequests.values().toArray().sort();
  };

  public shared ({ caller }) func createAccessRequest(requesterName : Text, resourceName : Text, requestType : Text, reason : Text) : async Nat {
    let id = nextAccessRequestId;
    let accessRequest : AccessRequest = {
      id;
      requesterName;
      resourceName;
      requestType;
      status = "Pending";
      reason;
      requestedAt = "";
      resolvedAt = "";
      resolvedBy = "";
    };
    accessRequests.add(id, accessRequest);
    nextAccessRequestId += 1;
    id;
  };

  public shared ({ caller }) func updateAccessRequestStatus(id : Nat, status : Text, resolvedBy : Text) : async () {
    switch (accessRequests.get(id)) {
      case (null) {
        Runtime.trap("Access request not found");
      };
      case (?accessRequest) {
        let updatedAccessRequest = { accessRequest with status; resolvedBy };
        accessRequests.add(id, updatedAccessRequest);
      };
    };
  };

  public query ({ caller }) func getAuditLogs() : async [AuditLog] {
    auditLogs.values().toArray().sort();
  };

  public query ({ caller }) func getPolicies() : async [Policy] {
    policies.values().toArray().sort();
  };

  public shared ({ caller }) func createPolicy(name : Text, description : Text, rules : Text, priority : Nat) : async Nat {
    let id = nextPolicyId;
    let policy : Policy = {
      id;
      name;
      description;
      status = "Active";
      rules;
      priority;
      createdAt = "";
    };
    policies.add(id, policy);
    nextPolicyId += 1;
    id;
  };

  public shared ({ caller }) func updatePolicyStatus(id : Nat, status : Text) : async () {
    switch (policies.get(id)) {
      case (null) {
        Runtime.trap("Policy not found");
      };
      case (?policy) {
        let updatedPolicy = { policy with status };
        policies.add(id, updatedPolicy);
      };
    };
  };
};
