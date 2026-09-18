"use client";

import { useState } from "react";
import { mockAdminUsers, USERS_TODAY, USERS_MONTH, userLastActive, userTotals, usersCsv, type AdminUser } from "@/data/admin/mockAdminUsers";
import { bookingDate } from "@/data/admin/mockAdminBookings";
import { formatRupees } from "@/data/admin/mockAdmin";
import { AdminPageHeader } from "./admin-page-header";
import { AdminStatCard } from "./admin-stat-card";
import { AdminIcon } from "./admin-icon";
import { AdminUserDetails, UserAvatar, UserBadge, UserDialog, userButton } from "./admin-user-details";

const control = "min-h-10 rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-600 focus-visible:outline-2 focus-visible:outline-neutral-800";
const pageSize = 10;
export function AdminUsers() {
  const [users, setUsers] = useState(mockAdminUsers);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [blocking, setBlocking] = useState<AdminUser | null>(null);
  const [notice, setNotice] = useState("");
  const selected = users.find(user => user.id === selectedId);
  const invalidDates = Boolean(from && to && from > to);
  const query = search.trim().toLowerCase();
  const digits = query.replace(/\D/g, "");
  const filtered = users.filter(user => (!query || user.name.toLowerCase().includes(query) || user.phone.includes(query) || (digits && /^[+\d\s()-]+$/.test(query) && user.phone.replace(/\D/g, "").includes(digits))) && (!status || user.status === status) && !invalidDates && (!from || user.signupDate >= from) && (!to || user.signupDate <= to));
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const start = (currentPage - 1) * pageSize;
  const visible = filtered.slice(start, start + pageSize);
  function reset() { setSearch(""); setStatus(""); setFrom(""); setTo(""); setPage(1); }
  function changeStatus(user: AdminUser, next: AdminUser["status"]) {
    setUsers(current => current.map(item => item.id === user.id ? { ...item, status: next } : item));
    setNotice(`${user.name} ${next === "BLOCKED" ? "blocked" : "unblocked"} in this preview.`);
  }
  function exportCsv() {
    const url = URL.createObjectURL(new Blob(["\uFEFF", usersCsv(filtered)], { type: "text/csv;charset=utf-8;" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "arenax-users.csv"; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); setNotice(`Exported ${filtered.length} users.`);
  }
  return <>
    <AdminPageHeader title="Users" subtitle="View and manage all players registered on the platform"><button type="button" onClick={exportCsv} disabled={!filtered.length} className={`${userButton} flex items-center gap-2 bg-white disabled:opacity-40`}><AdminIcon name="export" />Export</button></AdminPageHeader>
    <dl aria-label="Users summary" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"><AdminStatCard compact label="TOTAL USERS" value={String(users.length)} icon="users" /><AdminStatCard compact label="ACTIVE THIS MONTH" value={String(users.filter(user => user.status === "ACTIVE" && user.lastActive.startsWith(USERS_MONTH)).length)} icon="check" /><AdminStatCard compact label="NEW SIGNUPS" value={String(users.filter(user => user.signupDate.startsWith(USERS_MONTH)).length)} icon="plus" /><AdminStatCard compact label="BLOCKED" value={String(users.filter(user => user.status === "BLOCKED").length)} icon="close" /></dl>
    <p className="mt-3 text-xs text-neutral-500">Preview date: {bookingDate(USERS_TODAY)} · Activity and new signups are for this month.</p>
    <section aria-label="User filters" className="mt-5 rounded-xl border border-neutral-200 bg-white p-4 shadow-xs"><div className="flex flex-wrap items-center gap-3"><div className="relative min-w-40 flex-1"><label htmlFor="user-search" className="sr-only">Search by name or phone</label><span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400"><AdminIcon name="search" /></span><input id="user-search" type="search" placeholder="Search by name or phone" value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} className={`${control} w-full bg-neutral-50 pl-10`} /></div><select aria-label="Status" value={status} onChange={event => { setStatus(event.target.value); setPage(1); }} className={control}><option value="">Status: All</option><option value="ACTIVE">Active</option><option value="BLOCKED">Blocked</option></select><button type="button" aria-expanded={dateOpen} aria-controls="user-date-range" onClick={() => setDateOpen(!dateOpen)} className={`${control} flex items-center gap-2`}><AdminIcon name="bookings" />Signup Date Range{from || to ? " · Active" : ""}</button><button type="button" aria-label="Reset user filters" onClick={reset} className={`${control} flex items-center`}><AdminIcon name="refresh" /></button></div>
      {dateOpen && <div id="user-date-range" className="mt-4 flex flex-wrap items-end gap-3 border-t border-neutral-100 pt-4"><label className="grid gap-1 text-xs text-neutral-500">From<input aria-label="Signup from" type="date" value={from} onChange={event => { setFrom(event.target.value); setPage(1); }} className={control} /></label><label className="grid gap-1 text-xs text-neutral-500">To<input aria-label="Signup to" type="date" value={to} onChange={event => { setTo(event.target.value); setPage(1); }} className={control} /></label><button type="button" onClick={() => { setFrom(""); setTo(""); setPage(1); }} className={control}>Clear dates</button><p className="pb-3 text-xs text-neutral-500">Includes both dates.</p></div>}{invalidDates && <p role="alert" className="mt-3 text-sm">Choose an end date on or after the start date.</p>}
    </section>
    <section aria-label="Users results" className="mt-6 rounded-xl border border-neutral-200 bg-white shadow-xs"><div className="overflow-x-auto rounded-t-xl"><table className="w-full min-w-[1050px] text-left text-sm"><thead className="bg-neutral-50 text-[10px] tracking-wider text-neutral-500 uppercase"><tr>{["User", "Phone Number", "Email", "Total Bookings", "Total Spend", "Last Active", "Status", "Actions"].map(label => <th key={label} scope="col" className="px-5 py-5 font-semibold">{label}</th>)}</tr></thead><tbody className="divide-y divide-neutral-100">{visible.map(user => {
      const totals = userTotals(user.id);
      return <tr key={user.id} tabIndex={0} aria-label={`View ${user.name}`} onClick={() => setSelectedId(user.id)} onKeyDown={event => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); setSelectedId(user.id); } }} className="cursor-pointer hover:bg-neutral-50 focus-visible:outline-2 focus-visible:-outline-offset-2"><td className="px-5 py-5"><div className="flex items-center gap-3"><UserAvatar user={user} /><span className="min-w-20 text-xs font-semibold">{user.name}</span></div></td><td className="px-5 py-5 text-xs text-neutral-600">{user.phone}</td><td className="px-5 py-5 text-xs text-neutral-500">{user.email}</td><td className="px-5 py-5 text-center text-xs font-semibold">{totals.totalBookings}</td><td className="px-5 py-5 text-xs font-semibold whitespace-nowrap">{formatRupees(totals.totalSpend)}</td><td className="px-5 py-5 text-xs leading-5 text-neutral-500">{userLastActive(user.lastActive)}</td><td className="px-5 py-5"><UserBadge status={user.status} /></td><td className="px-5 py-5"><div onClick={event => event.stopPropagation()}><details className="relative" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false; }} onKeyDown={event => { if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary")?.focus(); } }}><summary aria-label={`Actions for ${user.name}`} className="flex size-9 list-none items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 focus-visible:outline-2 [&::-webkit-details-marker]:hidden"><AdminIcon name="more" /></summary><div className="absolute right-0 bottom-full z-10 mb-1 w-40 rounded-lg border border-neutral-200 bg-white p-1 shadow-lg"><button type="button" onClick={() => setSelectedId(user.id)} className="w-full rounded px-3 py-2 text-left text-xs hover:bg-neutral-100 focus-visible:outline-2">View Details</button><button type="button" onClick={() => setBlocking(user)} className="w-full rounded px-3 py-2 text-left text-xs hover:bg-neutral-100 focus-visible:outline-2">{user.status === "ACTIVE" ? "Block User" : "Unblock User"}</button></div></details></div></td></tr>;
    })}</tbody></table></div>
      {!filtered.length && <div className="p-12 text-center"><h2 className="font-semibold">No users found</h2><p className="mt-2 text-sm text-neutral-500">Try another search or adjust your filters.</p><button type="button" onClick={reset} className={`${userButton} mt-4`}>Reset filters</button></div>}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 p-4"><p role="status" className="text-xs text-neutral-500">Showing {filtered.length ? start + 1 : 0}–{Math.min(start + pageSize, filtered.length)} of {filtered.length} users</p><nav aria-label="Users pagination" className="flex gap-1"><button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className={`${control} disabled:opacity-30`}>‹</button>{Array.from({ length: pages }, (_, index) => index + 1).map(number => <button key={number} type="button" aria-label={`Page ${number}`} aria-current={number === currentPage ? "page" : undefined} onClick={() => setPage(number)} className={`${control} ${number === currentPage ? "bg-neutral-900! text-white!" : ""}`}>{number}</button>)}<button type="button" aria-label="Next page" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)} className={`${control} disabled:opacity-30`}>›</button></nav></div>
    </section><p role="status" className="mt-3 text-xs text-neutral-600">{notice}</p><p className="mt-2 text-xs text-neutral-500">Preview only · Account status changes last until you leave or reload this page.</p>
    {selected && <AdminUserDetails key={selected.id} user={selected} onClose={() => setSelectedId(null)} onStatusChange={() => setBlocking(selected)} />}
    {blocking && <UserDialog title={blocking.status === "ACTIVE" ? "Block this user?" : "Unblock this user?"} onClose={() => setBlocking(null)}><div className="p-6 text-sm leading-6 text-neutral-600"><p>Mark <strong className="text-neutral-900">{blocking.name}</strong> as {blocking.status === "ACTIVE" ? "blocked" : "active"}?</p><p className="mt-2">This updates the Admin preview only. Login and booking access are unchanged.</p></div><footer className="flex justify-end gap-3 border-t border-neutral-100 p-5"><button autoFocus type="button" onClick={() => setBlocking(null)} className={userButton}>Cancel</button><button type="button" onClick={() => { changeStatus(blocking, blocking.status === "ACTIVE" ? "BLOCKED" : "ACTIVE"); setBlocking(null); }} className={`${userButton} bg-neutral-900 text-white hover:bg-black`}>{blocking.status === "ACTIVE" ? "Block User" : "Unblock User"}</button></footer></UserDialog>}
  </>;
}
