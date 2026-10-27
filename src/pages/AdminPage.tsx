import React, { useEffect, useState } from 'react';
import {
  adminLogin,
  adminLogout,
  adminCheckAuth,
  adminFetchRequests,
  adminPatchStatus,
} from '../lib/api.js';
import { RequestRecord } from '../../shared/schemas.js';

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingRef, setUpdatingRef] = useState<string | null>(null);

  // Check existing session
  useEffect(() => {
    adminCheckAuth()
      .then((ok) => {
        setIsAuthenticated(ok);
        if (ok) {
          loadRequests('all');
        }
        setLoadingAuth(false);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setLoadingAuth(false);
      });
  }, []);

  const loadRequests = async (filter: string) => {
    try {
      const data = await adminFetchRequests(filter);
      setRequests(data);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      await adminLogin(username, password);
      setIsAuthenticated(true);
      loadRequests(statusFilter);
    } catch (err: any) {
      setLoginError(err.message || 'Authentication rejected');
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    setIsAuthenticated(false);
    setRequests([]);
  };

  const handleStatusChange = async (ref: string, newStatus: string) => {
    setUpdatingRef(ref);
    try {
      await adminPatchStatus(ref, newStatus);
      setRequests((prev) =>
        prev.map((r) => (r.ref === ref ? { ...r, status: newStatus as any } : r))
      );
    } catch {
      // safe error handle
    } finally {
      setUpdatingRef(null);
    }
  };

  const handleFilterChange = (filter: string) => {
    setStatusFilter(filter);
    loadRequests(filter);
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen py-32 grid-12 bg-white">
        <div className="col-span-12 h-64 skeleton-bone rounded-none" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="grid-12">
        <div className="col-span-12 mb-10 pb-6 hairline-b flex flex-col md:flex-row justify-between items-baseline gap-4">
          <div>
            <span className="micro-label">OPERATIONS CONSOLE</span>
            <h1 className="font-display text-4xl md:text-5xl mt-2 tracking-tight text-[#0A0A09]">
              Dispatch Administration
            </h1>
          </div>
          {isAuthenticated && (
            <div className="flex items-center gap-4 text-xs tabular">
              <span className="text-[var(--ink-60)]">AUTHENTICATED DISPATCHER</span>
              <button
                onClick={handleLogout}
                className="btn-editorial py-1.5 px-3 text-[11px] rounded-none"
              >
                <span>Terminate Session</span>
              </button>
            </div>
          )}
        </div>

        {!isAuthenticated ? (
          /* Login Form */
          <div className="col-span-12 md:col-span-6 md:col-start-4 p-8 md:p-12 border border-[rgba(10,10,9,0.12)] bg-white rounded-none shadow-sm">
            <span className="micro-label text-[var(--signal)]">AUTHENTICATION REQUIRED</span>
            <h2 className="font-display text-2xl mt-2 mb-6 text-[#0A0A09]">Operations Clearance</h2>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="micro-label block mb-2">DISPATCH USERNAME</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full p-3.5 bg-[#F9FAFB] border border-[rgba(10,10,9,0.12)] font-mono text-sm focus:border-[var(--signal)] outline-none rounded-none text-[#0A0A09]"
                />
              </div>

              <div>
                <label className="micro-label block mb-2">ACCESS CREDENTIAL</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full p-3.5 bg-[#F9FAFB] border border-[rgba(10,10,9,0.12)] font-mono text-sm focus:border-[var(--signal)] outline-none rounded-none text-[#0A0A09]"
                />
              </div>

              {loginError && (
                <div className="p-3 bg-[#E8431A]/10 border border-[var(--signal)] text-xs text-[var(--signal)] rounded-none">
                  {loginError}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-editorial btn-signal w-full py-3 text-xs font-bold rounded-none"
                >
                  <span>Authenticate Dispatcher</span>
                </button>
              </div>

              <div className="text-[11px] text-[var(--ink-60)] tabular pt-2">
                Five consecutive authentication failures enforce an automatic 15-minute operational lockout on the client IP address.
              </div>
            </form>
          </div>
        ) : (
          /* Live Dispatch Requests Table */
          <div className="col-span-12">
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-2 items-center mb-6">
              <span className="micro-label text-[10px] mr-2">STATUS FILTER:</span>
              {['all', 'Received', 'Confirming', 'Held', 'Declined'].map((st) => (
                <button
                  key={st}
                  onClick={() => handleFilterChange(st)}
                  className={`py-1 px-3 text-xs tabular uppercase font-semibold border rounded-none transition-all ${
                    statusFilter === st
                      ? 'bg-[#0A0A09] text-white border-[#0A0A09]'
                      : 'bg-white text-[var(--ink-80)] border-[rgba(10,10,9,0.12)] hover:border-[#0A0A09]'
                  }`}
                >
                  {st.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="border border-[rgba(10,10,9,0.12)] bg-white rounded-none shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs tabular border-collapse">
                <thead>
                  <tr className="border-b border-[rgba(10,10,9,0.08)] bg-[#F9FAFB] text-[var(--ink-60)] uppercase text-[10px] tracking-wider">
                    <th className="p-4">REF</th>
                    <th className="p-4">PASSENGER</th>
                    <th className="p-4">CORRIDOR</th>
                    <th className="p-4">DATE & SEATS</th>
                    <th className="p-4">NOTES</th>
                    <th className="p-4">DISPATCH STATUS</th>
                    <th className="p-4 text-right">CREATED</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr
                      key={r.ref}
                      className="border-b border-[rgba(10,10,9,0.06)] hover:bg-[#F9FAFB] transition-colors"
                    >
                      <td className="p-4 font-bold text-[var(--ink)] whitespace-nowrap">
                        {r.ref}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-[var(--ink)]">{r.name}</div>
                        <div className="text-[11px] text-[var(--ink-60)]">{r.email}</div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div>{r.routeTitle}</div>
                        <div className="text-[11px] text-[var(--ink-60)]">{r.aircraft}</div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div>{r.dates}</div>
                        <div className="text-[11px] text-[var(--ink-60)]">{r.partySize} SEATS</div>
                      </td>
                      <td className="p-4 max-w-xs truncate text-[11px] text-[var(--ink-80)]">
                        {r.note || '—'}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <select
                          value={r.status}
                          disabled={updatingRef === r.ref}
                          onChange={(e) => handleStatusChange(r.ref, e.target.value)}
                          className={`p-1.5 text-xs font-bold border rounded-none outline-none cursor-pointer ${
                            r.status === 'Held'
                              ? 'bg-[#E8431A] text-white border-[#E8431A]'
                              : r.status === 'Confirming'
                              ? 'bg-[#0A0A09] text-white border-[#0A0A09]'
                              : r.status === 'Declined'
                              ? 'bg-transparent text-[var(--ink-40)] border-[rgba(10,10,9,0.2)]'
                              : 'bg-white text-[var(--ink)] border-[rgba(10,10,9,0.2)]'
                          }`}
                        >
                          <option value="Received">Received</option>
                          <option value="Confirming">Confirming</option>
                          <option value="Held">Held</option>
                          <option value="Declined">Declined</option>
                        </select>
                      </td>
                      <td className="p-4 text-right text-[11px] text-[var(--ink-60)] whitespace-nowrap">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-xs text-[var(--ink-60)]">
                        No requests found under current filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
