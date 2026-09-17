"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useSetupEdit } from "@/components/manager/use-setup-edit";
import { useManagerOnboarding } from "@/components/manager/manager-onboarding-provider";
import { useRouter } from "next/navigation";

const MIN_PHOTOS = 3;
const MAX_PHOTOS = 6;

type VenuePhoto = { id: string; name: string; previewUrl: string };

export default function Page() {
  const router = useRouter();
  const { settingsEdit, destination } = useSetupEdit();
  const { photos, setPhotos } = useManagerOnboarding();
  const [notice, setNotice] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canContinue = photos.length >= MIN_PHOTOS;
  const canAdd = photos.length < MAX_PHOTOS;
  const emptyTiles = Math.max(0, MAX_PHOTOS - photos.length - (canAdd ? 1 : 0));


  function selectPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = ""; // Allow selecting the same file again after removal.
    if (!files.length) return;

    const images = files.filter((file) => file.type.startsWith("image/"));
    const remaining = MAX_PHOTOS - photos.length;
    const additions = images.slice(0, remaining).map((file) => {
      const previewUrl = URL.createObjectURL(file);
      return { id: crypto.randomUUID(), name: file.name, previewUrl };
    });
    setPhotos((current) => [...current, ...additions]);
    setNotice([
      files.length !== images.length ? "Only image files can be added." : "",
      images.length > remaining ? `You can add up to ${MAX_PHOTOS} photos. Extra images were not added.` : "",
    ].filter(Boolean).join(" "));
  }

  function removePhoto(photo: VenuePhoto) {
    setPhotos((current) => current.filter((item) => item.id !== photo.id));
    setNotice("");
  }

  const helper = photos.length === 0
    ? "Add at least 3 photos of your venue"
    : canContinue
      ? "You can add up to 6 venue photos"
      : `Add ${MIN_PHOTOS - photos.length} more ${photos.length === 2 ? "photo" : "photos"} to continue`;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white font-sans text-neutral-900">
      <header className="border-b border-neutral-200 pt-[env(safe-area-inset-top)]">
        <div className="flex h-[72px] items-center gap-2 px-4">
          <button type="button" aria-label={settingsEdit ? "Back to Settings" : "Go back"} onClick={() => router.push(destination("/manager/onboarding/location"))} className="flex size-10 shrink-0 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14 6-6 6 6 6M8 12h12" /></svg>
          </button>
          <p className="text-lg font-semibold">Venue Photos</p>
        </div>
      </header>

      <main className="flex-1 px-6 pt-6 pb-6">
        <h1 className="text-[26px] leading-8 font-bold tracking-tight">Showcase your venue</h1>
        <p className="mt-2 max-w-sm text-sm leading-[21px] text-neutral-500">High-quality photos help customers choose your venue for their games.</p>

        <input ref={fileInputRef} id="venue-photo-picker" type="file" accept="image/*" multiple onChange={selectPhotos} disabled={!canAdd} aria-label="Choose venue photos" className="hidden" />
        <div role="group" aria-label="Venue photos" aria-describedby="photo-helper" className="mt-8 grid grid-cols-3 gap-3">
          {canAdd && (
            <button type="button" aria-label="Add venue photos" aria-controls="venue-photo-picker" onClick={() => fileInputRef.current?.click()} className="flex aspect-square min-w-0 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 text-neutral-500 hover:border-neutral-400 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 motion-safe:transition-colors">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              <span className="text-[11px] font-semibold">ADD</span>
            </button>
          )}
          {photos.map((photo, index) => (
            <div key={photo.id} className="relative aspect-square min-w-0 rounded-2xl bg-neutral-50 shadow-sm">
              {/* Blob URLs are browser-local previews and need no image optimization service. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.previewUrl} alt={`Venue photo ${index + 1}: ${photo.name}`} className="absolute inset-0 size-full rounded-2xl object-cover" onError={() => { removePhoto(photo); setNotice("An image could not be previewed. Please choose another image."); }} />
              <button type="button" aria-label={`Remove photo ${index + 1}`} onClick={() => removePhoto(photo)} className="absolute top-0 right-0 flex size-11 items-center justify-center rounded-full text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
                <span className="flex size-6 items-center justify-center rounded-full bg-neutral-900 shadow-sm">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m7 7 10 10M7 17 17 7" /></svg>
                </span>
              </button>
            </div>
          ))}
          {Array.from({ length: emptyTiles }, (_, index) => <div key={`empty-${index}`} aria-hidden="true" className="aspect-square min-w-0 rounded-2xl border border-neutral-100 bg-neutral-50" />)}
        </div>

        <div id="photo-helper" role="status" className="mt-6 flex items-start gap-2 text-xs leading-5 text-neutral-500">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 11v6m0-10v.5" /></svg>
          <p>{helper}<span className="sr-only">. {photos.length} of {MAX_PHOTOS} photos added.</span></p>
        </div>
        {notice && <p role="alert" className="mt-2 text-xs leading-5 text-neutral-600">{notice}</p>}
      </main>

      <footer className="sticky bottom-0 border-t border-neutral-100 bg-white px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <button type="button" disabled={!canContinue} onClick={() => { if (canContinue) router.push(destination("/manager/onboarding/description")); }} className="flex min-h-[60px] w-full items-center justify-center rounded-2xl bg-neutral-900 px-4 py-4 text-lg font-semibold text-white shadow-sm hover:bg-neutral-800 active:bg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500 disabled:shadow-none motion-safe:transition-colors">
          {settingsEdit ? "Save Changes" : "Save & Continue"}
        </button>
      </footer>
    </div>
  );
}
