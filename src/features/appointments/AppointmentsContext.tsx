'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import type { Appointment, Specialty } from '@/types';
import { getDoctorById } from '@/data/doctors';
import { createId } from '@/lib/id';
import { todayIso } from '@/lib/date';
import { loadAppointments, saveAppointments } from './storage';
import { isSlotTaken } from './validation';

interface State {
  appointments: Appointment[];
  /** False until we've read localStorage on the client. */
  hydrated: boolean;
}

type Action =
  | { type: 'HYDRATE'; payload: Appointment[] }
  | { type: 'ADD'; payload: Appointment }
  | { type: 'CANCEL'; id: string };

const initialState: State = { appointments: [], hydrated: false };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HYDRATE':
      return { appointments: action.payload, hydrated: true };
    case 'ADD': {
      // Defence in depth: reject duplicates even if the UI failed to filter.
      if (
        isSlotTaken(
          state.appointments,
          action.payload.doctorId,
          action.payload.date,
          action.payload.time,
        )
      ) {
        return state;
      }
      return { ...state, appointments: [...state.appointments, action.payload] };
    }
    case 'CANCEL':
      return {
        ...state,
        appointments: state.appointments.filter((a) => a.id !== action.id),
      };
  }
}

export interface BookInput {
  doctorId: string;
  date: string;
  time: string;
  reason: string;
}

export interface AppointmentsContextValue {
  appointments: Appointment[];
  hydrated: boolean;
  /** Returns the created appointment, or null if the slot is already taken. */
  book: (input: BookInput) => Appointment | null;
  cancel: (id: string) => void;
  /** Appointments on or after today, sorted ascending by (date, time). */
  upcoming: Appointment[];
  /** Appointments strictly before today, sorted descending. */
  past: Appointment[];
  isSlotBooked: (doctorId: string, date: string, time: string) => boolean;
}

export const AppointmentsContext =
  createContext<AppointmentsContextValue | null>(null);

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate once on mount. Reading localStorage here (not during render)
  // keeps SSR output deterministic and avoids hydration mismatch.
  useEffect(() => {
    dispatch({ type: 'HYDRATE', payload: loadAppointments() });
  }, []);

  // Persist after every change, but not for the initial pre-hydration render.
  const firstWrite = useRef(true);
  useEffect(() => {
    if (!state.hydrated) return;
    if (firstWrite.current) {
      firstWrite.current = false;
      return;
    }
    saveAppointments(state.appointments);
  }, [state.appointments, state.hydrated]);

  const book = useCallback<AppointmentsContextValue['book']>(
    (input) => {
      const doctor = getDoctorById(input.doctorId);
      if (!doctor) return null;
      if (
        isSlotTaken(state.appointments, input.doctorId, input.date, input.time)
      ) {
        return null;
      }
      const appointment: Appointment = {
        id: createId(),
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty as Specialty,
        date: input.date,
        time: input.time,
        reason: input.reason.trim(),
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD', payload: appointment });
      return appointment;
    },
    [state.appointments],
  );

  const cancel = useCallback((id: string) => {
    dispatch({ type: 'CANCEL', id });
  }, []);

  const isSlotBooked = useCallback<AppointmentsContextValue['isSlotBooked']>(
    (doctorId, date, time) =>
      isSlotTaken(state.appointments, doctorId, date, time),
    [state.appointments],
  );

  const { upcoming, past } = useMemo(() => split(state.appointments), [
    state.appointments,
  ]);

  const value = useMemo<AppointmentsContextValue>(
    () => ({
      appointments: state.appointments,
      hydrated: state.hydrated,
      book,
      cancel,
      upcoming,
      past,
      isSlotBooked,
    }),
    [state.appointments, state.hydrated, book, cancel, upcoming, past, isSlotBooked],
  );

  return (
    <AppointmentsContext.Provider value={value}>
      {children}
    </AppointmentsContext.Provider>
  );
}

function split(appointments: Appointment[]): {
  upcoming: Appointment[];
  past: Appointment[];
} {
  const today = todayIso();
  const upcoming: Appointment[] = [];
  const past: Appointment[] = [];
  for (const a of appointments) {
    if (a.date >= today) upcoming.push(a);
    else past.push(a);
  }
  upcoming.sort(compareAsc);
  past.sort(compareDesc);
  return { upcoming, past };
}

function compareAsc(a: Appointment, b: Appointment): number {
  if (a.date !== b.date) return a.date < b.date ? -1 : 1;
  if (a.time !== b.time) return a.time < b.time ? -1 : 1;
  return 0;
}

function compareDesc(a: Appointment, b: Appointment): number {
  return -compareAsc(a, b);
}
