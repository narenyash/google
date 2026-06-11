import axios from 'axios';
import Farm from '../models/Farm.js';

const SPREAD_SPEED_MAP = {
  'Fall Armyworm': 0.4,
  'Brown Planthopper': 0.6,
  'Wheat Rust': 0.3
};

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function assessSpread(pestName, spreadable, latitude, longitude, severity, cropType) {
  if (!spreadable) {
    return {
      spreadable: false,
      message: 'This disease does not spread to neighboring farms. No community alert needed.'
    };
  }

  const weatherRes = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=wind_speed_10m,wind_direction_10m,relative_humidity_2m&forecast_days=1`
  );
  const { wind_speed_10m: windSpeed, wind_direction_10m: windDirection, relative_humidity_2m: humidity } =
    weatherRes.data.current;

  const baseSpeed = SPREAD_SPEED_MAP[pestName] ?? 0.3;
  const humidityFactor = 1 + humidity / 200;
  const windFactor = 1 + windSpeed / 50;

  const spreadRadius24hr = Math.round(baseSpeed * humidityFactor * windFactor * 24 * 10) / 10;
  const spreadRadius48hr = Math.round(baseSpeed * humidityFactor * windFactor * 48 * 10) / 10;
  const spreadRadius72hr = Math.round(baseSpeed * humidityFactor * windFactor * 72 * 10) / 10;

  const nearbyFarms = await Farm.find({
    location: {
      $nearSphere: {
        $geometry: { type: 'Point', coordinates: [longitude, latitude] },
        $maxDistance: spreadRadius72hr * 1000
      }
    },
    cropType
  });

  const redZoneFarms = [];
  const orangeZoneFarms = [];
  const yellowZoneFarms = [];

  for (const farm of nearbyFarms) {
    const [fLng, fLat] = farm.location.coordinates;
    const dist = haversine(latitude, longitude, fLat, fLng);
    const farmObj = farm.toObject();
    farmObj.distanceKm = Math.round(dist * 10) / 10;
    if (dist < spreadRadius24hr) redZoneFarms.push(farmObj);
    else if (dist < spreadRadius48hr) orangeZoneFarms.push(farmObj);
    else yellowZoneFarms.push(farmObj);
  }

  return {
    spreadable: true,
    windSpeed,
    windDirection,
    humidity,
    spreadRadius24hr,
    spreadRadius48hr,
    spreadRadius72hr,
    redZoneFarms,
    orangeZoneFarms,
    yellowZoneFarms,
    totalAtRiskFarms: redZoneFarms.length + orangeZoneFarms.length + yellowZoneFarms.length
  };
}
