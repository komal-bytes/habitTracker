import db, { TrackLog } from '@/config/db';
import { Habit, Log } from '@/config/db';
import { calculateCurrentAndNextScheduledDate, calculateNextScheduledDate, calculateNextScheduledDateForCustom } from './schedulingFunctions';
import * as chrono from 'chrono-node';
import { toPng } from 'html-to-image';

// Function to add a new habit
export async function addHabit(habit: Habit): Promise<number> {
    try {
        const id = await db.habits.add(habit);
        console.log(`Habit added with id: ${id}`);
        await createTrackLogs(habit);
        // await scheduleNotification(habit);
        return id;
    } catch (error) {
        console.error("Failed to add habit:", error);
        throw error;
    }
}

// Function to fetch list of habits
export async function getAllHabits(): Promise<Habit[]> {
    try {
        return await db.habits.toArray();
    } catch (error) {
        console.error("Failed to retrieve habits:", error);
        throw error;
    }
}


//Function to fetch today's list of habits
export const getCurrentHabits = async (): Promise<any[]> => {
    const today = new Date();
    const formattedToday = today.toDateString();
    try {

        const habits = await db.habits
            .filter(habit => {
                const scheduledDate = new Date(habit.currentScheduledDate);
                return scheduledDate.toDateString() === formattedToday && !habit.isPaused;
            })
            .toArray();

        return habits.sort((a, b) => {
            const timeA = a.time.hour * 3600000 + a.time.minute * 60000 + a.time.second * 1000 + a.time.millisecond;
            const timeB = b.time.hour * 3600000 + b.time.minute * 60000 + b.time.second * 1000 + b.time.millisecond;
            return timeA - timeB;
        });

    } catch (error) {
        console.error("Error retrieving habits:", error);
        throw error;
    }
};

//Function to update individual habit
export async function updateHabitDetails(habitId: number, updatedHabit: Partial<Habit>): Promise<boolean> {
    try {
        const updated = await db.habits.update(habitId, updatedHabit);
        return updated > 0;
    } catch (error) {
        console.error("Failed to update habit:", error);
        throw error;
    }
}

//Function to delete a habit
export async function deleteHabit(habitId: number): Promise<boolean> {
    try {
        const deleted = await db.habits.delete(habitId);
        const a = await db.logs.where('habitId').equals(habitId).delete();
        const b = await db.trackLogs.where('habitId').equals(habitId).delete();
        return deleted > 0;
    } catch (error) {
        console.error("Failed to delete habit:", error);
        throw error;
    }
}


interface logProps {
    habitId: number,
    completePercentage: number,
    notes?: string,
    completionDate?: string
}

// Function to log a habit completion
export const createLogAndUpdateHabit = async (log: logProps): Promise<void> => {
    try {
        const { habitId, completePercentage, notes, completionDate } = log;
        // console.log(habitId)
        const habit = await db.habits.get(habitId);
        if (!habit) {
            throw new Error("Habit not found");
        }

        const currentDate = new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const logs = await db.logs
            .where('habitId')
            .equals(habitId)
            .and(log => {
                console.log(currentDate)
                console.log(new Date(log.completionDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                }) == currentDate);

                return new Date(log.completionDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                }) == currentDate
            })
            .toArray();

        console.log(logs)
        if (logs.length > 0) return logs[0];

        const newLog: Log = {
            habitId,
            habitName: habit.habitName,
            completionDate: completionDate ? new Date(completionDate).toISOString() : new Date().toISOString(),
            completePercentage,
            notes
        };

        // console.log(newLog, "new log")
        await db.logs.add(newLog);

        return newLog;

    } catch (error) {
        console.error("Error creating log and updating habit:", error);
        throw error;
    }
};


