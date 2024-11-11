import { Habit } from '@/config/db';
import React, { useState } from 'react'
import { Accordion, AccordionItem } from '@nextui-org/react';
import { FaLock } from "react-icons/fa";

interface HabitListProps {
    habits: Habit[]; // Array of Habit objects
}

const HabitList: React.FC<HabitListProps> = ({ habits }) => {

    const [selectedKeys, setSelectedKeys] = useState([]);


    const handleToggle = (key: string) => {
        setSelectedKeys((prev: any) =>
            prev.includes(key) ? prev.filter((item: any) => item !== key) : [...prev, key]
        );
    };


    return (
        <Accordion
            selectedKeys={selectedKeys} // Convert Set to Array for controlled behavior
            onSelectionChange={handleToggle} // Update state on selection change
            className="my-5 flex flex-col lg:flex-row lg:flex-wrap lg:items-start"
            variant="splitted"
        >
            {
                habits.map((habit) => (
                    <AccordionItem
                        className={`rounded-xl m-auto my-2 w-full md:w-4/5 lg:w-[45%]  ${selectedKeys.includes(habit?.id) ? "bg-cherryRed" : ""}`}
                        key={habit.id} aria-label={habit?.habitName} title={habit?.habitName} subtitle={habit?.category}
                        //TO:DO
                        indicator={<FaLock />}
                    >

                        <div>
                            Heyyyyf
                        </div>
                    </AccordionItem>
                ))
            }
        </Accordion >
    )
}

export default HabitList