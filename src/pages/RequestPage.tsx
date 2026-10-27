import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import gsap from 'gsap';
import {
  fetchRoutes,
  submitSeatRequest,
  fetchRequestStatus,
  subscribeToStatusUpdates,
  PublicStatusResponse,
} from '../lib/api.js';
import { Route } from '../../shared/schemas.js';

export const RequestPage: React.FC = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialRouteId = searchParams.get('route') || '';
  const initialRef = searchParams.get('ref') || '';

  const [routes, setRoutes] = useState<Route[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [routeId, setRouteId] = useState<string>(initialRouteId);
  const [dates, setDates] = useState<string>('2026-11-20');
  const [partySize, setPartySize] = useState<number>(2);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [honeypot, setHoneypot] = useState<string>('');
  const [idempotencyKey] = useState<string>(() => `idemp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);

  // Inline validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Success State
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);

  // Status Lookup State
  const [lookupRefInput, setLookupRefInput] = useState<string>(initialRef);
  const [lookupResult, setLookupResult] = useState<PublicStatusResponse | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const magneticBtnRef = useRef<HTMLButtonElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const ticketRef = useRef<HTMLDivElement>(null);
  const scrambleRef = useRef<HTMLSpanElement>(null);

  // Load routes on mount
  useEffect(() => {
    fetchRoutes().then((data) => {
      setRoutes(data);
      if (!routeId && data.length > 0) {
        setRouteId(data[0].id);
      }
    }).catch(() => {});
  }, []);

  // If initialRef exists in URL, automatically perform lookup
  useEffect(() => {
    if (initialRef) {
      handleLookup(initialRef);
    }
  }, [initialRef]);

  // Magnetic Submit Button (80px radius, quickTo, elastic.out)
  useEffect(() => {
    const btn = magneticBtnRef.current;
    if (!btn || window.matchMedia('(pointer: coarse)').matches) return;

    const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'elastic.out(1, 0.4)' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.hypot(distX, distY);

      if (distance < 90) {
        xTo(distX * 0.35);
        yTo(distY * 0.35);
      } else {
        xTo(0);
        yTo(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [currentStep]);

  // Animate progress line on step change
  useEffect(() => {
    if (progressLineRef.current) {
      gsap.to(progressLineRef.current, {
        scaleX: currentStep / 4,
        duration: 0.45,
        ease: 'power3.out',
      });
    }
  }, [currentStep]);

  // Inline Validation on Blur
  const validateField = (field: string, value: any) => {
    const newErrors = { ...errors };
    if (field === 'name') {
      if (!value || value.trim().length < 2) {
        newErrors.name = 'Full name must be at least 2 characters.';
      } else {
        delete newErrors.name;
      }
    }
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value || !emailRegex.test(value)) {
        newErrors.email = 'Valid operational contact email is required.';
      } else {
        delete newErrors.email;
      }
    }
    if (field === 'dates') {
      if (!value) {
        newErrors.dates = 'Departure date is required.';
      } else {
        delete newErrors.dates;
      }
    }
    setErrors(newErrors);
  };

  // Step Advancement
  const handleNextStep = () => {
    if (currentStep === 1 && !routeId) {
      setErrors({ routeId: 'Please select an active corridor.' });
      return;
    }
    if (currentStep === 2) {
      validateField('dates', dates);
      if (!dates) return;
    }
    if (currentStep === 3) {
      validateField('name', name);
      validateField('email', email);
      if (!name || !email || errors.name || errors.email) return;
    }
    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  // Submit Request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await submitSeatRequest({
        routeId,
        name,
        email,
        dates,
        partySize: Number(partySize),
        note,
        idempotencyKey,
        honeypot,
      });

      setConfirmedRef(res.ref);
      setSubmitting(false);

      // Trigger Scramble Text and Ticket Assembly
      setTimeout(() => {
        if (ticketRef.current) {
          gsap.fromTo(
            ticketRef.current,
            { opacity: 0, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.4)' }
          );
        }

        // Animated character resolution for Reference Number
        if (scrambleRef.current) {
          const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
          let iterations = 0;
          const target = res.ref;
          const interval = setInterval(() => {
            if (!scrambleRef.current) return;
            scrambleRef.current.innerText = target
              .split('')
              .map((letter, index) => {
                if (index < iterations) return target[index];
                return chars[Math.floor(Math.random() * chars.length)];
              })
              .join('');

            if (iterations >= target.length) {
              clearInterval(interval);
            }
            iterations += 1 / 3;
          }, 45);
        }
      }, 50);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to dispatch request.');
      setSubmitting(false);
    }
  };

  // Status Lookup & Live SSE Subscription
  const handleLookup = async (refToQuery?: string) => {
    const ref = (refToQuery || lookupRefInput).toUpperCase().trim();
    if (!ref) return;

    setLookupError(null);
    try {
      const statusData = await fetchRequestStatus(ref);
      setLookupResult(statusData);

      // Subscribe to live SSE updates for this ref
      const unsubscribe = subscribeToStatusUpdates(ref, (updated) => {
        setLookupResult((prev) => (prev ? { ...prev, status: updated.status as any, updatedAt: updated.updatedAt } : null));
        setIsLiveConnected(true);
      });
      setIsLiveConnected(true);

      return () => unsubscribe();
    } catch (err: any) {
      setLookupResult(null);
      setLookupError(err.message || 'Reference not found in active dispatch.');
    }
  };

  const selectedRouteObj = routes.find((r) => r.id === routeId);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#EEEBE4] py-16">
      <div className="grid-12">
        <div className="col-span-12 mb-10">
          <span className="micro-label">04 / DISPATCH ALLOCATION</span>
          <h1 className="font-display text-4xl md:text-6xl mt-2 tracking-tight">
            Seat & Charter Request
          </h1>
          <p className="prose-editorial text-sm mt-3">
            Submit a direct allocation request on certified corridors. Requests are processed atomically against live airframe seat capacity.
          </p>
        </div>

        {/* 4-Step Form Container */}
        <div className="col-span-12 lg:col-span-8 p-8 md:p-12 hairline-all bg-[#F7F5F0] relative">
          {/* Top Progress Bar */}
          <div className="w-full h-1 bg-[var(--ink-12)] mb-8 overflow-hidden">
            <div
              ref={progressLineRef}
              className="h-full bg-[var(--signal)] origin-left w-full"
              style={{ transform: 'scaleX(0.25)' }}
            />
          </div>

          <div className="flex justify-between items-center text-xs tabular text-[var(--ink-60)] mb-8 pb-4 hairline-b">
            <span>STEP 0{currentStep} / 04</span>
            <span className="uppercase font-semibold text-[var(--ink)]">
              {currentStep === 1 && 'Corridor Selection'}
              {currentStep === 2 && 'Dates & Party Manifest'}
              {currentStep === 3 && 'Passenger Dispatch Details'}
              {currentStep === 4 && 'Manifest Review & Teletype'}
            </span>
          </div>

          {/* Hidden Honeypot Bot Trap */}
          <input
            type="text"
            name="website_url_check"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {!confirmedRef ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Corridor Selection */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="micro-label block mb-2">SELECT ROUTE CORRIDOR</label>
                    <select
                      value={routeId}
                      onChange={(e) => setRouteId(e.target.value)}
                      className="w-full p-3.5 bg-white border border-[var(--ink-25)] font-sans text-sm focus:border-[var(--signal)] outline-none"
                    >
                      {routes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.originCity} ({r.originCode}) → {r.destCity} ({r.destCode}) • {r.aircraft} ({r.blockTime})
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-[var(--ink-60)] mt-2">
                      Required to assign airframe tail number and verify oceanic airway slot.
                    </p>
                  </div>

                  {selectedRouteObj && (
                    <div className="p-4 hairline-all bg-white text-xs tabular space-y-1">
                      <div className="font-bold text-[var(--ink)]">
                        {selectedRouteObj.originCity} → {selectedRouteObj.destCity}
                      </div>
                      <div className="text-[var(--ink-60)]">
                        {selectedRouteObj.distanceKm.toLocaleString()} KM • ALTITUDE FL{selectedRouteObj.altitudeFeet / 1000}0
                      </div>
                      <div className="text-[var(--signal)] font-semibold mt-1">
                        {selectedRouteObj.seatsLeftThisMonth} SEATS REMAINING IN CURRENT MONTH
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Dates and Party Size */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="micro-label block mb-2">DEPARTURE DATE</label>
                    <input
                      type="date"
                      value={dates}
                      onChange={(e) => setDates(e.target.value)}
                      onBlur={(e) => validateField('dates', e.target.value)}
                      min={new Date().toISOString().slice(0, 10)}
                      className="w-full p-3.5 bg-white border border-[var(--ink-25)] font-sans text-sm focus:border-[var(--signal)] outline-none tabular"
                    />
                    {errors.dates && <p className="text-xs text-[var(--signal)] mt-1">{errors.dates}</p>}
                    <p className="text-[11px] text-[var(--ink-60)] mt-2">
                      Required to schedule ramp handling and verify Shanwick/Gander airway timing.
                    </p>
                  </div>

                  <div>
                    <label className="micro-label block mb-2">
                      PARTY SIZE (1 TO 12 PASSENGERS)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={partySize}
                      onChange={(e) => setPartySize(parseInt(e.target.value, 10) || 1)}
                      className="w-full p-3.5 bg-white border border-[var(--ink-25)] font-sans text-sm focus:border-[var(--signal)] outline-none tabular"
                    />
                    <p className="text-[11px] text-[var(--ink-60)] mt-2">
                      Required to verify weight and balance calculations under FAR Part 135 regulations.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Passenger Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="micro-label block mb-2">LEAD PASSENGER NAME</label>
                    <input
                      type="text"
                      placeholder="e.g. Alistair Sterling"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={(e) => validateField('name', e.target.value)}
                      className="w-full p-3.5 bg-white border border-[var(--ink-25)] font-sans text-sm focus:border-[var(--signal)] outline-none"
                    />
                    {errors.name && <p className="text-xs text-[var(--signal)] mt-1">{errors.name}</p>}
                    <p className="text-[11px] text-[var(--ink-60)] mt-2">
                      Required solely for dispatch clearance teletype and passenger flight manifest.
                    </p>
                  </div>

                  <div>
                    <label className="micro-label block mb-2">OPERATIONAL EMAIL</label>
                    <input
                      type="email"
                      placeholder="e.g. a.sterling@sterling-holdings.co"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={(e) => validateField('email', e.target.value)}
                      className="w-full p-3.5 bg-white border border-[var(--ink-25)] font-sans text-sm focus:border-[var(--signal)] outline-none"
                    />
                    {errors.email && <p className="text-xs text-[var(--signal)] mt-1">{errors.email}</p>}
                    <p className="text-[11px] text-[var(--ink-60)] mt-2">
                      Used strictly for confirmation and live dispatch status notifications. Zero promotional emails.
                    </p>
                  </div>

                  <div>
                    <label className="micro-label block mb-2">SPECIAL DISPATCH NOTES (OPTIONAL)</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Connecting helicopter transfer at Battersea FBO, or quiet cabin protocol."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full p-3.5 bg-white border border-[var(--ink-25)] font-sans text-sm focus:border-[var(--signal)] outline-none"
                    />
                    <p className="text-[11px] text-[var(--ink-60)] mt-2">
                      Optional dietary, medical, or ground handling requirements at private terminal.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Verification & Teletype */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="p-6 hairline-all bg-white space-y-3 text-xs tabular">
                    <div className="flex justify-between py-1.5 hairline-b">
                      <span className="text-[var(--ink-60)]">CORRIDOR</span>
                      <span className="font-bold">{selectedRouteObj?.originCity} → {selectedRouteObj?.destCity}</span>
                    </div>
                    <div className="flex justify-between py-1.5 hairline-b">
                      <span className="text-[var(--ink-60)]">DEPARTURE DATE</span>
                      <span className="font-bold">{dates}</span>
                    </div>
                    <div className="flex justify-between py-1.5 hairline-b">
                      <span className="text-[var(--ink-60)]">PASSENGERS</span>
                      <span className="font-bold">{partySize} SEATS</span>
                    </div>
                    <div className="flex justify-between py-1.5 hairline-b">
                      <span className="text-[var(--ink-60)]">LEAD PASSENGER</span>
                      <span className="font-bold">{name}</span>
                    </div>
                    <div className="flex justify-between py-1.5 hairline-b">
                      <span className="text-[var(--ink-60)]">DISPATCH CONTACT</span>
                      <span className="font-bold">{email}</span>
                    </div>
                    {note && (
                      <div className="pt-2">
                        <span className="text-[var(--ink-60)] block mb-1">NOTES:</span>
                        <p className="text-[var(--ink)] italic">{note}</p>
                      </div>
                    )}
                  </div>

                  {submitError && (
                    <div className="p-4 bg-[#E8431A]/10 border border-[var(--signal)] text-xs text-[var(--signal)]">
                      {submitError}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Actions */}
              <div className="flex justify-between items-center pt-6 hairline-t">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                    className="btn-editorial py-2.5 px-5 text-xs"
                  >
                    <span>← Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn-editorial btn-signal py-2.5 px-6 text-xs"
                  >
                    <span>Continue →</span>
                  </button>
                ) : (
                  <button
                    ref={magneticBtnRef}
                    type="submit"
                    disabled={submitting}
                    className="btn-editorial btn-signal py-3 px-8 text-xs font-bold"
                  >
                    <span>{submitting ? 'Transmitting Request...' : 'Transmit Seat Request'}</span>
                  </button>
                )}
              </div>
            </form>
          ) : (
            /* 7. Assembled Ticket with Perforation & ScrambleText Ref */
            <div ref={ticketRef} className="p-8 hairline-all bg-white relative">
              <div className="flex justify-between items-start pb-6 border-b-2 border-dashed border-[var(--ink-25)]">
                <div>
                  <span className="micro-label text-[var(--signal)]">SEAT REQUEST LOGGED</span>
                  <h2 className="font-display text-4xl mt-1">Flight Dispatch Manifest</h2>
                </div>
                <div className="text-right">
                  <span className="micro-label text-[10px]">REFERENCE NO.</span>
                  <div className="font-display text-3xl tabular font-bold text-[var(--ink)]">
                    <span ref={scrambleRef}>{confirmedRef}</span>
                  </div>
                </div>
              </div>

              <div className="py-6 space-y-3 text-xs tabular border-b-2 border-dashed border-[var(--ink-25)]">
                <div className="flex justify-between">
                  <span className="text-[var(--ink-60)]">CORRIDOR:</span>
                  <span className="font-bold">{selectedRouteObj?.originCity} ({selectedRouteObj?.originCode}) → {selectedRouteObj?.destCity} ({selectedRouteObj?.destCode})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--ink-60)]">SCHEDULED DEPARTURE:</span>
                  <span className="font-bold">{dates}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--ink-60)]">ALLOCATED PARTY:</span>
                  <span className="font-bold">{partySize} PASSENGERS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--ink-60)]">DISPATCH STATUS:</span>
                  <span className="font-bold text-[var(--signal)]">RECEIVED • PENDING FINAL CREW ASSIGNMENT</span>
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                <p className="text-[var(--ink-60)] text-[11px]">
                  Confirmation teletype transmitted to {email}. You can monitor this request live below.
                </p>
                <button
                  onClick={() => {
                    setLookupRefInput(confirmedRef);
                    handleLookup(confirmedRef);
                  }}
                  className="btn-editorial py-2 px-4 text-xs whitespace-nowrap"
                >
                  <span>Track Status Live ↓</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Dispatch Protocol */}
        <div className="col-span-12 lg:col-span-4 mt-8 lg:mt-0 p-8 hairline-all bg-[#F7F5F0]">
          <span className="micro-label text-[10px]">CHARTER DISPATCH PROTOCOL</span>
          <h3 className="font-display text-2xl mt-2 mb-4">Atomic Seat Reservation</h3>
          <p className="text-xs text-[var(--ink-80)] leading-relaxed mb-6">
            Unlike commercial ticketing systems, seat allotments on Aero 34 airframes decrement atomically inside transactional database records. Two requests can never capture the same seat simultaneously.
          </p>

          <div className="space-y-3 text-xs tabular text-[var(--ink-80)] pb-6 hairline-b">
            <div>• ZERO DOUBLE-BOOKINGS GUARANTEED</div>
            <div>• IDEMPOTENT SUBMISSIONS PROTECTED</div>
            <div>• PRIVATE FBO TERMINAL CLEARANCE</div>
            <div>• REAL-TIME SSE STATUS BROADCAST</div>
          </div>

          <div className="mt-6 text-[11px] text-[var(--ink-60)]">
            Aero 34 Operations Teletype: DISPATCH@AERO34.COM
          </div>
        </div>

        {/* 8. Live Status Lookup & SSE Tracker */}
        <div className="col-span-12 mt-16 p-8 md:p-12 hairline-all bg-[#0A0A09] text-[#EEEBE4]">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
            <div>
              <span className="micro-label text-[#E8431A]">LIVE SSE TELETYPE TRACKER</span>
              <h2 className="font-display text-3xl md:text-4xl mt-2 text-white">
                Request Status Inquiry
              </h2>
            </div>
            {isLiveConnected && (
              <span className="text-xs text-[#E8431A] tabular font-bold flex items-center gap-2 mt-2 md:mt-0">
                <span className="w-2 h-2 rounded-full bg-[#E8431A] animate-pulse" />
                LIVE SSE CONNECTION ACTIVE
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mb-8">
            <input
              type="text"
              placeholder="ENTER REFERENCE (E.G. AR-7K2Q9)"
              value={lookupRefInput}
              onChange={(e) => setLookupRefInput(e.target.value.toUpperCase())}
              className="flex-1 p-3.5 bg-white/10 border border-white/20 text-white font-mono text-sm uppercase placeholder:text-white/40 focus:border-[#E8431A] outline-none"
            />
            <button
              onClick={() => handleLookup()}
              className="btn-editorial bg-white text-[#0A0A09] hover:bg-[#E8431A] hover:text-white border-none py-3.5 px-6 text-xs whitespace-nowrap"
            >
              <span>Verify Status</span>
            </button>
          </div>

          {lookupError && (
            <div className="p-4 bg-[#E8431A]/20 border border-[#E8431A] text-xs text-[#E8431A] max-w-xl">
              {lookupError}
            </div>
          )}

          {lookupResult && (
            <div className="p-6 border border-white/20 bg-white/5 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-white/10 gap-2">
                <div>
                  <span className="micro-label text-white/60">REFERENCE: {lookupResult.ref}</span>
                  <div className="font-display text-2xl text-white mt-1">
                    {lookupResult.originCity} ({lookupResult.originCode}) → {lookupResult.destCity} ({lookupResult.destCode})
                  </div>
                </div>
                <div className="text-right text-xs tabular text-white/60">
                  <div>AIRFRAME: {lookupResult.aircraft}</div>
                  <div>DATE: {lookupResult.dates} • {lookupResult.partySize} SEATS</div>
                </div>
              </div>

              {/* 4-Step Animated Status Line: Received -> Confirming -> Held -> Declined */}
              <div>
                <span className="micro-label text-white/60 block mb-4">DISPATCH LIFECYCLE</span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs tabular font-bold">
                  {['Received', 'Confirming', 'Held', 'Declined'].map((stepStatus) => {
                    const isActive = lookupResult.status === stepStatus;
                    const isPassed =
                      (lookupResult.status === 'Confirming' && stepStatus === 'Received') ||
                      (lookupResult.status === 'Held' && (stepStatus === 'Received' || stepStatus === 'Confirming'));

                    return (
                      <div
                        key={stepStatus}
                        className={`p-3 border transition-all ${
                          isActive
                            ? 'bg-[#E8431A] text-white border-[#E8431A]'
                            : isPassed
                            ? 'bg-white/20 text-white border-white/30'
                            : 'bg-white/5 text-white/40 border-white/10'
                        }`}
                      >
                        <div>{stepStatus.toUpperCase()}</div>
                        {isActive && <div className="text-[10px] font-normal mt-1">CURRENT STATUS</div>}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-right text-[11px] tabular text-white/40 pt-2">
                LAST TELETYPE UPDATE: {new Date(lookupResult.updatedAt).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