export const updateScheduledDates = async () => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        const habits = await db.habits.toArray();

        for (const habit of habits) {

            const currentScheduledDate = new Date(habit.currentScheduledDate).toISOString().split('T')[0];
            console.log(currentDate, currentScheduledDate, "current two dates")
            if (currentScheduledDate < currentDate) {
                let lastScheduledFor;
                let currentlyScheduledFor;
                let nextScheduledFor;

                const dates = calculateNextScheduledDate(habit.frequencyType, habit, habit.currentScheduledDate);
                console.log(dates, "dates")
                lastScheduledFor = dates.lastScheduledFor;
                currentlyScheduledFor = dates.currentlyScheduledFor;
                nextScheduledFor = dates.nextScheduledFor;

                await db.habits.update(habit.id!, {
                    lastScheduledDate: lastScheduledFor.toISOString(),
                    currentScheduledDate: currentlyScheduledFor.toISOString(),
                    nextScheduledDate: nextScheduledFor.toISOString(),
                });
            }
        }

    } catch (error) {
        console.error("Error updating scheduled dates:", error);
        throw error;
    }
};


//Function to fetch a log but habit id and date
export const fetchDailyHabitLogByHabitId = async (logId: number) => {
    try {
        const currentDate = new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        const logs = await db.logs
            .where('id')
            .equals(logId)
            .and(log => {
                return new Date(log.completionDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                }) == currentDate
            })
            .toArray();
        return logs[0];
    } catch (error) {
        console.error("Error fetching log:", error);
        throw error;
    }
}

//Function to update a log
export async function updateLogDetails(logId: number, habitId: number, updatedLog: Partial<Log>): Promise<boolean> {
    try {
        const updated = await db.logs.update(logId, updatedLog);
        await updateHabitStreak(habitId);
        return updated > 0;
    } catch (error) {
        console.error("Failed to update the log:", error);
        throw error;
    }
}


//Function to update the streak
export const updateHabitStreak = async (habitId: number) => {
    try {
        const habit = await db.habits.get(habitId);

        if (!habit) {
            throw new Error("Habit not found");
        }

        const lastScheduledDate = habit.lastScheduledDate ? new Date(habit.lastScheduledDate).toISOString().split('T')[0] : 0;
        const lastProgressUpdateDate = habit.lastProgressUpdateDate ? new Date(habit.lastProgressUpdateDate).toISOString().split('T')[0] : 0;
        const currentDate = new Date().toISOString().split('T')[0];
        if (lastProgressUpdateDate !== currentDate) {
            if (lastScheduledDate === lastProgressUpdateDate) {
                habit.currentStreak += 1;
            } else {
                habit.currentStreak = 1;
            }

            if (habit.currentStreak > habit.bestStreak) {
                habit.bestStreak = habit.currentStreak;
            }

            habit.lastProgressUpdateDate = new Date().toISOString();

            await db.habits.update(habitId, {
                currentStreak: habit.currentStreak,
                bestStreak: habit.bestStreak,
                lastProgressUpdateDate: habit.lastProgressUpdateDate
            });

            console.log(`Updated Habit ID ${habitId}: Current Streak - ${habit.currentStreak}, Best Streak - ${habit.bestStreak}`);
        }
        return;
    } catch (error) {
        console.error("Error updating habit streak:", error);
        throw error;
    }
};


// Function to get list of logs filtered by Habit Id
export const getLogsByHabitId = async (habitId: number): Promise<Log[]> => {
    try {
        const logs = await db.logs
            .where('habitId')
            .equals(habitId)
            .toArray();

        logs.sort((a, b) => new Date(a.completionDate).getTime() - new Date(b.completionDate).getTime());
        // console.log(logs, "logs")
        const startDate = new Date(logs[0].completionDate).toISOString().split('T')[0];
        const currentDate = new Date().toISOString().split('T')[0]; // Get today's date


        const logObject: Record<string, Log | null> = {};


        let current = startDate;
        while (current <= currentDate) {
            const logForDate = logs.find(log => new Date(log.completionDate).toISOString().split('T')[0] === current) || null;


            logObject[current] = logForDate;


            current = new Date(new Date(current).setDate(new Date(current).getDate() + 1)).toISOString().split('T')[0];
        }

        // console.log(logObject, "logs");

        return logObject;

    } catch (error) {
        console.error("Error retrieving logs:", error);
        throw error;
    }
};


