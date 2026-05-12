import { supabaseAdmin } from '../config/supabase.js'

export const protect = async (req, res, next) => {
  try {
    // Allow preflight requests to pass through without auth
    if (req.method === 'OPTIONS') return next()
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]

    // Verify token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }

    // Attach user to request
    req.user = user
    next()

  } catch (err) {
    console.error('Auth middleware error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

