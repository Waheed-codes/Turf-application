"use client";

import ProfilePageHeader from "@/components/profile/profile-page-header";
import { useState } from "react";
import HomeIcon from "@/app/home/home-icon";
import { useUserProfile, type PersonalDetails } from "@/hooks/use-user-profile";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";
const field = "mt-2 min-h-12 w-full min-w-0 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-950 focus:border-black focus:outline-none focus:ring-1 focus:ring-black";
const keys = ["name", "email", "dateOfBirth", "gender", "city"] as const;

export default function PersonalDetailsPage() {
  const { user, saveDetails } = useUserProfile();
  const [draft, setDraft] = useState<PersonalDetails>(() => ({ name: user.name, email: user.email, dateOfBirth: user.dateOfBirth, gender: user.gender, city: user.city }));
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalDetails, string>>>({});
  const [notice, setNotice] = useState("");
  const dirty = keys.some((key) => draft[key] !== user[key]);
  const today = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  function change(key: keyof PersonalDetails, value: string) {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
    setNotice("");
  }
  function error(key: keyof PersonalDetails) {
    return errors[key] ? <p id={`${key}-error`} className="mt-2 text-xs font-medium text-neutral-700">{errors[key]}</p> : null;
  }
  return <main className="min-h-svh bg-neutral-50 px-6 pt-6 pb-[calc(2rem+env(safe-area-inset-bottom))] font-sans text-neutral-950">
    <div className="mx-auto w-full max-w-sm">
      <ProfilePageHeader title="Personal Details" />
      <div className="mt-7 flex flex-col items-center"><div className="flex size-20 items-center justify-center rounded-full bg-neutral-100"><HomeIcon name="profile" className="size-10 text-neutral-600" /></div><button type="button" onClick={() => setNotice("Changing your profile photo will be available soon.")} className={`mt-2 min-h-11 rounded-md px-3 text-sm font-semibold underline underline-offset-4 ${focus}`}>Change Photo</button></div>
      <form noValidate className="mt-6 space-y-5" onSubmit={(event) => {
        event.preventDefault();
        if (!dirty) return;
        const next: typeof errors = {};
        if (!draft.name.trim()) next.name = "Enter your full name.";
        if (draft.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) next.email = "Enter a valid email address.";
        if (draft.dateOfBirth && (!/^\d{4}-\d{2}-\d{2}$/.test(draft.dateOfBirth) || Number.isNaN(Date.parse(draft.dateOfBirth)) || new Date(draft.dateOfBirth).toISOString().slice(0, 10) !== draft.dateOfBirth || draft.dateOfBirth > today)) next.dateOfBirth = "Choose a valid date that is not in the future.";
        if (!draft.city.trim()) next.city = "Enter your city.";
        setErrors(next);
        if (Object.keys(next).length) { setNotice(""); return; }
        const saved = { ...draft, name: draft.name.trim(), email: draft.email.trim(), city: draft.city.trim() };
        saveDetails(saved);
        setDraft(saved);
        setNotice("Personal details updated for this session. Changes reset when you refresh.");
      }}>
        <div><label htmlFor="name" className="text-xs font-semibold tracking-wide text-neutral-500">FULL NAME</label><input id="name" autoComplete="name" value={draft.name} onChange={(event) => change("name", event.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} className={field} />{error("name")}</div>
        <div><label htmlFor="phone" className="text-xs font-semibold tracking-wide text-neutral-500">PHONE NUMBER</label><div className="mt-2 flex min-h-12 items-center rounded-xl border border-neutral-200 bg-neutral-100 px-4"><input id="phone" type="tel" readOnly value={user.phone} className="min-w-0 flex-1 bg-transparent text-base text-neutral-500 outline-none" /><button type="button" onClick={() => setNotice("Phone number verification will be required to change this number.")} className={`min-h-11 shrink-0 rounded-md px-2 text-xs font-semibold underline ${focus}`}>Change</button></div></div>
        <div><label htmlFor="email" className="text-xs font-semibold tracking-wide text-neutral-500">EMAIL ADDRESS</label><input id="email" type="email" autoComplete="email" value={draft.email} onChange={(event) => change("email", event.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} className={field} />{error("email")}</div>
        <div><label htmlFor="dateOfBirth" className="text-xs font-semibold tracking-wide text-neutral-500">DATE OF BIRTH</label><input id="dateOfBirth" type="date" autoComplete="bday" max={today} value={draft.dateOfBirth} onChange={(event) => change("dateOfBirth", event.target.value)} aria-invalid={!!errors.dateOfBirth} aria-describedby={errors.dateOfBirth ? "dateOfBirth-error" : undefined} className={field} />{error("dateOfBirth")}</div>
        <div><label htmlFor="gender" className="text-xs font-semibold tracking-wide text-neutral-500">GENDER</label><select id="gender" value={draft.gender} onChange={(event) => change("gender", event.target.value)} className={field}><option value="">Select gender</option><option>Male</option><option>Female</option><option>Prefer not to say</option></select></div>
        <div><label htmlFor="city" className="text-xs font-semibold tracking-wide text-neutral-500">CITY</label><input id="city" autoComplete="address-level2" value={draft.city} onChange={(event) => change("city", event.target.value)} aria-invalid={!!errors.city} aria-describedby={errors.city ? "city-error" : undefined} className={field} />{error("city")}</div>
        <button type="submit" disabled={!dirty} className={`min-h-12 w-full rounded-full bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40 ${focus}`}>SAVE CHANGES</button>
      </form>
      <p role="status" aria-live="polite" className="mt-4 text-center text-sm leading-6 text-neutral-600">{notice}</p>
    </div>
  </main>;
}