export const createTrackLogs = async (habitObject?: Habit) => {

    try {
        const habits: Habit[] = habitObject ? [habitObject] : await db.habits.toArray();
        console.log(habits)
        for (const habit of habits) {
            if (habit.isPaused) continue;
            const trackLogs = await db.trackLogs.where('habitId').equals(habit.id).toArray();
            trackLogs.sort((a, b) => new Date(a.trackingDate).getTime() - new Date(b.trackingDate).getTime());

            const latestLog = trackLogs.length > 0 ? trackLogs[trackLogs.length - 1] : null;

            const frequencyType = habit.frequencyType;
            const today = new Date().toISOString().split('T')[0];
            let startDate: Date;

            // console.log(latestLog)

            if (latestLog) {
                startDate = new Date(latestLog.trackingDate);
                startDate = new Date(startDate.setDate(startDate.getDate() + 1)).toISOString().split('T')[0];
            } else {
                startDate = today;
            }

            // console.log(startDate, today)

            if (frequencyType === 'Daily') {
                while (startDate <= today) {
                    await db.trackLogs.add({
                        habitId: habit.id,
                        habitName: habit.habitName,
                        trackingDate: startDate
                    });
                    startDate = new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 1)).toISOString().split('T')[0];
                }
            } else if (frequencyType === 'Specific Days') {
                const specificDays = habit.specificFrequencyDays;
                while (startDate <= today) {
                    const dayOfWeek = new Date(startDate).getDay();
                    if (specificDays.includes(dayOfWeek)) {
                        await db.trackLogs.add({
                            habitId: habit.id,
                            habitName: habit.habitName,
                            trackingDate: startDate,
                        });
                    }
                    startDate = new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 1)).toISOString().split('T')[0];
                }
            } else if (frequencyType === 'Custom') {
                const frequencyValue = habit.frequencyValue;
                const customFrequencyType = habit.customFrequencyType;

                if (!latestLog) {
                    startDate = new Date(habit.customStartDay).toISOString().split('T')[0];
                }

                while (startDate <= today) {
                    await db.trackLogs.add({
                        habitId: habit.id,
                        habitName: habit.habitName,
                        trackingDate: startDate,
                    });

                    if (customFrequencyType === 'days') {
                        startDate = new Date(new Date(startDate).setDate(new Date(startDate).getDate() + frequencyValue)).toISOString().split('T')[0];
                    } else if (customFrequencyType === 'weeks') {
                        startDate = new Date(new Date(startDate).setDate(new Date(startDate).getDate() + frequencyValue * 7)).toISOString().split('T')[0];
                    } else if (customFrequencyType === 'months') {
                        startDate = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + frequencyValue)).toISOString().split('T')[0];
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error creating track logs:", error);
        throw error;
    }

};

