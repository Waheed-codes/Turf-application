"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent, type ClipboardEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { AdminIcon } from "@/components/admin/admin-icon";
import { useAdminManagers } from "@/components/admin/admin-managers-provider";
import { DEVELOPMENT_MANAGER_OTP } from "@/data/admin/mockAdmin";

const inputClass = "min-h-11 w-full min-w-0 rounded-lg border border-neutral-300 bg-neutral-50 px-3 text-sm placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-neutral-800";
const buttonClass = "min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-medium hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40";
const primaryClass = "min-h-12 w-full rounded-xl bg-neutral-900 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-none";
const emptyOtp = () => Array<string>(6).fill("");

function createTemporaryPassword() {
  const groups = ["ABCDEFGHJKLMNPQRSTUVWXYZ", "abcdefghijkmnopqrstuvwxyz", "23456789", "!@#$%&*_-+"];
  const alphabet = groups.join("");
  const randomIndex = (limit: number) => {
    const buffer = new Uint8Array(1);
    const cutoff = 256 - (256 % limit);
    do { crypto.getRandomValues(buffer); } while (buffer[0] >= cutoff);
    return buffer[0] % limit;
  };
  const chars = groups.map((group) => group[randomIndex(group.length)]);
  while (chars.length < 16) chars.push(alphabet[randomIndex(alphabet.length)]);
  for (let index = chars.length - 1; index > 0; index--) {
    const swap = randomIndex(index + 1);
    [chars[index], chars[swap]] = [chars[swap], chars[index]];
  }
  return chars.join("");
}

