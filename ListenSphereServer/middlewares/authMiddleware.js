// middleware/spotifyAuth.js
import axios from 'axios';

const validateSpotifyToken = async (req, res, next) => {
  const spotifyToken = req.header('Authorization')?.replace('Bearer ', '');

  if (!spotifyToken) {
    return res.status(401).json({ error: 'Unauthorized - Missing token' });
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${spotifyToken}` },
    });

    req.spotifyUser = response.data; // Attach the user data to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Token validation error:', error.message);
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

export default validateSpotifyToken;


