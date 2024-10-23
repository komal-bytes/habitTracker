import { Habit } from "@/config/db";

interface frequency {
    type: string;
    value: number;
    startDay: Date;
}


export function calculateNextScheduledDateForCustom(frequency: frequency, currentScheduledDate: string) {
    let nextScheduled = new Date(currentScheduledDate);

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
        currentlyScheduledFor: new Date(currentScheduledDate),
        nextScheduledFor: nextScheduled,
    };
}

// export const calculateNextScheduledDate = (type: string, habit: Habit, currentDate: String) => {
//     let lastScheduledFor = new Date(currentDate);
//     let currentlyScheduledFor = new Date();
//     let nextScheduledFor = new Date(currentlyScheduledFor);
//     const currentDay = new Date(currentlyScheduledFor).getDay(); // get current day number (0-6)

//     switch (type) {
//         case "Daily":
//             nextScheduledFor.setDate(currentlyScheduledFor.getDate() + 1);
//             break;

//         case 'Weekly':
//             nextScheduledFor.setDate(currentlyScheduledFor.getDate() + 7); // Next Sunday after that
//             break;

//         case 'Specific Days':

//             const specificDays = habit.specificFrequencyDays
//             const nextDayIndex = specificDays.findIndex(day => day > currentDay);
//             if (nextDayIndex !== -1) {
//                 // If a next day is found in the same week
//                 nextScheduledFor = new Date(currentlyScheduledFor);
//                 nextScheduledFor.setDate(currentlyScheduledFor.getDate() + (specificDays[nextDayIndex] - currentDay));
//             } else {
//                 // If no next day is found, use the first day in the next week from the array
//                 nextScheduledFor = new Date(currentlyScheduledFor);
//                 nextScheduledFor.setDate(currentlyScheduledFor.getDate() + (7 - currentDay + specificDays[0]));
//             }
//             break;

//         default:
//             throw new Error("Invalid type");
//     }

//     return { lastScheduledFor, currentlyScheduledFor, nextScheduledFor };

// }

interface Habit {
    specificFrequencyDays: number[];
    currentScheduledDate: string;
    customFrequencyType: string;
    frequencyValue: number;
}

export function calculateNextScheduledDate(type: string, habit: Habit, currentDate: string): { lastScheduledFor: Date; currentlyScheduledFor: Date; nextScheduledFor: Date } {
    const current = new Date(currentDate);
    const currentDay = current.getDay();
    let lastScheduledFor: Date;
    let currentlyScheduledFor: Date;
    let nextScheduledFor: Date;

    if (type === 'Daily') {
        lastScheduledFor = new Date(current);
        lastScheduledFor.setDate(current.getDate() - 1);
        currentlyScheduledFor = new Date(current);
        nextScheduledFor = new Date(current);
        nextScheduledFor.setDate(current.getDate() + 1);
    } else if (type === 'Specific Days') {
        const daysArray = habit.specificFrequencyDays.sort((a, b) => a - b);
        const todayIndex = daysArray.indexOf(currentDay);

        lastScheduledFor = todayIndex !== -1 ? new Date(current) : new Date(current);
        lastScheduledFor.setDate(current.getDate() - (todayIndex === -1 ? 1 : 0));

        currentlyScheduledFor = daysArray.find(day => day >= currentDay) !== undefined
            ? new Date(current).setDate(current.getDate() + (daysArray.find(day => day >= currentDay)! - currentDay))
            : new Date(current).setDate(current.getDate() + (daysArray[0] - currentDay));

        nextScheduledFor = daysArray.find(day => day > currentlyScheduledFor.getDay()) !== undefined
            ? new Date(current).setDate(current.getDate() + (daysArray.find(day => day > currentlyScheduledFor.getDay())! - currentDay))
            : new Date(current).setDate(current.getDate() + (daysArray[0] - currentDay));
    } else if (type === 'Custom') {
        currentlyScheduledFor = new Date(habit.currentScheduledDate);
        while (currentlyScheduledFor < current) {
            switch (habit.customFrequencyType) {
                case 'day':
                case 'days':
                    currentlyScheduledFor.setDate(currentlyScheduledFor.getDate() + habit.frequencyValue);
                    lastScheduledFor.setDate(currentlyScheduledFor.getDate() - habit.frequencyValue);
                    nextScheduledFor.setDate(currentlyScheduledFor.getDate() + habit.frequencyValue)
                    break;
                case 'week':
                case 'weeks':
                    currentlyScheduledFor.setDate(currentlyScheduledFor.getDate() + habit.frequencyValue * 7);
                    lastScheduledFor.setDate(currentlyScheduledFor.getDate() - habit.frequencyValue * 7);
                    nextScheduledFor.setDate(currentlyScheduledFor.getDate() + habit.frequencyValue * 7);
                    break;
                case 'month':
                case 'months':
                    currentlyScheduledFor.setMonth(currentlyScheduledFor.getMonth() + habit.frequencyValue);
                    lastScheduledFor.setMonth(currentlyScheduledFor.getMonth() - habit.frequencyValue);
                    nextScheduledFor.setMonth(currentlyScheduledFor.getMonth() + habit.frequencyValue);
                    break;
                case 'hour':
                case 'hours':
                    currentlyScheduledFor.setHours(currentlyScheduledFor.getHours() + habit.frequencyValue);
                    lastScheduledFor.setHours(currentlyScheduledFor.getHours() - habit.frequencyValue);
                    nextScheduledFor.setHours(currentlyScheduledFor.getHours() + habit.frequencyValue);
                    break;
                case 'minute':
                case 'minutes':
                    currentlyScheduledFor.setMinutes(currentlyScheduledFor.getMinutes() + habit.frequencyValue);
                    lastScheduledFor.setMinutes(currentlyScheduledFor.getMinutes() - habit.frequencyValue);
                    nextScheduledFor.setMinutes(currentlyScheduledFor.getMinutes() + habit.frequencyValue);
                    break;
            }
        }
    }

    return {
        lastScheduledFor,
        currentlyScheduledFor,
        nextScheduledFor
    };
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