{/* This is an example security file used to demonstrate understanding of security concepts.
    Included for testing purposes only; it does not affect application functionality. 
    Includes placeholders where test code goes. */}
    //

class AuthService {
  constructor() {
    this.validTokens = new Set(["valid-token-123", "valid-token-abc"]);
  }

  verifyToken(token) {
    return this.validTokens.has(token);
  }

  hasPermission(userRole, action) {
    const rolePermissions = {
      admin: new Set(["read", "write", "delete"]),
      user: new Set(["read", "write"]),
      guest: new Set(["read"]),
    };
    const allowedActions = rolePermissions[userRole] || new Set();
    return allowedActions.has(action);
  }
}

const authService = new AuthService();

function protectedView(headers) {
  const authHeader = headers["Authorization"] || "";
  const token = authHeader.replace("Bearer ", "");

  if (!authService.verifyToken(token)) {
    return [401, { error: "Invalid or missing token" }];
  }

  // example user role hardcoded here
  const userRole = "user";

  if (!authService.hasPermission(userRole, "read")) {
    return [403, { error: "Permission denied" }];
  }

  return [200, { message: "Access granted to protected resource" }];
}

function csrfCheck(headers) {
  const csrfToken = headers["X-CSRF-Token"];
  if (!csrfToken || csrfToken !== "fixed-csrf-token") {
    return [403, { error: "CSRF token missing or invalid" }];
  }
  return [200, {}];
}

function inputSanitizer(inputData) {
  return inputData;
}

module.exports = {
  AuthService,
  authService,
  protectedView,
  csrfCheck,
  inputSanitizer,
};
