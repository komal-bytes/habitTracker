import React, { useState } from 'react';
import { habitIconTypes } from '@/utils/icons'; // Assuming habitIconTypes object is defined elsewhere
import { Tooltip } from '@nextui-org/react';

interface HabitIconTypesProps {
    habit: object,
    setHabit: Function,
    showTooltip: String | Boolean,
    setShowTooltip: Function
}
const HabitIconTypes: React.FC<HabitIconTypesProps> = ({ habit, setHabit, showTooltip, setShowTooltip }) => {

    // Handle click on an icon
    const handleClick = (iconType: string) => {
        setHabit((prev: any) => {
            return {
                ...prev,
                iconType
            }
        })
        setShowTooltip(iconType)
    };

    return (
        <div className="grid grid-cols-4 gap-4 justify-center items-center p-6 rounded-lg shadow-[0_4px_15px_0_rgba(0,0,0,0.1)] my-4"
            onClick={(e) => {
                e.stopPropagation()
                setShowTooltip(false)
            }}
        >
            {Object.keys(habitIconTypes).map((iconType) => {
                const { icon, gradient, name } = habitIconTypes[iconType as keyof typeof habitIconTypes];

                return (
                    <Tooltip
                        showArrow
                        placement="top"
                        content={name}
                        classNames={{
                            base: [
                                // arrow color
                                "before:bg-neutral-400 dark:before:bg-white",
                            ],
                            content: [
                                "py-2 px-4 shadow-xl",
                                "text-black bg-gradient-to-br from-white to-neutral-300",
                            ],
                        }}
                        // isOpen={showTooltip === iconType}
                    // onOpenChange={setShowTooltip}
                    >
                        <div
                            key={iconType}
                            onClick={(e) =>{
                                e.stopPropagation();
                                handleClick(iconType)}}
                            className={`
                            ${gradient} 
                            rounded-full w-[60px] h-[60px] p-3 flex justify-center items-center 
                            cursor-pointer transform transition-all duration-300 ease-in-out 
                            scale-100 hover:scale-125 hover:animate-wobble-slow ${habit.iconType === iconType && "border border-2 border-neutral-300 scale-125 animate-wobble-slow"}
                          `}
                        >
                            <img src={icon} alt={`${iconType} icon`} className="w-8 h-8" />
                        </div>
                    </Tooltip>
                );
            })}
        </div>
    );
};

export default HabitIconTypes;
