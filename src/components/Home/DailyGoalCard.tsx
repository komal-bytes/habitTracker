import React, { useEffect, useState } from "react";
import { Progress } from "@nextui-org/react";
import { Image } from "@nextui-org/react"; // If you are using Next.js Image optimization
import meditationAvatar from "/icons/meditating.png"; // Update this path to the correct image

interface DailyGoalCardProps {
    logs: object
}

const DailyGoalCard: React.FC<DailyGoalCardProps> = ({ logs }) => {

    const [totalTasks, setTotalTasks] = useState(Object.keys(logs).length)
    const [completedTasks, setCompletedTask] = useState(0);
    const [goalProgress, setGoalProgress] = useState(0);

    // console.log(logs)
    useEffect(() => {
        let count = 0;
        let countValue = 0;
        setTotalTasks(Object.keys(logs).length);
        let tasksCount = Object.keys(logs).length;
        for (let log of Object.values(logs)) {
            if (log.completePercentage === 100) count++;
            countValue += log.completePercentage;
        }
        setCompletedTask(count);
        setGoalProgress((countValue / (tasksCount * 100)) * 100);
    }, [logs])

    return (
        <div className="w-full my-12 relative max-w-sm p-4 rounded-2xl shadow-lg flex justify-end flex items-center bg-custom-gradient">
            {/* Avatar */}
            <div className="w-1/3 absolute left-0 top-[-40%]">
                <Image
                    src={meditationAvatar}
                    alt="Meditation Avatar"
                    className="w-full h-auto"
                    priority
                />
            </div>

            {/* Goal Progress */}
            <div className="flex flex-col w-2/3">
                <h3 className="text-white font-semibold text-sm">
                    Your Daily Goal Almost Done
                </h3>
                <p className="text-white text-xs">{completedTasks} of {totalTasks} completed</p>

                {/* Progress Bar */}
                <div className="mt-2">
                    <Progress
                        value={goalProgress}
                        classNames={{
                            base: "max-w-md",
                            track: "drop-shadow-md border border-none bg-secondary",
                            indicator: "bg-white",
                            label: "tracking-wider font-medium text-default-600",
                        }}
                        size="md"
                        aria-label="Progress Bar"
                        value={goalProgress}
                    />
                </div>

                {/* Percentage */}
                {
                     isNaN(goalProgress) === false
                    &&
                    <p className="text-white text-right text-sm mt-1">{goalProgress}%</p>
                }
            </div>
        </div>
    );
};

export default DailyGoalCard;