export default function AddManagerPage() {
  const router = useRouter();
  const { managers, addManager } = useAdminManagers();
  const [phone, setPhone] = useState("");
  const [venueName, setVenueName] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [venueTouched, setVenueTouched] = useState(false);
  const [sentPhone, setSentPhone] = useState("");
  const [otp, setOtp] = useState(emptyOtp);
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [otpError, setOtpError] = useState("");
  const [password, setPassword] = useState("");
  const [copyFeedback, setCopyFeedback] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [sending, setSending] = useState(false);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);
  const passwordInput = useRef<HTMLInputElement>(null);
  const phoneValid = /^[6-9]\d{9}$/.test(phone);
  const duplicatePhone = managers.some((manager) => manager.phone.replace(/\D/g, "") === `91${phone}`);
  const phoneError = !phoneValid ? "Enter a 10-digit Indian mobile number starting with 6, 7, 8 or 9." : duplicatePhone ? "A manager with this phone number already exists." : "";
  const verified = phoneValid && verifiedPhone === phone && sentPhone === phone;
  const canCreate = !phoneError && venueName.trim().length > 0 && verified && password.length > 0;

  function changePhone(value: string) {
    setPhone(value.replace(/\D/g, "").slice(0, 10));
    setSentPhone(""); setVerifiedPhone(""); setOtp(emptyOtp()); setOtpError("");
    setPassword(""); setCopyFeedback(""); setSubmitError("");
  }

  function sendOtp() {
    setPhoneTouched(true);
    if (phoneError) return;
    setSentPhone(phone); setVerifiedPhone(""); setOtp(emptyOtp()); setOtpError("");
    setPassword(""); setCopyFeedback(""); setSubmitError("");
    // Focus after the disabled OTP inputs become enabled on this render.
    requestAnimationFrame(() => otpInputs.current[0]?.focus());
  }

  function fillOtp(value: string, index: number) {
    const digits = value.replace(/\D/g, "");
    if (!digits && value) return;
    const start = digits.length === 6 ? 0 : index;
    const next = [...otp];
    if (!digits) next[index] = "";
    else digits.slice(0, 6 - start).split("").forEach((digit, offset) => { next[start + offset] = digit; });
    setOtp(next); setOtpError("");
    if (digits) otpInputs.current[Math.min(start + digits.length, 5)]?.focus();
  }

  function pasteOtp(event: ClipboardEvent<HTMLInputElement>, index: number) {
    event.preventDefault();
    fillOtp(event.clipboardData.getData("text"), index);
  }

  function otpKey(event: KeyboardEvent<HTMLInputElement>, index: number) {
    if (event.key === "Backspace") {
      event.preventDefault();
      const target = otp[index] ? index : Math.max(0, index - 1);
      setOtp((current) => current.map((digit, position) => position === target ? "" : digit));
      setOtpError(""); otpInputs.current[target]?.focus();
    } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      otpInputs.current[Math.max(0, Math.min(5, index + (event.key === "ArrowLeft" ? -1 : 1)))]?.focus();
    }
  }

  function verifyOtp() {
    if (sentPhone !== phone || phoneError) return;
    if (otp.join("") !== DEVELOPMENT_MANAGER_OTP) {
      setOtpError("Incorrect demo OTP. Enter the six-digit code shown above.");
      otpInputs.current[0]?.focus(); return;
    }
    setVerifiedPhone(phone); setOtpError("");
  }

  async function copyPassword() {
    setCopyFeedback("");
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(password);
      setCopyFeedback("Copied");
    } catch {
      passwordInput.current?.focus(); passwordInput.current?.select();
      setCopyFeedback("Could not copy automatically. Select and copy the password manually.");
    }
  }

  function createManager(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPhoneTouched(true); setVenueTouched(true);
    if (!canCreate || sending) return;
    setSending(true);
    const added = addManager(`+91 ${phone}`, venueName);
    if (!added) { setSubmitError("A manager with this phone number already exists."); setSending(false); return; }
    setPassword(""); setOtp(emptyOtp());
    router.push("/admin/managers");
  }

  return <div className="mx-auto w-full max-w-[420px]">
    <div className="mb-6 flex items-center gap-3"><Link href="/admin/managers" aria-label="Back to Managers" className="flex size-10 shrink-0 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-200 focus-visible:outline-2"><AdminIcon name="back" className="size-5" /></Link><h1 className="text-xl font-semibold tracking-tight">Add New Manager</h1></div>
    <form onSubmit={createManager} noValidate aria-describedby="manager-preview-note">
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs min-[375px]:p-6">
        <label htmlFor="new-manager-phone" className="block text-sm font-medium text-neutral-700">Phone Number</label>
        <div className="mt-2 grid grid-cols-[68px_minmax(0,1fr)] gap-2 min-[390px]:grid-cols-[68px_minmax(0,1fr)_auto]">
          <div className="relative"><label htmlFor="manager-country-code" className="sr-only">Country code</label><select id="manager-country-code" defaultValue="+91" className={`${inputClass} appearance-none pr-6 pl-2`}><option value="+91">+91</option></select><span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-neutral-500"><AdminIcon name="chevron" className="size-3" /></span></div>
          <input id="new-manager-phone" type="tel" inputMode="numeric" autoComplete="tel-national" value={phone} onChange={(event) => changePhone(event.target.value)} onBlur={() => setPhoneTouched(true)} placeholder="9876543210" required aria-invalid={phoneTouched && Boolean(phoneError)} aria-describedby={phoneTouched && phoneError ? "manager-phone-error" : undefined} className={inputClass} />
          <button type="button" onClick={sendOtp} className={`${buttonClass} col-span-2 min-[390px]:col-span-1`}>{sentPhone ? "Resend OTP" : "Send OTP"}</button>
        </div>
        {phoneTouched && phoneError && <p id="manager-phone-error" role="alert" className="mt-2 text-xs leading-5 text-neutral-600">{phoneError}</p>}
        <label htmlFor="new-manager-venue" className="mt-5 block text-sm font-medium text-neutral-700">Venue Name</label>
        <input id="new-manager-venue" value={venueName} onChange={(event) => { setVenueName(event.target.value); setSubmitError(""); }} onBlur={() => setVenueTouched(true)} maxLength={100} required placeholder="e.g. Green Park Turf" aria-invalid={venueTouched && !venueName.trim()} aria-describedby={venueTouched && !venueName.trim() ? "manager-venue-error" : undefined} className={`${inputClass} mt-2`} />
        {venueTouched && !venueName.trim() && <p id="manager-venue-error" role="alert" className="mt-2 text-xs text-neutral-600">Enter the venue name.</p>}
        <fieldset className="mt-6 min-w-0" aria-describedby={otpError ? "manager-otp-error" : "manager-otp-hint"}><legend className="text-sm font-medium text-neutral-700">Verify OTP</legend>
          <p id="manager-otp-hint" role="status" className="mt-2 text-xs leading-5 text-neutral-500">{sentPhone ? <>Demo OTP: <strong className="font-semibold text-neutral-800">{DEVELOPMENT_MANAGER_OTP}</strong>. No SMS was sent.</> : "Send a demo OTP to enable verification."}</p>
          <div className="mt-3 grid grid-cols-6 gap-2">{otp.map((digit, index) => <input key={index} ref={(element) => { otpInputs.current[index] = element; }} aria-label={`OTP digit ${index + 1}`} type="text" inputMode="numeric" pattern="[0-9]*" autoComplete={index === 0 ? "one-time-code" : "off"} value={digit} disabled={!sentPhone || verified} onChange={(event) => fillOtp(event.target.value, index)} onFocus={(event) => event.target.select()} onPaste={(event) => pasteOtp(event, index)} onKeyDown={(event) => otpKey(event, index)} aria-invalid={Boolean(otpError)} className="h-12 min-w-0 w-full rounded-lg border border-neutral-300 bg-neutral-50 text-center text-lg font-semibold focus-visible:outline-2 focus-visible:outline-neutral-800 disabled:text-neutral-500" />)}</div>
          {otpError && <p id="manager-otp-error" role="alert" className="mt-2 text-xs leading-5 text-neutral-600">{otpError}</p>}
          <button type="button" onClick={verifyOtp} disabled={otp.some((digit) => !digit) || !sentPhone || verified} className={`${primaryClass} mt-4`}>{verified ? "OTP Verified" : "Verify OTP"}</button>
        </fieldset>
        <div className="mt-6 border-t border-neutral-100 pt-4"><div className="flex flex-wrap items-center justify-between gap-2"><p role="status" className="flex items-center gap-1 text-sm text-neutral-500">{verified ? <>Verified <AdminIcon name="check" /></> : "Not verified"}</p><button type="button" disabled={!verified} onClick={() => { setPassword(createTemporaryPassword()); setCopyFeedback(""); }} className="flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-neutral-800 focus-visible:outline-2 disabled:cursor-not-allowed disabled:text-neutral-400"><AdminIcon name="spark" />Generate Password</button></div>
          <label htmlFor="manager-temporary-password" className="sr-only">Temporary password</label><div className="relative mt-2"><input ref={passwordInput} id="manager-temporary-password" type="text" readOnly value={password} placeholder="Generate after verification" autoComplete="off" spellCheck={false} className={`${inputClass} pr-12 font-mono text-xs`} /><button type="button" disabled={!password} onClick={copyPassword} aria-label="Copy temporary password" className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-lg text-neutral-500 focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-30"><AdminIcon name="copy" /></button></div>
          {copyFeedback && <p role="status" className="mt-2 text-xs leading-5 text-neutral-500">{copyFeedback}</p>}
        </div>
      </div>
      {submitError && <p role="alert" className="mt-4 text-sm text-neutral-600">{submitError}</p>}
      <button type="submit" disabled={!canCreate || sending} className={`${primaryClass} mt-8 min-h-[60px] rounded-2xl`}>{sending ? "Creating preview…" : "Create Manager Account"}</button>
      <p id="manager-preview-note" className="mt-4 px-4 text-center text-xs leading-5 text-neutral-500">Frontend preview only. No real account or SMS is created. Temporary passwords are not saved.</p>
    </form>
  </div>;
}
