const haversine = require('haversine-distance');

app.get('/api/places/nearest', async (req, res) => {

  const { lat, lng } = req.query;
  const allPlaces = await Place.findAll(); // Fetch all places

  const nearestPlaces = allPlaces.filter(place => {

    const distance = haversine({ latitude: lat, longitude: lng }, { latitude: place.latitude, longitude: place.longitude });
    return distance <= 5000; // 5km
    
  });

  res.json(nearestPlaces);
});