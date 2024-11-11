import { Settings } from 'lucide-react';
// db.ts
import Dexie from 'dexie';


export interface Habit {
    id?: number;
    habitName: string;
    isPaused: boolean;
    // category: string;
    // customCategory: string;
    frequencyType: string; // e.g., "days", "weeks"
    specificFrequencyDays: number[]; // Array of specific days (0-6)
    customFrequency: string; // e.g., "Every 3 days starting next monday"
    // startDate: string | null; // ISO date string
    // goal: string;
    // progressUpdateReminderTime: object; // object of hr , min, sec , ms
    lastScheduledDate: string,
    currentScheduledDate: string; // ISO date string
    nextScheduledDate: string; // ISO date string
    frequencyValue: number; // e.g., 3 for "Every 3 days"
    customFrequencyType: string; // e.g., days for "Every 3 days"
}

export interface Log {
    id?: number;
    habitId: number;
    habitName: string,
    completionDate: string;
    completePercentage: number;
    notes?: string
}

export interface TrackLog {
    id?: number;
    habitId: number;
    habitName: string,
    trackingDate: string;
}


class HabitTrackerDB extends Dexie {
    habits!: Dexie.Table<Habit, number>; // Table for Habit entries
    logs!: Dexie.Table<Log, number>;     // Table for Log entries
    trackLogs!: Dexie.Table<TrackLog, number>;

    constructor() {
        super('HabitTrackerDB');
        this.version(1).stores({
            habits: `++id, habitName, frequencyType, specificFrequencyDays, customFrequency, currentScheduledDate, nextScheduledDate, frequencyValue, customFrequencyType`,
            logs: `++id, habitId, habitName, completionDate, completePercentage, notes`,
            trackLogs: `++id, habitId, habitName, trackingDate`
        });
        this.habits = this.table('habits');
        this.logs = this.table('logs');
        this.trackLogs = this.table('trackLogs');
    }
}

const db = new HabitTrackerDB();
export default db;