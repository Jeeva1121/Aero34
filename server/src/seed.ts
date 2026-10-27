import { db, runMigrations } from './db.js';
import { hashPassword } from './auth.js';

export function seedDatabase() {
  runMigrations();

  const count = (db.prepare('SELECT COUNT(*) as count FROM routes').get() as { count: number }).count;
  if (count > 0) {
    return; // Already seeded
  }

  // 1. Seed 12 authentic long-haul routes
  const insertRoute = db.prepare(`
    INSERT INTO routes (
      id, slug, origin_city, origin_code, dest_city, dest_code,
      region, block_time, block_minutes, distance_km, aircraft,
      cabin_layout, total_seats, altitude_feet, hero_image,
      overview, origin_lat, origin_lng, dest_lat, dest_lng
    ) VALUES (
      @id, @slug, @origin_city, @origin_code, @dest_city, @dest_code,
      @region, @block_time, @block_minutes, @distance_km, @aircraft,
      @cabin_layout, @total_seats, @altitude_feet, @hero_image,
      @overview, @origin_lat, @origin_lng, @dest_lat, @dest_lng
    )
  `);

  const routes = [
    {
      id: 'RT-JFK-LHR',
      slug: 'new-york-london',
      origin_city: 'New York',
      origin_code: 'JFK',
      dest_city: 'London',
      dest_code: 'LHR',
      region: 'Transatlantic',
      block_time: '06h 55m',
      block_minutes: 415,
      distance_km: 5550,
      aircraft: 'Gulfstream G650ER',
      cabin_layout: 'Forward Club 4 / Mid Conference 4 / Aft Stateroom 6',
      total_seats: 14,
      altitude_feet: 45000,
      hero_image: '/destinations/newyork-8k.jpg',
      overview: 'Direct North Atlantic supersonic-adjacent track via Shanwick Oceanic. Dedicated Teterboro or JFK private terminal dispatch.',
      origin_lat: 40.6413,
      origin_lng: -73.7781,
      dest_lat: 51.4700,
      dest_lng: -0.4543,
    },
    {
      id: 'RT-LHR-HND',
      slug: 'london-tokyo',
      origin_city: 'London',
      origin_code: 'LHR',
      dest_city: 'Tokyo',
      dest_code: 'HND',
      region: 'Eurasia',
      block_time: '13h 40m',
      block_minutes: 820,
      distance_km: 9590,
      aircraft: 'Bombardier Global 7500',
      cabin_layout: 'Four Living Spaces / Nuage Lie-Flat Suites / Master Bedroom',
      total_seats: 12,
      altitude_feet: 47000,
      hero_image: '/destinations/tokyo-8k.jpg',
      overview: 'Circumpolar southern track across Central Asia with zero refueling stopovers. Acoustic isolation under 48 dBA.',
      origin_lat: 51.4700,
      origin_lng: -0.4543,
      dest_lat: 35.5494,
      dest_lng: 139.7798,
    },
    {
      id: 'RT-HND-SFO',
      slug: 'tokyo-san-francisco',
      origin_city: 'Tokyo',
      origin_code: 'HND',
      dest_city: 'San Francisco',
      dest_code: 'SFO',
      region: 'Transpacific',
      block_time: '09h 15m',
      block_minutes: 555,
      distance_km: 8280,
      aircraft: 'Dassault Falcon 8X',
      cabin_layout: 'Three Lounge Zones / Double Bed / Dedicated Crew Rest',
      total_seats: 10,
      altitude_feet: 49000,
      hero_image: '/destinations/tokyo-8k.jpg',
      overview: 'High-altitude jet stream routing over the Aleutian trench. Cabin pressure maintained at 3,900 ft equivalent.',
      origin_lat: 35.5494,
      origin_lng: 139.7798,
      dest_lat: 37.6213,
      dest_lng: -122.3790,
    },
    {
      id: 'RT-CDG-DXB',
      slug: 'paris-dubai',
      origin_city: 'Paris',
      origin_code: 'CDG',
      dest_city: 'Dubai',
      dest_code: 'DXB',
      region: 'Eurasia',
      block_time: '06h 30m',
      block_minutes: 390,
      distance_km: 5245,
      aircraft: 'Gulfstream G650ER',
      cabin_layout: 'Forward Galley / 8 Single Seats / 4 Place Dining',
      total_seats: 12,
      altitude_feet: 43000,
      hero_image: '/destinations/paris-8k.jpg',
      overview: 'Direct Mediterranean corridor. Full multi-course dining with induction galley service and high-speed Ka-band datalink.',
      origin_lat: 49.0097,
      origin_lng: 2.5479,
      dest_lat: 25.2532,
      dest_lng: 55.3657,
    },
    {
      id: 'RT-ZRH-DOH',
      slug: 'zurich-doha',
      origin_city: 'Zurich',
      origin_code: 'ZRH',
      dest_city: 'Doha',
      dest_code: 'DOH',
      region: 'Alpine-Gulf',
      block_time: '05h 50m',
      block_minutes: 350,
      distance_km: 4610,
      aircraft: 'Bombardier Global 6000',
      cabin_layout: 'Forward Executive Club / Mid Cabin Conference / Rear Divan',
      total_seats: 12,
      altitude_feet: 45000,
      hero_image: '/destinations/alps-8k.jpg',
      overview: 'Trans-Alpine departure clearing Swiss peaks at FL410 within 18 minutes of roll. Direct customs clearance at Al Maha FBO.',
      origin_lat: 47.4582,
      origin_lng: 8.5555,
      dest_lat: 25.2731,
      dest_lng: 51.6081,
    },
    {
      id: 'RT-SIN-SYD',
      slug: 'singapore-sydney',
      origin_city: 'Singapore',
      origin_code: 'SIN',
      dest_city: 'Sydney',
      dest_code: 'SYD',
      region: 'Transpacific',
      block_time: '07h 45m',
      block_minutes: 465,
      distance_km: 6305,
      aircraft: 'Gulfstream G700',
      cabin_layout: 'Five Living Areas / Grand Suite with En Suite Shower',
      total_seats: 14,
      altitude_feet: 47000,
      hero_image: '/destinations/first-class-suite.jpg',
      overview: 'Direct equatorial transit across the Timor Sea into Sydney Bankstown or Kingsford Smith executive apron.',
      origin_lat: 1.3644,
      origin_lng: 103.9915,
      dest_lat: -33.9461,
      dest_lng: 151.1772,
    },
    {
      id: 'RT-GVA-JFK',
      slug: 'geneva-new-york',
      origin_city: 'Geneva',
      origin_code: 'GVA',
      dest_city: 'New York',
      dest_code: 'JFK',
      region: 'Transatlantic',
      block_time: '08h 10m',
      block_minutes: 490,
      distance_km: 6215,
      aircraft: 'Bombardier Global 7500',
      cabin_layout: 'Four Zone Layout / Master Suite / Full Stand-up Shower',
      total_seats: 12,
      altitude_feet: 45000,
      hero_image: '/destinations/alps-8k.jpg',
      overview: 'Departing Geneva Cointrin executive runway with direct clearance over western France into westbound Atlantic tracks.',
      origin_lat: 46.2370,
      origin_lng: 6.1091,
      dest_lat: 40.6413,
      dest_lng: -73.7781,
    },
    {
      id: 'RT-LAX-HND',
      slug: 'los-angeles-tokyo',
      origin_city: 'Los Angeles',
      origin_code: 'LAX',
      dest_city: 'Tokyo',
      dest_code: 'HND',
      region: 'Transpacific',
      block_time: '11h 20m',
      block_minutes: 680,
      distance_km: 8820,
      aircraft: 'Gulfstream G650ER',
      cabin_layout: 'Forward Four-Place Club / Dining Credenza / Aft Bedroom',
      total_seats: 12,
      altitude_feet: 47000,
      hero_image: '/destinations/tokyo-8k.jpg',
      overview: 'Great Circle routing via Alaska. Maximum cruise altitude FL470 completely above Pacific commercial airway congestion.',
      origin_lat: 33.9416,
      origin_lng: -118.4085,
      dest_lat: 35.5494,
      dest_lng: 139.7798,
    },
    {
      id: 'RT-DXB-SIN',
      slug: 'dubai-singapore',
      origin_city: 'Dubai',
      origin_code: 'DXB',
      dest_city: 'Singapore',
      dest_code: 'SIN',
      region: 'Eurasia',
      block_time: '07h 15m',
      block_minutes: 435,
      distance_km: 5840,
      aircraft: 'Dassault Falcon 8X',
      cabin_layout: 'Club Seating 6 / Dining 4 / Rear 3-Place Divan',
      total_seats: 11,
      altitude_feet: 45000,
      hero_image: '/destinations/dubai-8k.jpg',
      overview: 'Overfly Arabian Sea and Indian subcontinental airspace at Mach 0.88 with HEPA hospital-grade air turnover every 2 minutes.',
      origin_lat: 25.2532,
      origin_lng: 55.3657,
      dest_lat: 1.3644,
      dest_lng: 103.9915,
    },
    {
      id: 'RT-EWR-NCE',
      slug: 'new-york-nice',
      origin_city: 'New York',
      origin_code: 'EWR',
      dest_city: 'Nice',
      dest_code: 'NCE',
      region: 'Transatlantic',
      block_time: '07h 50m',
      block_minutes: 470,
      distance_km: 6430,
      aircraft: 'Bombardier Global 6500',
      cabin_layout: 'Patented Nuage Ergonomic Seating / 3 Living Spaces',
      total_seats: 13,
      altitude_feet: 45000,
      hero_image: '/destinations/newyork-8k.jpg',
      overview: 'Direct transatlantic to Côte d’Azur. Visual approach along the Bay of Angels with dedicated helicopter link to Monaco.',
      origin_lat: 40.6895,
      origin_lng: -74.1745,
      dest_lat: 43.6584,
      dest_lng: 7.2159,
    },
    {
      id: 'RT-HND-SYD',
      slug: 'tokyo-sydney',
      origin_city: 'Tokyo',
      origin_code: 'HND',
      dest_city: 'Sydney',
      dest_code: 'SYD',
      region: 'Transpacific',
      block_time: '09h 40m',
      block_minutes: 580,
      distance_km: 7830,
      aircraft: 'Gulfstream G650ER',
      cabin_layout: 'Forward Galleys / Club 4 / Mid-Cabin Conference 4 / Stateroom 4',
      total_seats: 12,
      altitude_feet: 47000,
      hero_image: '/destinations/sky-dining-luxury.jpg',
      overview: 'True north-south meridional flight with minimal time-zone displacement (2 hours). Full night configuration available.',
      origin_lat: 35.5494,
      origin_lng: 139.7798,
      dest_lat: -33.9461,
      dest_lng: 151.1772,
    },
    {
      id: 'RT-MXP-HND',
      slug: 'milan-tokyo',
      origin_city: 'Milan',
      origin_code: 'MXP',
      dest_city: 'Tokyo',
      dest_code: 'HND',
      region: 'Eurasia',
      block_time: '12h 55m',
      block_minutes: 775,
      distance_km: 9720,
      aircraft: 'Bombardier Global 7500',
      cabin_layout: 'Four Distinct Rooms / Principal Suite / Crew Suite',
      total_seats: 12,
      altitude_feet: 47000,
      hero_image: '/destinations/first-class-suite.jpg',
      overview: 'Non-stop Italian northern departure directly into Tokyo Haneda VIP customs apron. Ultra-low cabin altitude of 2,900 ft.',
      origin_lat: 45.6301,
      origin_lng: 8.7255,
      dest_lat: 35.5494,
      dest_lng: 139.7798,
    },
  ];

  const insertAvailability = db.prepare(`
    INSERT INTO availability (route_id, date, month, seats_left, total_seats)
    VALUES (?, ?, ?, ?, ?)
  `);

  db.transaction(() => {
    for (const r of routes) {
      insertRoute.run(r);

      // Seed monthly availability for the next 60 days
      const now = new Date();
      for (let day = 1; day <= 60; day++) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + day);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;
        const monthStr = `${yyyy}-${mm}`;

        // Realistic seed availability: some dates full, some limited (2-4), some available (5-10)
        let seatsLeft = (day % 7 === 0 || day % 11 === 0) ? 0 : ((day % 4 === 0) ? 2 : Math.min(r.total_seats, 3 + (day % 7)));
        insertAvailability.run(r.id, dateStr, monthStr, seatsLeft, r.total_seats);
      }
    }

    // 2. Seed Default Admin User: 'admin' / 'aero34admin'
    const { hash, salt } = hashPassword('aero34admin');
    db.prepare(`
      INSERT OR REPLACE INTO admins (id, username, password_hash, salt)
      VALUES (1, 'admin', ?, ?)
    `).run(hash, salt);

    // 3. Seed initial realistic test requests
    const insertRequest = db.prepare(`
      INSERT INTO requests (ref, route_id, name, email, dates, party_size, note, status, idempotency_key, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertRequest.run(
      'AR-7K2Q9',
      'RT-JFK-LHR',
      'Eleanor Vance',
      'e.vance@archstone.co',
      '2026-11-14',
      2,
      'Aero Club liaison required upon arrival at Farnborough.',
      'Received',
      'seed-idemp-001',
      new Date(Date.now() - 3600000 * 3).toISOString()
    );

    insertRequest.run(
      'AR-9X4M1',
      'RT-LHR-HND',
      'Lord Julian Mercer',
      'mercer.holdings@mercer.co.uk',
      '2026-11-20',
      4,
      'En-suite master bedroom layout with quiet cabin protocols.',
      'Confirming',
      'seed-idemp-002',
      new Date(Date.now() - 3600000 * 12).toISOString()
    );

    insertRequest.run(
      'AR-3B8L5',
      'RT-HND-SFO',
      'Kenji Takahashi',
      'k.takahashi@sovereign.jp',
      '2026-12-02',
      1,
      'Connecting charter to Aspen via Gulfstream G280.',
      'Held',
      'seed-idemp-003',
      new Date(Date.now() - 3600000 * 24).toISOString()
    );
  })();
}
