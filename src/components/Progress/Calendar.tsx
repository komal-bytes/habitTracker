import React, { useRef, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // Locale for formatting dates
import advancedFormat from 'dayjs/plugin/advancedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Log } from "@/config/db";
import { CircularProgress, Tooltip } from '@nextui-org/react';
import { toPng } from 'html-to-image';
import WhatsAppButton from './WhatsAppButton';

dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);

interface CalendarProps {
    habitLog: { [date: string]: Log }; // Example: { "2023-12-05": { completePercentage: 70 } }
}

const Calendar: React.FC<CalendarProps> = ({ habitLog }) => {

    const progressRef = useRef<HTMLDivElement>(null);
    const [selectedMonth, setSelectedMonth] = useState(dayjs().month()); // 0: January, 11: December
    const [selectedYear, setSelectedYear] = useState(dayjs().year());
    const [showTooltip, setShowTooltip] = useState("");
    const currentDate = dayjs().format('YYYY-MM-DD');

    const handleShareOnWhatsApp = async () => {
        if (navigator.canShare && progressRef.current) {
            try {
                // Capture screenshot as a data URL
                const dataUrl = await toPng(progressRef.current);

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

    // Get days in the selected month and year
    const daysInMonth = dayjs(`${selectedYear}-${selectedMonth + 1}`).daysInMonth();

    // Previous and Next Month Handlers
    const handlePreviousMonth = () => {
        const newDate = dayjs(`${selectedYear}-${selectedMonth + 1}`).subtract(1, 'month');
        setSelectedMonth(newDate.month());
        setSelectedYear(newDate.year());
    };

    const handleNextMonth = () => {
        const newDate = dayjs(`${selectedYear}-${selectedMonth + 1}`).add(1, 'month');
        setSelectedMonth(newDate.month());
        setSelectedYear(newDate.year());
    };

    const renderDays = () => {
        const days = [];
        for (let i = 1; i <= daysInMonth; i++) {
            const dateString = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${i
                .toString()
                .padStart(2, '0')}`;
            const log = habitLog[dateString];
            const completePercentage = log?.completePercentage || 0;

            // Check if the current date should be highlighted
            const isToday = dateString === currentDate;
            console.log(log?.notes)
            days.push(
                <Tooltip
                    showArrow
                    placement="top"
                    content={`Notes: ${log?.notes}`}
                    isOpen={showTooltip === log?.id}
                    onOpenChange={setShowTooltip}
                    className={`${!log?.notes ? 'hidden' : ''}`}
                    classNames={{
                        base: [
                            // arrow color
                            `${!log?.notes ? 'hidden' : ''}`
                            // "before:bg-neutral-400 dark:before:bg-white w-auto",
                        ],
                        content: [
                            "py-2 px-4 shadow-xl",
                            // "text-black bg-gradient-to-br from-white to-neutral-300",
                        ],
                    }}
                >
                    <div
                        key={i}
                        className={`relative flex justify-center items-center flex-wrap cursor-pointer w-8 h-8 md:w-10 md:h-10 rounded-full my-2 mx-0 text-center border
            ${isToday ? 'bg-neutral-300 text-gray-900 border-none' : 'bg-white text-gray-900 border-gray-300'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowTooltip(log?.id)
                        }}
                    >
                        <CircularProgress
                            size="md"
                            value={completePercentage}
                            classNames={{
                                // svg: "drop-shadow-md",
                                indicator: "stroke-secondary",
                                track: "stroke-none",
                                value: "text-xs font-semibold",
                            }}
                            className='absolute'
                            showValueLabel={false}
                        />

                        <span className="z-10">{i}</span>
                    </div>
                </Tooltip>
            );
        }
        return days;
    };

    return (
        <>
            <div className="flex flex-col items-center w-full m-auto p-4"
                ref={progressRef}
                onClick={(e) => {
                    e.stopPropagation();
                    setShowTooltip(false)
                }}
            >
                {/* Month and Year Selector */}
                <div className="flex justify-between items-center w-full mb-4">
                    <button onClick={handlePreviousMonth} className="p-2 bg-orange-500 text-white rounded-full">
                        &lt;
                    </button>
                    <div className="flex flex-col items-center">
                        <span className="text-xl font-bold">
                            {dayjs(`${selectedYear}-${selectedMonth + 1}`).format('MMMM, YYYY')}
                        </span>
                    </div>
                    <button onClick={handleNextMonth} className="p-2 bg-orange-500 text-white rounded-full">
                        &gt;
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 w-full">
                    {/* Weekday Labels */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center font-semibold">
                            {day}
                        </div>
                    ))}
                    {/* Render Days */}
                    {renderDays()}
                </div>

            </div>
            <WhatsAppButton share={handleShareOnWhatsApp} />
        </>
    );
};

export default Calendar;
