import { Habit } from "@/config/db";

interface frequency {
    type: string;
    value: number;
    startDay: Date;
}


export function calculateNextScheduledDateForCustom(frequency: frequency, currentScheduledDate: String, nextScheduledDate: string) {
    let nextScheduled = new Date(nextScheduledDate);

    switch (frequency.type) {
        case "days":
            nextScheduled.setDate(nextScheduled.getDate() + frequency.value);
            break;
        case "weeks":
            nextScheduled.setDate(nextScheduled.getDate() + frequency.value * 7);
            break;
        case "months":
            nextScheduled.setMonth(nextScheduled.getMonth() + frequency.value);
            break;
        case "hours":
            nextScheduled.setHours(nextScheduled.getHours() + frequency.value);
            break;
        case "minutes":
            nextScheduled.setMinutes(nextScheduled.getMinutes() + frequency.value);
            break;
        default:
            throw new Error("Invalid frequency type");
    }

    return {
        lastScheduledFor: new Date(currentScheduledDate),
        currentlyScheduledFor: new Date(nextScheduledDate),
        nextScheduledFor: nextScheduled,
    };
}

export const calculateNextScheduledDate = (type: string, habit: Habit, currentDate: String, nextDate: String) => {
    let lastScheduledFor = new Date(currentDate);
    let currentlyScheduledFor = new Date(nextDate);
    let nextScheduledFor = new Date(currentlyScheduledFor);
    const currentDay = new Date(currentlyScheduledFor).getDay(); // get current day number (0-6)

    switch (type) {
        case "Daily":
            nextScheduledFor.setDate(currentlyScheduledFor.getDate() + 1);
            break;

        case 'Weekly':
            nextScheduledFor.setDate(currentlyScheduledFor.getDate() + 7); // Next Sunday after that
            break;

        case 'Specific Days':

            const specificDays = habit.specificFrequencyDays
            const nextDayIndex = specificDays.findIndex(day => day > currentDay);
            if (nextDayIndex !== -1) {
                // If a next day is found in the same week
                nextScheduledFor = new Date(currentlyScheduledFor);
                nextScheduledFor.setDate(currentlyScheduledFor.getDate() + (specificDays[nextDayIndex] - currentDay));
            } else {
                // If no next day is found, use the first day in the next week from the array
                nextScheduledFor = new Date(currentlyScheduledFor);
                nextScheduledFor.setDate(currentlyScheduledFor.getDate() + (7 - currentDay + specificDays[0]));
            }
            break;

        default:
            throw new Error("Invalid type");
    }

    return { lastScheduledFor, currentlyScheduledFor, nextScheduledFor };

}

export const calculateCurrentAndNextScheduledDate = (type: string, habit: Habit) => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)

    let currentlyScheduledFor;
    let nextScheduledFor;

    switch (type) {
        case 'Daily':
            currentlyScheduledFor = today;
            nextScheduledFor = new Date(today);
            nextScheduledFor.setDate(today.getDate() + 1); // Next day's date
            break;

        case 'Weekly':
            const daysUntilSunday = (7 - currentDay) % 7;
            currentlyScheduledFor = new Date(today);
            currentlyScheduledFor.setDate(today.getDate() + daysUntilSunday); // Coming Sunday

            nextScheduledFor = new Date(currentlyScheduledFor);
            nextScheduledFor.setDate(currentlyScheduledFor.getDate() + 7); // Next Sunday after that
            break;

        case 'Specific Days':
            if (!habit || !habit.specificFrequencyDays || habit.specificFrequencyDays.length === 0) {
                throw new Error("Invalid habit data");
            }

            const specificDays = habit.specificFrequencyDays;

            // Find the closest day number that is equal to or greater than the current day number
            const nextDayIndex = specificDays.findIndex(day => day >= currentDay);

            if (specificDays.length === 1) {
                // If there's only one day, use that for both dates
                currentlyScheduledFor = new Date(today);
                currentlyScheduledFor.setDate(today.getDate() + ((specificDays[0] + 7 - currentDay) % 7)); // Calculate the date for the available day
                nextScheduledFor = new Date(currentlyScheduledFor);
                nextScheduledFor.setDate(currentlyScheduledFor.getDate() + 7); // Next scheduled date is 7 days later
            } else if (nextDayIndex !== -1) {
                // If a suitable day is found
                currentlyScheduledFor = new Date(today);
                currentlyScheduledFor.setDate(today.getDate() + ((specificDays[nextDayIndex] + 7 - currentDay) % 7)); // Calculate the date for the closest day
                nextScheduledFor = new Date(currentlyScheduledFor);

                // Find the next scheduled day after currentlyScheduledFor
                const nextIndex = (nextDayIndex + 1) % specificDays.length; // Loop back to start if at end of array
                nextScheduledFor.setDate(currentlyScheduledFor.getDate() + ((specificDays[nextIndex] + 7 - specificDays[nextDayIndex]) % 7));
            } else {
                // If no suitable day is found, use numbers from the start of the array
                currentlyScheduledFor = new Date(today);
                currentlyScheduledFor.setDate(today.getDate() + ((specificDays[0] + 7 - currentDay) % 7)); // First day

                nextScheduledFor = new Date(currentlyScheduledFor);
                nextScheduledFor.setDate(currentlyScheduledFor.getDate() + ((specificDays[1] !== undefined ? specificDays[1] : specificDays[0]) + 7 - specificDays[0]) % 7); // Second day or loop back to first
            }
            break;
        default:
            throw new Error("Invalid type");
    }

    return { currentlyScheduledFor, nextScheduledFor };
};