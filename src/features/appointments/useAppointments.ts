'use client';

import { useContext } from 'react';
import {
  AppointmentsContext,
  type AppointmentsContextValue,
} from './AppointmentsContext';

export function useAppointments(): AppointmentsContextValue {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) {
    throw new Error('useAppointments must be used inside <AppointmentsProvider>.');
  }
  return ctx;
}
