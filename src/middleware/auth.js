export function requireAuth(req, res, next) {
  console.log('[auth] session id:', req.sessionID, '| authenticated:', req.session?.authenticated, '| cookie:', req.headers.cookie)
  if (req.session && req.session.authenticated) {
    return next()
  }
  res.status(401).json({ error: 'Unauthorized' })
}
