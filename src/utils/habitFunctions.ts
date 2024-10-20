import db, { TrackLog } from '@/config/db';
import { Habit, Log } from '@/config/db';
import { calculateCurrentAndNextScheduledDate, calculateNextScheduledDate, calculateNextScheduledDateForCustom } from './schedulingFunctions';
import { Chrono } from 'chrono-node';

// Function to add a new habit
export async function addHabit(habit: Habit): Promise<number> {
    try {
        const id = await db.habits.add(habit);
        console.log(`Habit added with id: ${id}`);
        await createTrackLogs(habit);
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

let habits = await getAllHabits();
console.log(habits);

//Function to fetch today's list of habits
export const getCurrentHabits = async (): Promise<any[]> => {
    const today = new Date();
    const formattedToday = today.toDateString();
    console.log(formattedToday)
    try {

        const habits = await db.habits
            .filter(habit => {
                const scheduledDate = new Date(habit.currentScheduledDate);
                console.log(scheduledDate.toDateString())
                return scheduledDate.toDateString() === formattedToday && !habit.isPaused;
            })
            .toArray();

        return habits;

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

// await updateHabitDetails(1, { isPaused: true })

//Function to delete a habit
export async function deleteHabit(habitId: number): Promise<boolean> {
    try {
        const deleted = await db.habits.delete(habitId);
        return deleted > 0;
    } catch (error) {
        console.error("Failed to delete habit:", error);
        throw error;
    }
}

// await deleteHabit(1);


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
        console.log(habitId)
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

// await createLogAndUpdateHabit({ habitId: 1, completePercentage: 100, notes: "Completed it." });

export const updateScheduledDates = async () => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        const habits = await db.habits.toArray();

        for (const habit of habits) {
            const currentScheduledDate = new Date(habit.currentScheduledDate).toISOString().split('T')[0];
            if (currentScheduledDate < currentDate) {
                let lastScheduledFor;
                let currentlyScheduledFor;
                let nextScheduledFor;

                if (habit.frequencyType === 'Custom') {
                    const dates = calculateNextScheduledDateForCustom(
                        { type: habit.customFrequencyType, value: habit.frequencyValue },
                        habit.currentScheduledDate,
                        habit.nextScheduledDate
                    );
                    lastScheduledFor = dates.lastScheduledFor;
                    currentlyScheduledFor = dates.currentlyScheduledFor;
                    nextScheduledFor = dates.nextScheduledFor;
                } else {
                    const dates = calculateNextScheduledDate(habit.frequencyType, habit, habit.currentScheduledDate, habit.nextScheduledDate);
                    console.log(dates, "dates")
                    lastScheduledFor = dates.lastScheduledFor;
                    currentlyScheduledFor = dates.currentlyScheduledFor;
                    nextScheduledFor = dates.nextScheduledFor;
                }

                // console.log(lastScheduledFor, currentlyScheduledFor, nextScheduledFor, "dates here");

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

// await updateLogDetails(1, { notes: "changed notes" })

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
        // console.log(lastProgressUpdateDate, currentDate, "check hereee")
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
        // console.log(current < currentDate, "logs")
        while (current <= currentDate) {
            // const dateString = current; // Format date as YYYY-MM-DD
            // console.log(dateString, "logs")
            // console.log(current)
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

// getLogsByHabitId(1)
//     .then(logs => {
//         console.log("Logs for Habit ID 1:", logs);
//     })
//     .catch(error => {
//         console.error("Failed to fetch logs:", error);
//     });


export const createTrackLogs = async (habitObject: Habit) => {

    try {
        const habits: Habit[] = habitObject ? [habitObject] : await db.habits.toArray();
        console.log(habits)
        for (const habit of habits) {
            const trackLogs = await db.trackLogs.where('habitId').equals(habit.id).toArray();
            trackLogs.sort((a, b) => new Date(a.trackingDate).getTime() - new Date(b.trackingDate).getTime());

            const latestLog = trackLogs.length > 0 ? trackLogs[trackLogs.length - 1] : null;

            const frequencyType = habit.frequencyType;
            const today = new Date().toISOString().split('T')[0];
            let startDate: Date;

            console.log(latestLog)

            if (latestLog) {
                startDate = new Date(latestLog.trackingDate);
                startDate = new Date(startDate.setDate(startDate.getDate() + 1)).toISOString().split('T')[0];
            } else {
                startDate = today;
            }

            console.log(startDate, today)

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
                const specificDays = habit.specificDays;
                while (startDate <= today) {
                    const dayOfWeek = startDate.getDay();
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

                if (habitObject?.customStartDay) {
                    startDate = Chrono.parseDate(customStartDay);
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
                const dateKey = `${year}-${month!.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                dailyLogs[dateKey] = 0; // Initialize with count 0
            }

            logs.forEach(log => {
                const logDate = log.completionDate.split('T')[0]; // Get only the date part (YYYY-MM-DD)
                // console.log(logDate)
                if (dailyLogs[logDate] != undefined) {
                    dailyLogs[logDate] += log.completePercentage; // Increment by completePercentage
                    completeCount += log.completePercentage;
                }
            });

            const completionRate = totalTrackingCount ? ((completeCount / totalTrackingCount) * 100).toFixed(2) : 0;

            return { logs: dailyLogs, completionRate };

        } else if (type === 'Weekly') {
            const weeklyLogs = {};
            const startOfMonth = new Date(year, month! - 1, 1);
            const endOfMonth = new Date(year, month!, 0); // Last day of the month

            let currentWeekStart = startOfMonth;
            while (currentWeekStart <= endOfMonth) {
                const currentWeekEnd = new Date(currentWeekStart);
                currentWeekEnd.setDate(currentWeekEnd.getDate() + 6); // End of the week

                const weekRange = `${currentWeekStart.toISOString().split('T')[0]} to ${currentWeekEnd > endOfMonth ? endOfMonth.toISOString().split('T')[0] : currentWeekEnd.toISOString().split('T')[0]}`;
                weeklyLogs[weekRange] = 0; // Initialize with count 0

                logs.forEach(log => {
                    const logDate = new Date(log.completionDate);
                    if (logDate >= currentWeekStart && logDate <= currentWeekEnd) {
                        weeklyLogs[weekRange] += log.completePercentage; // Increment by completePercentage for that week
                        completeCount += log.completePercentage;
                    }
                });

                currentWeekStart.setDate(currentWeekStart.getDate() + 7); // Move to next week
            }

            // const totalDaysInMonth = new Date(year, month!, 0).getDate();
            const completionRate = totalTrackingCount ? ((completeCount / totalTrackingCount) * 100).toFixed(2) : 0;

            return { logs: weeklyLogs, completionRate };

        } else if (type === 'Monthly') {
            const monthlyLogs = {};

            for (let m = 0; m < 12; m++) { // Loop through all months in the year
                const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, m));

                monthlyLogs[monthName] = 0; // Initialize with count 0

                logs.forEach(log => {
                    const logDate = new Date(log.completionDate);
                    if (logDate.getMonth() === m) { // Check if log is in this month
                        monthlyLogs[monthName] += log.completePercentage; // Increment by completePercentage
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


// Function to resume a habit
const resumeHabit = async (habitId: number): Promise<void> => {
    try {

        const habit = await db.habits.get(habitId);
        if (!habit) {
            throw new Error("Habit not found");
        }

        habit.isPaused = false;

        // Get the current date to use as lastScheduledDate
        const lastScheduledDate = new Date().toISOString(); // Use ISO format for consistency

        let currentlyScheduledFor;
        let nextScheduledFor;

        if (habit.frequencyType === 'Custom') {
            const dates = calculateNextScheduledDateForCustom({ type: habit.customFrequencyType, value: habit.frequencyValue }, lastScheduledDate);
            currentlyScheduledFor = dates.currentlyScheduledFor;
            nextScheduledFor = dates.nextScheduledFor;
        } else {
            const dates = calculateCurrentAndNextScheduledDate(habit.frequencyType, habit);
            currentlyScheduledFor = dates.currentlyScheduledFor;
            nextScheduledFor = dates.nextScheduledFor;
        }

        await db.habits.update(habitId, {
            isPaused: false,
            currentScheduledDate: currentlyScheduledFor.toISOString(),
            nextScheduledDate: nextScheduledFor.toISOString(),
        });

        console.log("Habit resumed successfully:", habitId);
    } catch (error) {
        console.error("Error resuming habit:", error);
        throw error;
    }
};

// resumeHabit(1)
//     .then(() => {
//         console.log("Habit resumed.");
//     })
//     .catch(error => {
//         console.error("Failed to resume habit:", error);
//     });


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


// Trigger reminders
export const triggerNotification = () => {

    console.log(Notification.permission)
    if (Notification.permission === "granted") {
        new Notification("jfo")
        // navigator.serviceWorker.ready.then(registration => {
        //     console.log("entered")
        //     // registration.showNotification('Reminder!', {
        //     //     body: 'Update your progress and maintain your streak',
        //     //     action: [{ action: 'update', title: 'Update' }],
        //     //     data: { url: '/settings#progressUpdate' },
        //     //     sound: '/sounds/sound1.mp3',
        //     // });

        //     // registration.active.postMessage(
        //     //     "Test message sent immediately after creation",
        //     // );

        //     // const audio = new Audio('/sounds/sound1.mp3');
        //     // audio.loop = true; // Loop the sound
        //     // audio.play();

        //     // Stop sound when user clicks on notification or updates
        //     registration.getNotifications().then(notifications => {
        //         notifications.forEach(notification => {
        //             notification.addEventListener('click', () => {
        //                 audio.pause(); // Stop sound when clicked
        //             });
        //         });
        //     });
        // });
    }
}

// triggerNotification()

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