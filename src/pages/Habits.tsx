// pages/index.tsx
import DeleteHabitModal from "@/components/Habits/DeleteHabitModal";
import HabitForm from "@/components/Habits/HabitForm";
import ToggleHabit from "@/components/Habits/ToggleHabit";
import { formatTime, getAllHabits } from "@/utils/habitFunctions";
import { habitIconTypes } from "@/utils/icons";
import { Button, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";


const Habits: React.FC = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [habitsData, setHabitsData] = useState([]);
    const [selectedHabit, setSelectedHabit] = useState({});
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    useEffect(() => {
        getListOfHabits()
    }, [isOpen])

    const getListOfHabits = async () => {
        try {
            const habits = await getAllHabits();
            setHabitsData(habits);
        } catch (err) {

        }
    }


    // console.log(habitsData)

    return (
        <div className="relative h-full w-full flex-column items-center justify-start">

            <div className="space-y-3">
                {habitsData.map(habit => (
                    <div
                        key={habit.id}
                        className="flex justify-between items-center bg-white p-4 rounded-2xl border border-grey cursor-pointer"
                        onClick={() => {
                            setSelectedHabit(habit)
                            onOpen()
                        }}
                    >
                        <div className="flex items-center">
                            <div className={`mr-5 rounded-full w-[40px] h-[40px] flex items-center justify-center border ${habitIconTypes?.[habit.iconType]?.gradient}`}>
                                <img src={habitIconTypes[habit.iconType]?.icon} alt="" className='w-[25px] h-[25px]' />
                            </div>
                            <div>
                                <p className="font-semibold">{habit?.habitName}</p>
                                <p className='text-sm flex items-center'>{habit?.frequencyType === "Custom" ? habit?.customFrequency : habit.frequencyType}</p>
                                <p className="text-xs text-grey">{formatTime(habit?.time)}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">

                            <ToggleHabit habit={habit} getListOfHabits={getListOfHabits} />

                            <div className="rounded-full border-2 border-grey flex items-center justify-center w-8 h-8 bg-gray-200">
                                <MdDeleteOutline className="text-2xl text-black" onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedHabit(habit)
                                    onDeleteOpen()
                                }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Absolute positioned button */}
            <Button
                className="absolute bottom-[12%] left-1/2 bg-button-gradient text-white text-lg transform -translate-x-1/2 shadow-custom-blue"
                onClick={onOpen}
            >
                <MdAdd className="text-xl" />
                New Habit
            </Button>

            {console.log(isDeleteOpen, selectedHabit)}
            {isDeleteOpen && <DeleteHabitModal isOpen={isDeleteOpen} onClose={onDeleteClose} selectedHabit={selectedHabit} getListOfHabits={getListOfHabits} />}

            {isOpen && <HabitForm isOpen={isOpen} onClose={onClose} selectedHabit={selectedHabit} setSelectedHabit={setSelectedHabit} />}
        </div>
    );
};

export default Habits;