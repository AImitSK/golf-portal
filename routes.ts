/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/studio",
  "/auth/new-verification"
];

/**
* An array of routes that are used for authentication
* These routes will redirect logged in users to /settings
* @type {string[]}
*/
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/register-club",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password"
];

/**
* The prefix for API authentication routes
* Routes that start with this prefix are used for API authentication purposes
* @type {string}
*/
export const apiAuthPrefix = "/api/auth";

/**
* The club backend route for administrators
* @type {string}
*/
export const CLUB_BACKEND = "/club-backend";

/**
* The default redirect path after logging in
* @type {string}
*/
export const DEFAULT_LOGIN_REDIRECT = "/";

/**
* Gets the redirect path based on user role
* @param {string} role - The user's role (admin or user)
* @returns {string} The appropriate redirect path
*/
export const getRedirectPath = (role?: string) => {
  switch(role) {
      case "admin":
          return CLUB_BACKEND;
      case "user":
          return "/";
      default:
          return DEFAULT_LOGIN_REDIRECT;
  }
};