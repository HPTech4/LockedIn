import { supabase, supabaseAdmin } from '../config/supabase.js'

// -----------------------------------------------
// SIGNUP
// -----------------------------------------------
export const signup = async (req, res) => {
  try {
    const { email, password, username } = req.body

    // Validate fields
    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Email, password and username are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    // Check if username is already taken
    const { data: existingUser } = await supabaseAdmin
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single()

    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' })
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username } // passed to raw_user_meta_data → trigger saves it to profiles
      }
    })

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        username
      }
    })

  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// -----------------------------------------------
// LOGIN
// -----------------------------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata.username
      },
      token: data.session.access_token,
      refresh_token: data.session.refresh_token
    })

  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// -----------------------------------------------
// LOGOUT
// -----------------------------------------------
export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return res.status(400).json({ message: 'No token provided' })
    }

    const { error } = await supabase.auth.signOut()

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    res.status(200).json({ message: 'Logged out successfully' })

  } catch (err) {
    console.error('Logout error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// -----------------------------------------------
// GET CURRENT USER (protected)
// -----------------------------------------------
export const getMe = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, email, username, created_at')
      .eq('id', req.user.id)
      .single()

    if (error) {
      return res.status(404).json({ message: 'Profile not found' })
    }

    res.status(200).json({ user: data })

  } catch (err) {
    console.error('Get me error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}