export const queryLogs = async (type: 'Daily' | 'Weekly' | 'Monthly', habitId: string, year: number, month?: number) => {
    try {

        console.log(type, habitId, month, year)
        let logs: Log[];

        if (type === 'Monthly') {
            logs = await db.logs.where('habitId').equals(habitId)
                .filter(log => new Date(log.completionDate).getFullYear() == year)
                .toArray();
        } else {
            logs = await db.logs.where('habitId').equals(habitId)
                .filter(log => {
                    const date = new Date(log.completionDate);
                    console.log(date.getMonth() + 1)
                    return date.getFullYear() == year && (type === 'Daily' ? date.getMonth() + 1 == month : true);
                })
                .toArray();
        }

        logs.sort((a, b) => new Date(a.completionDate).getTime() - new Date(b.completionDate).getTime());
        console.log(logs);
        let completeCount = 0;


        // Calculate total tracking days from trackLogs
        let trackLogs: TrackLog[] = [];

        if (type === 'Monthly') {
            trackLogs = await db.trackLogs.where('habitId').equals(habitId)
                .filter(log => {
                    return new Date(log.trackingDate).getFullYear() === Number(year);
                })
                .toArray();
        } else {
            const startDate = new Date(year, month ? month - 1 : 0, 1);
            const endDate = new Date(year, month ? month : 12, 0); // Last day of the month or December if not provided

            trackLogs = await db.trackLogs.where('habitId').equals(habitId)
                .filter(log => {
                    const logDate = new Date(log.trackingDate);
                    return logDate >= startDate && logDate <= endDate;
                })
                .toArray();
        }
        console.log(trackLogs, "track logsf")
        const totalTrackingCount = trackLogs.length * 100; // Total tracking days based on trackLogs

        if (type === 'Daily') {
            let dailyLogs = {};
            const daysInMonth = new Date(year, month!, 0).getDate(); // Get total days in the month

            for (let day = 1; day <= daysInMonth; day++) {
                const dateKey = `${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(year, month! - 1))} ${day.toString().padStart(2, '0')}`;
                //`${year}-${month!.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                dailyLogs[dateKey] = 0;
            }

            logs.forEach(log => {
                const logDate = `${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(log.completionDate))} ${new Date(log.completionDate).getDate().toString().padStart(2, '0')}`
                //log.completionDate.split('T')[0];
                // console.log(logDate)
                if (dailyLogs[logDate] != undefined) {
                    dailyLogs[logDate] += log.completePercentage;
                    completeCount += log.completePercentage;
                }
            });

            const completionRate = totalTrackingCount ? ((completeCount / totalTrackingCount) * 100).toFixed(2) : 0;

            return { logs: dailyLogs, completionRate };

        } else if (type === 'Weekly') {
            const weeklyLogs = {};
            const startOfMonth = new Date(year, month! - 1, 1);
            const endOfMonth = new Date(year, month!, 0);
            let weekCount = 1;
            let currentWeekStart = startOfMonth;
            while (currentWeekStart <= endOfMonth) {
                const currentWeekEnd = new Date(currentWeekStart);
                currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);
                const weekRange = `week ${weekCount}`;//`${currentWeekStart.toISOString().split('T')[0]} to ${currentWeekEnd > endOfMonth ? endOfMonth.toISOString().split('T')[0] : currentWeekEnd.toISOString().split('T')[0]}`;
                weekCount++;
                weeklyLogs[weekRange] = 0;

                logs.forEach(log => {
                    const logDate = new Date(log.completionDate);
                    if (logDate >= currentWeekStart && logDate <= currentWeekEnd) {
                        weeklyLogs[weekRange] += log.completePercentage;
                        completeCount += log.completePercentage;
                    }
                });

                currentWeekStart.setDate(currentWeekStart.getDate() + 7);
            }

            // const totalDaysInMonth = new Date(year, month!, 0).getDate();
            const completionRate = totalTrackingCount ? ((completeCount / totalTrackingCount) * 100).toFixed(2) : 0;

            return { logs: weeklyLogs, completionRate };

        } else if (type === 'Monthly') {
            const monthlyLogs = {};

            for (let m = 0; m < 12; m++) {
                const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, m));

                monthlyLogs[monthName] = 0;
                logs.forEach(log => {
                    const logDate = new Date(log.completionDate);
                    if (logDate.getMonth() === m) {
                        monthlyLogs[monthName] += log.completePercentage;
                        completeCount += log.completePercentage;
                    }
                });
            }

            // const totalDaysInYear = Array.from({ length: 12 }, (_, i) => new Date(year, i + 1, 0).getDate()).reduce((a, b) => a + b);
            const completionRate = totalTrackingCount ? ((completeCount / totalTrackingCount) * 100).toFixed(2) : 0;

            return { logs: monthlyLogs, completionRate };
        }

    } catch (error) {
        console.error("Error querying logs:", error);
        throw error;
    }
};


interface progressUpdateReminderTimeProps {
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number
}


// Combined function to create or update progressUpdateReminderTime
const setProgressUpdateReminderTime = (newTime: progressUpdateReminderTimeProps) => {

    const reminderTime = {
        hours: newTime.hours,
        minutes: newTime.minutes,
        seconds: newTime.seconds,
        milliseconds: newTime.milliseconds,
    };

    const existingTime = localStorage.getItem('progressUpdateReminderTime');

    if (existingTime) {
        const currentReminderTime = JSON.parse(existingTime);

        currentReminderTime.hours = reminderTime.hours;
        currentReminderTime.minutes = reminderTime.minutes;
        currentReminderTime.seconds = reminderTime.seconds;
        currentReminderTime.milliseconds = reminderTime.milliseconds;

        localStorage.setItem('progressUpdateReminderTime', JSON.stringify(currentReminderTime));
    } else {
        localStorage.setItem('progressUpdateReminderTime', JSON.stringify(reminderTime));
    }
};

