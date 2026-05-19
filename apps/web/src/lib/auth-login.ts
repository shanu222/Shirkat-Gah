/** @deprecated Import from @/lib/api-config instead */
export {
  getBackendBaseUrl,
  getDirectServerApiUrl as getDirectAuthLoginUrl,
  getProxyServerApiUrl as getProxyAuthLoginUrl,
  getAuthLoginUrls,
  attemptBackendLogin,
  isValidLoginResponse,
  logAuth,
  logAuthError,
  type BackendLoginResponse,
  type AuthLoginAttempt,
} from './api-config';
