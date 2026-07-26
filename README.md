# VirtuCare

A small appointment-booking app built for the VirtuCare take-home. A patient can browse doctors, book an appointment, and manage their bookings from a dashboard. No backend — state lives in React Context and persists through `localStorage`.

Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the build
npm run lint    # eslint
```

Node 18.17+ is required by Next.js 14.

---

## Features

- **Doctors listing** (`/doctors`) — 8 doctors with name, specialty, short bio, and the next few available slots.
- **Booking flow** (`/doctors/[id]`) — pick a date, pick a time from the doctor's availability, enter a reason, submit.
- **Appointments dashboard** (`/appointments`) — upcoming and past sections, with cancel.
- **Double-booking prevention** — already-taken slots are hidden in the grid, and the reducer rejects a colliding dispatch as a second line of defence.
- **Persistence** — appointments survive a hard refresh via a versioned `localStorage` key.
- **Responsive** at mobile, tablet, and desktop; empty states and loading skeletons included.

---

## Approach

The scope is small enough that over-engineering would cost more time than it saves, so the architecture stays deliberately flat:

- **App Router** with one route per page (`/doctors`, `/doctors/[id]`, `/appointments`).
- **State** lives in a single `AppointmentsContext` backed by `useReducer`. The reducer handles `HYDRATE`, `ADD`, and `CANCEL`. Redux/Zustand would be overkill for three actions.
- **Persistence** is a thin `storage.ts` wrapper around `localStorage` under a versioned key (`virtucare.appointments.v1`). The provider hydrates once inside `useEffect`, so the server never touches `localStorage` and there's no hydration mismatch.
- **Mock data** sits in `src/data/doctors.ts`. Each doctor carries a weekly availability template keyed by weekday (0–6), which the booking page expands into concrete slots for the selected date and then filters against existing appointments.
- **Components** are hand-rolled primitives (`Button`, `Input`, `Card`, `EmptyState`, `Skeleton`, etc.) rather than pulled from a kit. That keeps the visual language consistent and avoids the default-template look.

### Folder structure

```
src/
  app/                     # routes (layout, doctors, appointments)
  components/
    ui/                    # primitives (Button, Input, Card, ...)
    layout/                # NavBar, Container
    doctors/               # DoctorCard, SpecialtyBadge, ...
    booking/               # BookingForm, DatePicker, TimeSlotGrid
    appointments/          # AppointmentCard, CancelDialog, ...
  features/
    appointments/          # context, reducer, storage, validation
  data/doctors.ts          # mock data
  lib/                     # date, id, cn helpers
  types/                   # Doctor, Appointment, Specialty
```

---

## Key decisions

- **Native `<input type="date">` over a custom calendar.** Rolling a date picker is the single fastest way to blow a 72-hour timeline. The native control is accessible, keyboard-friendly, and styled just enough to feel intentional. `min`/`max` constrain the range to today through +30 days.
- **React Context + reducer for state.** The appointments list is small and touched by two pages. Context keeps the blast radius contained; a reducer makes the double-booking guard easy to express as a pure check at dispatch time.
- **Denormalize doctor name and specialty onto the appointment.** If the mock list ever changed, existing appointments still render correctly. It also matches what a real system would do — the appointment is a snapshot of a booking, not a live join.
- **Versioned `localStorage` key.** `virtucare.appointments.v1` means a future shape change can migrate or reset without colliding with old data.
- **Dates stored as `YYYY-MM-DD` strings, not `Date` objects.** Comparing `"2026-04-22" >= today` as strings avoids every timezone pitfall you hit the moment you call `new Date('2026-04-22')` — which is parsed as UTC midnight and can shift a day for anyone west of GMT.
- **Double-booking guarded twice.** The `TimeSlotGrid` filters taken slots in render; the reducer re-checks on `ADD`. Either one alone would work, but together they keep the UI honest and the store consistent if anything ever races.
- **Design.** Warm off-white background, serif page titles paired with Inter for body, a single muted accent. 1px borders instead of heavy shadows, `rounded-md` instead of `rounded-3xl`. The goal was something that reads as a product rather than a template.

---
## Challenges

- **Hydration without mismatch.** `localStorage` only exists on the client, so the provider ships an empty list during SSR and hydrates in `useEffect`. Everything that depends on the list (the dashboard, the slot grid) renders a skeleton until a `hydrated` flag flips, which sidesteps the "server rendered empty, client rendered full list" mismatch warning.
- **Timezone-safe date comparisons.** The first pass used `Date` objects and an appointment booked near midnight started showing up on the wrong day. Switching to `YYYY-MM-DD` string comparison (and formatting only at display time via `date-fns`) fixed it. `lib/date.ts` centralises the helpers so this doesn't drift.
- **Keeping the UI from feeling generated.** The instinct is to reach for purple gradients, giant rounded cards, and a hero with an emoji. I stripped all of that out and leaned on restraint — serif headings, a single accent colour, real dividers. It's a small thing but it changes the overall read of the product.
- **Slot generation without a backend.** Availability is a weekly template, not concrete slots, so the booking page has to compute the slot list for a chosen date and subtract anything already booked. Keeping that derivation in the component (rather than baking it into state) means the grid is always correct as appointments are added or cancelled.

---

## What I'd do next

- Rescheduling (today it's cancel + rebook).
- A search / specialty filter on the doctors page.
- Replace `localStorage` with a real API once auth exists.
- Accessibility pass — focus trap in the cancel dialog, `aria-live` on toasts.
- Unit tests around the reducer and the slot-filtering logic.

---

## Live demo

_https://virtucare-pearl.vercel.app/_
