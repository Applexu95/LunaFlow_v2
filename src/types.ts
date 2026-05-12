/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  age: number;
  weight: number; // in kg
  height: number; // in cm
  cycleLength: number; // in days
  periodDuration: number; // in days (defaulting to 5 if not provided)
}

export interface CycleEntry {
  startDate: string; // ISO format
}

export interface AppState {
  profile: UserProfile | null;
  entries: CycleEntry[];
}
