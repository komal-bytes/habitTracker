import { Habit } from '@/config/db';
import { getAllHabits } from '@/utils/habitFunctions';
import React, { useEffect, useState } from 'react'
import { Accordion, AccordionItem, AccordionHeader, AccordionBody } from '@nextui-org/react';
import Lottie from 'react-lottie-player';
import done from '@/utils/animations/done.json'
import { FaLock } from "react-icons/fa";
import { ImUnlocked } from "react-icons/im";

interface HabitListProps {
    habits: Habit[]; // Array of Habit objects
}

const HabitList: React.FC<HabitListProps> = ({ habits }) => {

    const [selectedKeys, setSelectedKeys] = useState([]);

    console.log(habits)

    const handleToggle = (key: string) => {
        // setSelectedKeys((prev) => {
        //     const newKeys = new Set(prev);
        //     if (newKeys.has(key)) {
        //         newKeys.delete(key); // Collapse if already expanded
        //     } else {
        //         newKeys.add(key); // Expand if not
        //     }
        //     return newKeys;
        // });
        console.log(key, "heyyyy");
        setSelectedKeys((prev: any) =>
            prev.includes(key) ? prev.filter((item: any) => item !== key) : [...prev, key]
        );
    };

    console.log(selectedKeys)

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