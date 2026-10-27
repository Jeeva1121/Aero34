import React, { useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    fetchRoutes().then((data) => {
      setRoutes(data);
      if (!routeId && data.length > 0) {
        setRouteId(data[0].id);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (initialRef) {
      handleLookup(initialRef);
    }
  }, [initialRef]);

  // Magnetic button on submit
  useEffect(() => {
    const btn = magneticBtnRef.current;
    if (!btn || window.matchMedia('(pointer: coarse)').matches) return;

    const xTo = gsap.quickTo(btn, 'x', { duration: 0.35, ease: 'power2.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.35, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.hypot(distX, distY);

      if (distance < 80) {
        xTo(distX * 0.25);
        yTo(distY * 0.25);
      } else {
        xTo(0);
        yTo(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [currentStep]);

  useEffect(() => {
    if (progressLineRef.current) {
      gsap.to(progressLineRef.current, {
        scaleX: currentStep / 4,
        duration: 0.35,
        ease: 'power3.out',
      });
    }
  }, [currentStep]);

  const validateField = (field: string, value: any) => {
    const newErrors = { ...errors };
    if (field === 'name') {
      if (!value || value.trim().length < 2) {
        newErrors.name = 'Please provide your full name.';
      } else {
        delete newErrors.name;
      }
    }
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value || !emailRegex.test(value)) {
        newErrors.email = 'Please provide a valid email address.';
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

  const handleNextStep = () => {
    if (currentStep === 1 && !routeId) {
      setErrors({ routeId: 'Please select a route.' });
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

      setTimeout(() => {
        if (ticketRef.current) {
          gsap.fromTo(
            ticketRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
          );
        }
        if (scrambleRef.current) {
          scrambleRef.current.innerText = res.ref;
        }
      }, 50);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit seat request.');
      setSubmitting(false);
    }
  };

  const handleLookup = async (refToQuery?: string) => {
    const ref = (refToQuery || lookupRefInput).toUpperCase().trim();
    if (!ref) return;

    setLookupError(null);
    try {
      const statusData = await fetchRequestStatus(ref);
      setLookupResult(statusData);

      const unsubscribe = subscribeToStatusUpdates(ref, (updated) => {
        setLookupResult((prev) => (prev ? { ...prev, status: updated.status as any, updatedAt: updated.updatedAt } : null));
        setIsLiveConnected(true);
      });
      setIsLiveConnected(true);

      return () => unsubscribe();
    } catch (err: any) {
      setLookupResult(null);
      setLookupError(err.message || 'Reference not found.');
    }
  };

  const selectedRouteObj = routes.find((r) => r.id === routeId);

  return (
    <div ref={containerRef} className="min-h-screen bg-white py-16">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-10 pb-6 border-b border-[rgba(10,10,9,0.08)]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8431A]">
            Direct Reservation
          </span>
          <h1 className="font-display text-4xl sm:text-6xl text-[#0A0A09] tracking-tight mt-1 mb-3">
            Request a Seat
          </h1>
          <p className="text-sm sm:text-base text-[#0A0A09]/75 max-w-xl leading-relaxed">
            Reserve your seat or charter an entire airframe. Seat availability updates atomically upon submission.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main 4-Step Form: Sharp Square Card */}
          <div className="lg:col-span-8 bg-white rounded-none p-8 sm:p-12 border border-[rgba(10,10,9,0.12)] shadow-sm">
            {/* Step Progress Line */}
            <div className="w-full h-1.5 bg-[#0A0A09]/10 rounded-none mb-8 overflow-hidden">
              <div
                ref={progressLineRef}
                className="h-full bg-[#E8431A] origin-left rounded-none w-full"
                style={{ transform: 'scaleX(0.25)' }}
              />
            </div>

            <div className="flex justify-between items-center text-xs text-[#0A0A09]/60 mb-8 pb-4 border-b border-[rgba(10,10,9,0.06)]">
              <span className="font-semibold text-[#0A0A09]">Step {currentStep} of 4</span>
              <span className="font-medium text-[#0A0A09]/80">
                {currentStep === 1 && 'Select Route'}
                {currentStep === 2 && 'Dates & Guests'}
                {currentStep === 3 && 'Contact Details'}
                {currentStep === 4 && 'Review & Send'}
              </span>
            </div>

            {/* Honeypot Bot Trap */}
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
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Route Selection */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#0A0A09]/70">
                      Choose Your Route
                    </label>
                    <select
                      value={routeId}
                      onChange={(e) => setRouteId(e.target.value)}
                      className="w-full p-4 rounded-none bg-[#F9FAFB] border border-[rgba(10,10,9,0.12)] text-sm font-medium text-[#0A0A09] focus:border-[#E8431A] outline-none"
                    >
                      {routes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.originCity} ({r.originCode}) → {r.destCity} ({r.destCode}) • {r.aircraft} ({r.blockTime})
                        </option>
                      ))}
                    </select>

                    {selectedRouteObj && (
                      <div className="mt-4 p-4 rounded-none bg-[#F9FAFB] border border-[rgba(10,10,9,0.08)] text-xs space-y-1">
                        <div className="font-bold text-sm text-[#0A0A09]">
                          {selectedRouteObj.originCity} to {selectedRouteObj.destCity}
                        </div>
                        <div className="text-[#0A0A09]/60 font-mono">
                          {selectedRouteObj.distanceKm.toLocaleString()} KM • {selectedRouteObj.blockTime} Non-stop
                        </div>
                        <div className="text-[#E8431A] font-semibold pt-1">
                          {selectedRouteObj.seatsLeftThisMonth} seats available this month
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Date & Party Size */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#0A0A09]/70 mb-2">
                        Preferred Departure Date
                      </label>
                      <input
                        type="date"
                        value={dates}
                        onChange={(e) => setDates(e.target.value)}
                        onBlur={(e) => validateField('dates', e.target.value)}
                        min={new Date().toISOString().slice(0, 10)}
                        className="w-full p-4 rounded-none bg-[#F9FAFB] border border-[rgba(10,10,9,0.12)] text-sm font-medium text-[#0A0A09] focus:border-[#E8431A] outline-none"
                      />
                      {errors.dates && <p className="text-xs text-[#E8431A] mt-1">{errors.dates}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#0A0A09]/70 mb-2">
                        Number of Passengers (1 to 12)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={partySize}
                        onChange={(e) => setPartySize(parseInt(e.target.value, 10) || 1)}
                        className="w-full p-4 rounded-none bg-[#F9FAFB] border border-[rgba(10,10,9,0.12)] text-sm font-medium text-[#0A0A09] focus:border-[#E8431A] outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Passenger Details */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#0A0A09]/70 mb-2">
                        Lead Passenger Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Alistair Sterling"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={(e) => validateField('name', e.target.value)}
                        className="w-full p-4 rounded-none bg-[#F9FAFB] border border-[rgba(10,10,9,0.12)] text-sm font-medium text-[#0A0A09] focus:border-[#E8431A] outline-none"
                      />
                      {errors.name && <p className="text-xs text-[#E8431A] mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#0A0A09]/70 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. alistair@sterling.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={(e) => validateField('email', e.target.value)}
                        className="w-full p-4 rounded-none bg-[#F9FAFB] border border-[rgba(10,10,9,0.12)] text-sm font-medium text-[#0A0A09] focus:border-[#E8431A] outline-none"
                      />
                      {errors.email && <p className="text-xs text-[#E8431A] mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#0A0A09]/70 mb-2">
                        Special Requests or Preferences (Optional)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Quiet cabin protocol or ground transport transfer upon arrival."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full p-4 rounded-none bg-[#F9FAFB] border border-[rgba(10,10,9,0.12)] text-sm font-medium text-[#0A0A09] focus:border-[#E8431A] outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Review & Send */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-none bg-[#F9FAFB] border border-[rgba(10,10,9,0.08)] space-y-3 text-xs">
                      <div className="flex justify-between py-2 border-b border-[rgba(10,10,9,0.06)]">
                        <span className="text-[#0A0A09]/60">Route</span>
                        <span className="font-bold text-[#0A0A09]">{selectedRouteObj?.originCity} → {selectedRouteObj?.destCity}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[rgba(10,10,9,0.06)]">
                        <span className="text-[#0A0A09]/60">Departure Date</span>
                        <span className="font-bold text-[#0A0A09]">{dates}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[rgba(10,10,9,0.06)]">
                        <span className="text-[#0A0A09]/60">Passengers</span>
                        <span className="font-bold text-[#0A0A09]">{partySize} Seats</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[rgba(10,10,9,0.06)]">
                        <span className="text-[#0A0A09]/60">Passenger Name</span>
                        <span className="font-bold text-[#0A0A09]">{name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[rgba(10,10,9,0.06)]">
                        <span className="text-[#0A0A09]/60">Email</span>
                        <span className="font-bold text-[#0A0A09]">{email}</span>
                      </div>
                      {note && (
                        <div className="pt-2">
                          <span className="text-[#0A0A09]/60 block mb-1">Notes:</span>
                          <p className="text-[#0A0A09]">{note}</p>
                        </div>
                      )}
                    </div>

                    {submitError && (
                      <div className="p-4 rounded-none bg-[#E8431A]/10 border border-[#E8431A] text-xs text-[#E8431A]">
                        {submitError}
                      </div>
                    )}
                  </div>
                )}

                {/* Form Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-[rgba(10,10,9,0.06)]">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                      className="px-5 py-2.5 rounded-none border border-[#0A0A09] text-[#0A0A09] hover:bg-[#0A0A09] hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer"
                    >
                      ← Back
                    </button>
                  ) : <div />}

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-2.5 rounded-none bg-[#0A0A09] text-white hover:bg-[#E8431A] text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer"
                    >
                      Continue →
                    </button>
                  ) : (
                    <button
                      ref={magneticBtnRef}
                      type="submit"
                      disabled={submitting}
                      className="px-8 py-3 rounded-none bg-[#E8431A] text-white hover:bg-[#0A0A09] text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer shadow-sm"
                    >
                      {submitting ? 'Submitting...' : 'Confirm Request'}
                    </button>
                  )}
                </div>
              </form>
            ) : (
              /* Success Confirmation Card: Sharp Square Ticket */
              <div ref={ticketRef} className="p-8 rounded-none bg-[#F9FAFB] border border-[rgba(10,10,9,0.12)]">
                <div className="flex justify-between items-start pb-6 border-b border-dashed border-[#0A0A09]/20">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8431A]">Confirmed</span>
                    <h2 className="font-display text-3xl sm:text-4xl text-[#0A0A09] mt-1">Request Received</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-[#0A0A09]/60 block">Reference Code</span>
                    <span ref={scrambleRef} className="font-mono text-2xl sm:text-3xl font-bold text-[#E8431A]">
                      {confirmedRef}
                    </span>
                  </div>
                </div>

                <div className="py-6 space-y-2 text-xs border-b border-dashed border-[#0A0A09]/20">
                  <div className="flex justify-between">
                    <span className="text-[#0A0A09]/60">Route</span>
                    <span className="font-bold text-[#0A0A09]">{selectedRouteObj?.originCity} to {selectedRouteObj?.destCity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#0A0A09]/60">Date</span>
                    <span className="font-bold text-[#0A0A09]">{dates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#0A0A09]/60">Party Size</span>
                    <span className="font-bold text-[#0A0A09]">{partySize} Passengers</span>
                  </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                  <p className="text-[#0A0A09]/70">
                    A confirmation email has been logged for {email}. You can monitor this request live below.
                  </p>
                  <button
                    onClick={() => {
                      setLookupRefInput(confirmedRef);
                      handleLookup(confirmedRef);
                    }}
                    className="px-5 py-2.5 rounded-none bg-[#0A0A09] text-white hover:bg-[#E8431A] transition-colors whitespace-nowrap font-bold uppercase tracking-wider text-xs cursor-pointer"
                  >
                    Track Status Below ↓
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Guarantee Card: Sharp Square Card */}
          <div className="lg:col-span-4 bg-white rounded-none p-8 border border-[rgba(10,10,9,0.12)] shadow-sm space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8431A]">Direct Service</span>
              <h3 className="font-display text-2xl text-[#0A0A09] mt-1 mb-3">Guaranteed Seat Booking</h3>
              <p className="text-xs text-[#0A0A09]/75 leading-relaxed">
                Every reservation holds an authentic seat on certified executive aircraft with direct private VIP terminal departures.
              </p>
            </div>

            <div className="space-y-3 text-xs text-[#0A0A09]/80 border-t border-[rgba(10,10,9,0.08)] pt-4">
              <div className="flex items-center gap-2">✓ No commercial airport terminals</div>
              <div className="flex items-center gap-2">✓ Instant atomic seat availability</div>
              <div className="flex items-center gap-2">✓ Real-time status inquiry via reference code</div>
            </div>
          </div>
        </div>

        {/* Live Status Tracker: Sharp Modernist Square Container */}
        <div className="mt-16 bg-[#0A0A09] text-white rounded-none p-8 sm:p-12 shadow-xl border border-[#0A0A09]">
          <div className="flex flex-col sm:flex-row justify-between items-baseline mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8431A]">Live Tracker</span>
              <h2 className="font-display text-3xl sm:text-4xl mt-1 text-white">Track Flight Request</h2>
            </div>
            {isLiveConnected && (
              <span className="text-xs text-[#E8431A] font-bold flex items-center gap-2 mt-2 sm:mt-0 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-none bg-[#E8431A] animate-pulse" />
                Live Connection Active
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mb-6">
            <input
              type="text"
              placeholder="Enter reference code (e.g. AR-7K2Q9)"
              value={lookupRefInput}
              onChange={(e) => setLookupRefInput(e.target.value.toUpperCase())}
              className="flex-1 p-3.5 rounded-none bg-white/10 border border-white/20 text-white font-mono text-sm uppercase placeholder:text-white/40 focus:border-[#E8431A] outline-none"
            />
            <button
              onClick={() => handleLookup()}
              className="px-6 py-3.5 rounded-none bg-[#E8431A] text-white hover:bg-white hover:text-[#0A0A09] text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer shadow-sm"
            >
              Verify Status
            </button>
          </div>

          {lookupError && (
            <div className="p-4 rounded-none bg-[#E8431A]/20 border border-[#E8431A] text-xs text-[#E8431A] max-w-xl mb-6">
              {lookupError}
            </div>
          )}

          {lookupResult && (
            <div className="p-6 rounded-none border border-white/10 bg-white/5 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-white/10 gap-2">
                <div>
                  <span className="text-[11px] font-mono text-white/50 block">Ref: {lookupResult.ref}</span>
                  <div className="font-display text-2xl text-white mt-0.5">
                    {lookupResult.originCity} to {lookupResult.destCity}
                  </div>
                </div>
                <div className="text-right text-xs text-white/70">
                  <div>Aircraft: {lookupResult.aircraft}</div>
                  <div>Date: {lookupResult.dates} • {lookupResult.partySize} Passengers</div>
                </div>
              </div>

              {/* 4-Step Status Progress Bar */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block mb-3">Request Progress</span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
                  {['Received', 'Confirming', 'Held', 'Declined'].map((stepStatus) => {
                    const isActive = lookupResult.status === stepStatus;
                    const isPassed =
                      (lookupResult.status === 'Confirming' && stepStatus === 'Received') ||
                      (lookupResult.status === 'Held' && (stepStatus === 'Received' || stepStatus === 'Confirming'));

                    return (
                      <div
                        key={stepStatus}
                        className={`p-3 rounded-none border transition-all ${
                          isActive
                            ? 'bg-[#E8431A] text-white border-[#E8431A]'
                            : isPassed
                            ? 'bg-white/20 text-white border-white/30'
                            : 'bg-white/5 text-white/30 border-white/10'
                        }`}
                      >
                        <div>{stepStatus}</div>
                        {isActive && <div className="text-[10px] font-normal mt-0.5 opacity-90">Current State</div>}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-right text-[11px] text-white/40 pt-1 font-mono">
                Last updated: {new Date(lookupResult.updatedAt).toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
