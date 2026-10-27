import { Router } from 'express';
import { db } from '../db.js';
import { Route } from '../../../shared/schemas.js';

export const routesRouter = Router();

// GET /api/routes
routesRouter.get('/', (req, res) => {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const rows = db.prepare(`
    SELECT r.*,
      COALESCE(
        (SELECT SUM(seats_left) FROM availability WHERE route_id = r.id AND month = ?),
        24
      ) as seats_this_month
    FROM routes r
    ORDER BY r.block_minutes ASC
  `).all(currentMonth) as any[];

  const routes: Route[] = rows.map(r => ({
    id: r.id,
    slug: r.slug,
    originCity: r.origin_city,
    originCode: r.origin_code,
    destCity: r.dest_city,
    destCode: r.dest_code,
    region: r.region,
    blockTime: r.block_time,
    blockMinutes: r.block_minutes,
    distanceKm: r.distance_km,
    aircraft: r.aircraft,
    cabinLayout: r.cabin_layout,
    totalSeats: r.total_seats,
    seatsLeftThisMonth: Math.max(0, r.seats_this_month),
    coordinates: {
      origin: [r.origin_lat, r.origin_lng],
      dest: [r.dest_lat, r.dest_lng],
    },
    heroImage: r.hero_image,
    overview: r.overview,
    altitudeFeet: r.altitude_feet,
  }));

  res.json(routes);
});

// GET /api/routes/:slug
routesRouter.get('/:slug', (req, res) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const r = db.prepare(`
    SELECT r.*,
      COALESCE(
        (SELECT SUM(seats_left) FROM availability WHERE route_id = r.id AND month = ?),
        24
      ) as seats_this_month
    FROM routes r
    WHERE r.slug = ? OR r.id = ?
  `).get(currentMonth, req.params.slug, req.params.slug) as any;

  if (!r) {
    return res.status(404).json({ error: 'Route not found' });
  }

  const route: Route = {
    id: r.id,
    slug: r.slug,
    originCity: r.origin_city,
    originCode: r.origin_code,
    destCity: r.dest_city,
    destCode: r.dest_code,
    region: r.region,
    blockTime: r.block_time,
    blockMinutes: r.block_minutes,
    distanceKm: r.distance_km,
    aircraft: r.aircraft,
    cabinLayout: r.cabin_layout,
    totalSeats: r.total_seats,
    seatsLeftThisMonth: Math.max(0, r.seats_this_month),
    coordinates: {
      origin: [r.origin_lat, r.origin_lng],
      dest: [r.dest_lat, r.dest_lng],
    },
    heroImage: r.hero_image,
    overview: r.overview,
    altitudeFeet: r.altitude_feet,
  };

  res.json(route);
});

// GET /api/availability?route=&month=
routesRouter.get('/availability/lookup', (req, res) => {
  const routeId = req.query.route as string;
  const month = (req.query.month as string) || new Date().toISOString().slice(0, 7);

  if (!routeId) {
    return res.status(400).json({ error: 'route query parameter is required' });
  }

  const days = db.prepare(`
    SELECT date, seats_left, total_seats
    FROM availability
    WHERE route_id = ? AND month = ?
    ORDER BY date ASC
  `).all(routeId, month) as Array<{ date: string; seats_left: number; total_seats: number }>;

  const availabilityDays = days.map(d => ({
    date: d.date,
    seatsLeft: d.seats_left,
    status: d.seats_left === 0 ? 'full' : (d.seats_left <= 3 ? 'limited' : 'available'),
  }));

  res.json({
    routeId,
    month,
    days: availabilityDays,
  });
});
