/**
 * As a plugin, we get the authorization token from DataIQ, the parent window.
 * If this is running locally in development, parent.token() will not exist.
 *
 * We could better detect development vs. production, likely using Node environment variables,
 * but will leave that as a future item.
 */
export function getToken() {
  let token = null;
  if (parent.location.hostname !== '127.0.0.1') {
    token = parent.token();
  }
  return token;
}