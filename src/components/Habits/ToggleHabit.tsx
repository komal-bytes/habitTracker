// components/HabitToggle.tsx
import React, { useState } from 'react';
import { RxResume } from 'react-icons/rx';
import { MdOutlinePause } from 'react-icons/md';
import { Tooltip, cn } from '@nextui-org/react';
import { Switch } from '@nextui-org/switch';
import { updateHabitDetails } from '@/utils/habitFunctions';

interface ToggleHabitProps {
    habit: Object,
    getListOfHabits: Function,
    showTooltip: Boolean | Number,
    setShowTooltip: Function
}

const ToggleHabit: React.FC<ToggleHabitProps> = ({ habit, getListOfHabits, showTooltip, setShowTooltip }) => {

    const pauseOrResumeHabit = async (pause: boolean, habit: object) => {
        try {
            await updateHabitDetails(habit?.id, { ...habit, isPaused: pause });
            setShowTooltip(false);
            await getListOfHabits()
        } catch (err) {
            setShowTooltip(false);
        }
    }
    
    return (
        <div className="relative">
            {
                showTooltip === habit.id
                &&
                <Tooltip
                    showArrow
                    placement="top"
                    content={
                        <div className="flex flex items-center space-x-2">
                            <p>{habit?.isPaused ? 'Resume' : 'Pause'} the Habit</p>
                            <Switch size="sm"
                                classNames={{
                                    wrapper: cn(
                                        "group-data-[selected=true]:bg-button-gradient"
                                    ),
                                }}
                                isSelected={!habit.isPaused}
                                name="isPaused"
                                onChange={(e) => {
                                    pauseOrResumeHabit(!habit.isPaused, habit)
                                }}
                            />
                        </div>
                    }
                    classNames={{
                        base: [
                            // arrow color
                            "before:bg-neutral-400 dark:before:bg-white",
                        ],
                        content: [
                            "py-2 px-4 shadow-xl",
                            "text-black bg-gradient-to-br from-white to-neutral-400",
                        ],
                    }}
                    isOpen={showTooltip === habit?.id}
                    onOpenChange={setShowTooltip}
                >
                    <div></div>
                </Tooltip>
            }


            <div
                className="rounded-full border-2 border-gray-400 flex items-center justify-center w-8 h-8 bg-gray-200 cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation()
                    setShowTooltip(habit.id)
                }}
            >
                {habit?.isPaused ? <RxResume className="text-2xl text-black" /> : <MdOutlinePause className="text-2xl text-black" />}
            </div>
        </div>
    );
};

export default ToggleHabit;