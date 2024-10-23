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
import Lottie from "react-lottie-player";
import empty from "@/utils/animations/empty.json";

const Habits: React.FC = () => {

    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [habitsData, setHabitsData] = useState([]);
    const [selectedHabit, setSelectedHabit] = useState({});
    const [showTooltip, setShowTooltip] = useState<Number | boolean>(false);
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    useEffect(() => {
        (async () => {
            await getListOfHabits()
        })()
    }, [isOpen])

    const getListOfHabits = async () => {
        try {
            const habits = await getAllHabits();
            setHabitsData(habits);
        } catch (err) {

        }
    }

    function showNotification(title, body) {
        new Notification(title, {
            body: body,
            icon: "path/to/icon.png", // Optional: path to an icon
        });
    }

    console.log(habitsData)

    return (
            <div className="h-full w-full flex-column items-center justify-start"
                onClick={(e) => {
                    e.stopPropagation();
                    setShowTooltip(false)
                }}
            >

                {
                    habitsData.length === 0
                    &&
                    <div className='flex justify-center'>
                        <Lottie
                            loop
                            animationData={empty}
                            play
                            style={{ width: 250, height: 250 }}
                        />
                    </div>
                }

                <div className="space-y-3">
                    {habitsData.map(habit => (
                        <div
                            key={habit.id}
                            className="flex justify-between items-center p-4 rounded-2xl border border-grey"
                        >
                            <div className="flex items-center  cursor-pointer"
                                onClick={() => {
                                    setSelectedHabit(habit)
                                    !isOpen && onOpen();
                                }}
                            >
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

                                <ToggleHabit habit={habit} getListOfHabits={getListOfHabits} showTooltip={showTooltip} setShowTooltip={setShowTooltip} />

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
                    className="absolute bottom-[10px] left-1/2 bg-button-gradient text-white text-lg transform -translate-x-1/2 shadow-custom-blue"
                    onClick={onOpen}
                >
                    <MdAdd className="text-xl" />
                    New Habit
                </Button>

                {/* {console.log(isDeleteOpen, selectedHabit)} */}
                {isDeleteOpen && <DeleteHabitModal isOpen={isDeleteOpen} onClose={onDeleteClose} selectedHabit={selectedHabit} setSelectedHabit={setSelectedHabit} getListOfHabits={getListOfHabits} />}

                {isOpen && <HabitForm isOpen={isOpen} onClose={onClose} onOpenChange={onOpenChange} selectedHabit={selectedHabit} setSelectedHabit={setSelectedHabit} />}
            </div>
    );
};

export default Habits;