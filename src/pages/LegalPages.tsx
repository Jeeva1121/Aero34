import React from 'react';
import { Link } from 'wouter';

export const PrivacyPage: React.FC = () => (
  <div className="min-h-screen bg-[#EEEBE4] py-20">
    <div className="grid-12">
      <div className="col-span-12 md:col-span-8 md:col-start-3">
        <span className="micro-label">GOVERNANCE PROTOCOL</span>
        <h1 className="font-display text-4xl md:text-6xl mt-2 mb-8">Data Privacy Charter</h1>

        <div className="space-y-6 text-sm text-(--ink-80) leading-relaxed">
          <p className="font-semibold text-(--ink)">
            AERO 34 operates on a strict minimization data model. We collect only what is strictly required to verify airframe capacity and log passenger manifests.
          </p>
          <h2 className="font-display text-2xl text-(--ink) pt-4 hairline-t">1. Data Collected</h2>
          <p>
            When a seat request is initiated, we collect: lead passenger name, operational email, requested departure date, party size, and optional dietary/ground handling notes. We do not track device fingerprints, store credit card numbers on our servers, or use cross-site marketing beacons.
          </p>
          <h2 className="font-display text-2xl text-(--ink) pt-4 hairline-t">2. Retention & Deletion</h2>
          <p>
            Requests marked as Declined or flights dispatched more than thirty days prior are automatically purged from primary operational storage. You may request immediate deletion of any open inquiry at any time by contacting dispatch@aero34.com with your reference code.
          </p>
          <h2 className="font-display text-2xl text-(--ink) pt-4 hairline-t">3. Security Standards</h2>
          <p>
            All network communication is enforced via TLS 1.3 with HTTP Strict Transport Security (HSTS). Administrative access requires salted cryptographic authentication with multi-attempt lockout mechanisms.
          </p>
        </div>

        <div className="mt-12 pt-8 hairline-t">
          <Link href="/" className="btn-editorial">Return to Overview</Link>
        </div>
      </div>
    </div>
  </div>
);

export const TermsPage: React.FC = () => (
  <div className="min-h-screen bg-[#EEEBE4] py-20">
    <div className="grid-12">
      <div className="col-span-12 md:col-span-8 md:col-start-3">
        <span className="micro-label">CONTRACTUAL CONDITIONS</span>
        <h1 className="font-display text-4xl md:text-6xl mt-2 mb-8">Charter & Seat Terms</h1>

        <div className="space-y-6 text-sm text-(--ink-80) leading-relaxed">
          <p className="font-semibold text-(--ink)">
            These terms govern all seat and airframe charter allocations made via the AERO 34 platform.
          </p>
          <h2 className="font-display text-2xl text-(--ink) pt-4 hairline-t">1. Carrier Certification</h2>
          <p>
            All flights listed on the platform are operated by licensed air carriers holding valid FAA Part 135 or EASA Air Operator Certificates (AOC). Aircraft commanders maintain operational control of the airframe at all times.
          </p>
          <h2 className="font-display text-2xl text-(--ink) pt-4 hairline-t">2. Request Confirmation & Hold</h2>
          <p>
            A request generated on this platform represents a provisional seat allotment. Confirmation occurs upon dispatcher review of crew duty times, aircraft availability, and Shanwick/Gander airway slot clearances.
          </p>
          <h2 className="font-display text-2xl text-(--ink) pt-4 hairline-t">3. Baggage & Hazardous Materials</h2>
          <p>
            All passengers and baggage are screened according to private general aviation FBO standards. Hazardous materials strictly prohibited under ICAO Annex 18 will not be transported.
          </p>
        </div>

        <div className="mt-12 pt-8 hairline-t">
          <Link href="/" className="btn-editorial">Return to Overview</Link>
        </div>
      </div>
    </div>
  </div>
);

export const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-[#EEEBE4] py-32 text-center flex flex-col justify-center items-center p-6">
    <span className="micro-label text-(--signal)">PAGE NOT FOUND</span>
    <h1 className="font-display text-6xl md:text-9xl mt-2 mb-4 tracking-tight">404</h1>
    <p className="prose-editorial text-sm mb-8">
      The requested page or flight document could not be found.
    </p>
    <Link href="/" className="btn-editorial">
      <span>Return to Home</span>
    </Link>
  </div>
);
