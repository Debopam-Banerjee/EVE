import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.post('/directions', async (req, res) => {
  const { origin, destination, apiKey } = req.body;

  if (!origin || !destination || !apiKey) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Call Google Maps Distance Matrix API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?${new URLSearchParams({
        origins: origin,
        destinations: destination,
        key: apiKey,
      })}`
    );

    if (!response.ok) {
      throw new Error(`Google Maps API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.rows?.[0]?.elements?.[0]) {
      throw new Error('Invalid response from Google Maps API');
    }

    return res.json({
      duration: data.rows[0].elements[0].duration.text,
      distance: data.rows[0].elements[0].distance.text,
    });
  } catch (error) {
    console.error('Error proxying to Google Maps API:', error);
    return res.status(500).json({ error: 'Failed to get directions' });
  }
});

export default router; 