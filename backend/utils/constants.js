// App-wide constants used across controllers and middleware

const ROLES = {
  ADMIN: "admin",
  RESIDENT: "resident",
  BUSINESS_OWNER: "business_owner",
};

const STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  RESOLVED: "resolved",
};

const COMPLAINT_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  CLOSED: "closed",
};

module.exports = { ROLES, STATUS, COMPLAINT_STATUS };