//Schedule notifications
export const scheduleNotification = async (habit: Habit) => {
    try {
        const time = combineDateAndTimeToUTC(habit.currentScheduledDate, habit.time);
        // console.log(time , "combined time")
        const userId = localStorage.getItem("onesignal-userId");
        const response = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: import.meta.env.VITE_REST_API_KEY,
            },
            body: JSON.stringify({
                app_id: import.meta.env.VITE_APP_ID,
                include_external_user_ids: [userId],
                contents: { en: `This is your scheduled reminder for "${habit?.habitName}".` },
                send_after: time, // Schedule the notification (format: 'YYYY-MM-DD HH:mm:ss')
                small_icon: "https://i.ibb.co/x10PFW8/habito-small.png",
                data: { habitId: habit?.id },
            }),
        });
        const result = await response.json();
        console.log(result, "result");
    } catch (error) {
        console.log(error)
    }

}

function combineDateAndTimeToUTC(
    currentScheduledDate: Date,
    time: { hour: string | number; minute: string | number; second: string | number }
): string {
    const date = new Date(currentScheduledDate);

    date.setUTCHours(Number(time.hour), Number(time.minute), Number(time.second), 0);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

interface TimeObject {
    hour: number;
    minute: number;
    second?: number;
}

export function formatTime(timeObject: TimeObject) {

    if (timeObject == null) return "";
    const { hour, minute, second } = timeObject;

    const period = hour >= 12 ? 'PM' : 'AM';

    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;

    const formattedMinute = String(minute).padStart(2, '0');

    return `${String(formattedHour).padStart(2, '0')}:${formattedMinute} ${period}`;
}


export function parseTime(formattedTime: string): TimeObject | null {
    if (!formattedTime) return null;

    const [timePart, period] = formattedTime.split(' ');

    if (!timePart || !period) return null;

    const [hourStr, minuteStr] = timePart.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    if (period.toUpperCase() === 'PM' && hour < 12) {
        hour += 12;
    } else if (period.toUpperCase() === 'AM' && hour === 12) {
        hour = 0;
    }

    return { hour, minute };
}


//Parse custom frequency
export function parseFrequency(input: string) {
    // Regular expression to match frequency and start date
    const regex = /every (\d+) (days|weeks|months|hours|minutes) starting (.+)/i;
    const match = input.match(regex);
    if (!match) {
        // setFrequencyFormatError();
        return { error: "Invalid format. Expected format: 'Every X type starting Y'" }
    }

    const value = parseInt(match[1], 10); // Extracting the numeric value
    const type = match[2]; // Extracting the type (days, weeks, etc.)
    const startDay = chrono.parseDate(match[3]); // Extracting the start day (e.g., "next Monday")

    if (startDay === null) {
        // setFrequencyFormatError();
        return { error: "Invalid format. Expected format: 'Every X type starting Y'" }
    }

    return { value, type, startDay };
}


export const handleShareOnWhatsApp = async (progressRef: React.RefObject<HTMLElement>) => {
    if (navigator.canShare && progressRef.current) {
        try {
            // Capture screenshot as a data URL
            const dataUrl = await toPng(progressRef.current, { backgroundColor: '#ffffff' });

            // Convert data URL to blob
            const response = await fetch(dataUrl);
            let blob = await response.blob();
            let file = new File([blob], 'progress.png', { type: 'image/png' });

            // Share using Web Share API
            if (navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'My Progress',
                    text: 'Check out my progress!',
                    files: [file]
                });
            } else {
                console.error("Sharing files is not supported on this device.");
            }

            // Set references to null for garbage collection
            blob = null;
            file = null;

        } catch (error) {
            console.error('Error sharing the image:', error);
        }
    } else {
        console.error("Web Share API or file sharing is not supported on this browser.");
    }
};