import React, { useEffect, useState } from 'react';
import { Modal, Button, Slider, CircularProgress, Image, useDisclosure, ModalContent } from '@nextui-org/react';
import { FaBed, FaBicycle, FaBook } from 'react-icons/fa';
import { RiCloseLine } from 'react-icons/ri';
import { FiSmile, FiFrown } from 'react-icons/fi';
import DailyGoalCard from '@/components/Home/DailyGoalCard';
import checked from "/icons/checked.png";
import { habitIconTypes } from "@/utils/icons";
import celebrate from "/icons/confetti.gif";
import sad from "/icons/sad.png";
import neutral from "/icons/neutral.png";
import smile from "/icons/smiling.png";
import happy from "/icons/happy.png";
import happiest from "/icons/happiest.png";
import { createLogAndUpdateHabit, fetchDailyHabitLogByHabitId, formatTime, getCurrentHabits, updateLogDetails } from '@/utils/habitFunctions';
import CreateHabitLoader from '@/components/Habits/CreateHabitLoader';
import empty from "@/utils/animations/empty.json";
import Lottie from 'react-lottie-player';
import { useOutletContext } from 'react-router-dom';


const Daily: React.FC = () => {

    const { userInfo, setUserInfo } = useOutletContext();
    console.log(userInfo?.theme)
    const [selectedHabit, setSelectedHabit] = useState<number | null>(null);
    const [progress, setProgress] = useState<number>(5);
    const [notes, setNotes] = useState<string>("");
    const [habitIcons, setHabitIcons] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [habitsData, setHabitsData] = useState([])
    const [logs, setLogs] = useState({});

    const { isOpen: isLoaderOpen, onOpen: onLoaderOpen, onClose: onLoaderClose } = useDisclosure();
    const [loader, setLoader] = useState("");

    useEffect(() => {
        setHabitIcons(habitIconTypes)
    }, [])

    useEffect(() => {
        createLog();
    }, [])

    const createLog = async () => {
        let habitsList = await getCurrentHabits();
        // console.log(habitsList)
        for (let i = 0; i < habitsList.length; i++) {
            // console.log(res.id)
            let habit = habitsList[i]
            let log = await createLogAndUpdateHabit({ habitId: habit?.id, completionDate: new Date(), notes: "", completePercentage: 0 })
            setLogs((prev) => {
                return {
                    ...prev,
                    [habit?.id]: log
                }
            })
        }
        setHabitsData(habitsList);
    }


    // Emoji based on slider value
    const getEmoji = (value: number) => {
        if (value <= 29) return sad;
        if (value >= 30 && value <= 49) return neutral;
        if (value >= 50 && value <= 69) return smile;
        if (value >= 70 && value <= 99) return happy;
        return happiest;
    };

    // Open Modal for habit
    const handleOpen = (habit: object) => {
        onOpen();
        setSelectedHabit(habit)
        setProgress(logs[habit.id].completePercentage);
        setNotes(logs[habit.id].notes)
    }

    const handleUpdateProgress = async () => {
        try {
            await updateLogDetails(logs[selectedHabit?.id].id, selectedHabit?.id, { ...logs[selectedHabit.id], completePercentage: progress, notes })
            setLoader("done");
            onLoaderOpen();
            await delayDone();
        } catch (err) {
            setLoader("error")
            onLoaderOpen();
            await delayDone()
        }
    };

    const delayDone = async () => {
        setTimeout(async () => {
            onLoaderClose();
            onClose();
            setSelectedHabit(null);
            setProgress(5); // Reset slider
            setNotes(""); // Reset notes

            let updatedLogs = {}
            for (let habitId in logs) {
                updatedLogs[habitId] = await fetchDailyHabitLogByHabitId(logs[habitId]?.id);
            }
            setLogs(updatedLogs)
        }, 2000)
    }


    const getStatus = (completePercentage: number): string => {
        if (completePercentage >= 0 && completePercentage < 30) {
            return "Just Started";
        } else if (completePercentage >= 30 && completePercentage < 50) {
            return "On the right track";
        } else if (completePercentage >= 50 && completePercentage < 70) {
            return "Halfway there!";
        } else if (completePercentage >= 70 && completePercentage < 100) {
            return "Almost done!";
        } else if (completePercentage === 100) {
            return "Completed";
        } else {
            return "Invalid percentage";
        }
    };

    // console.log(habitsData, "habitss")
    // console.log(logs, "logss")

    return (
        <div>

            <DailyGoalCard logs={logs} />

            {/* Today's Habits Section */}
            <div>
                <h2 className="text-2xl font-bold mb-5">Today Habits</h2>
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

                <div className="space-y-2">
                    {habitsData.map(habit => (
                        <div
                            key={habit.id}
                            className={`flex justify-between items-center p-4 rounded-2xl border border-grey cursor-pointer`}
                            onClick={() => handleOpen(habit)}
                        >
                            <div className="flex items-center">
                                <div className={`mr-5 rounded-full w-[40px] h-[40px] flex items-center justify-center border ${habitIconTypes?.[habit.iconType]?.gradient}`}>
                                    <img src={habitIcons[habit.iconType]?.icon} alt="" className='w-[25px] h-[25px]' />
                                </div>
                                <div>
                                    <p className="font-semibold">{habit.habitName}</p>
                                    <p className='text-sm flex items-center'>{getStatus(logs[habit?.id]?.completePercentage)} {getStatus(logs[habit?.id]?.completePercentage) === "Completed" && <Image
                                        src={checked}
                                        alt="completed"
                                        className="w-4 mx-2"
                                    />}</p>
                                    <p className="text-xs text-grey">{formatTime(habit.time)}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CircularProgress
                                    size="lg"
                                    value={logs[habit.id]?.completePercentage}
                                    classNames={{
                                        svg: "drop-shadow-md",
                                        indicator: "stroke-primary",
                                        track: "accent",
                                        value: "text-xs font-semibold",
                                    }}
                                    // formatOptions={{ style: "unit", unit: "percentage" }}
                                    showValueLabel={true}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <CreateHabitLoader loader={loader} isOpen={isLoaderOpen} onClose={onLoaderClose} />

            {/* Modal for Updating Progress */}
            <>
                <Modal isOpen={isOpen}
                    classNames={{
                        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
                    }}
                    motionProps={{
                        variants: {
                            enter: {
                                y: 0,
                                opacity: 1,
                                transition: {
                                    duration: 0.3,
                                    ease: "easeOut",
                                },
                            },
                            exit: {
                                y: -20,
                                opacity: 0,
                                transition: {
                                    duration: 0.2,
                                    ease: "easeIn",
                                },
                            },
                        }
                    }}
                    onOpenChange={onClose}
                // closeButton
                >
                    <ModalContent>
                        <div className="p-6">

                            {/* Title */}
                            <div className='flex justify-center items-center mb-6'>
                                <h2 className="text-center text-lg font-semibold mr-2">Update Your Progress</h2>
                                {/* <img src={celebrate} alt="" className="w-10 bg-transparent border-3 border-red-500" /> */}
                            </div>

                            <div className={`m-auto rounded-full w-[40px] h-[40px] flex items-center justify-center border ${habitIconTypes[selectedHabit?.iconType]?.gradient}`}>
                                <img src={habitIcons[selectedHabit?.iconType]?.icon} alt="" className='w-[25px] h-[25px]' />
                            </div>
                            <p className="font-semibold text-center">{selectedHabit?.habitName}</p>


                            {/* Progress Slider */}
                            <div className="my-5">
                                <p className="text-left mb-2">Progress Status</p>
                                <div className="flex items-center justify-start space-x-4">

                                    <Slider
                                        value={progress}
                                        // showSteps={true}
                                        showTooltip={true}
                                        defaultValue={0}
                                        minValue={0}
                                        maxValue={100}
                                        classNames={{
                                            base: "max-w-md",
                                            labelWrapper: "mb-2",
                                            label: "font-medium text-default-700 text-medium",
                                            value: "font-medium text-default-500 text-small",
                                        }}
                                        renderThumb={({ index, ...props }) => (
                                            <div
                                                {...props}
                                            >
                                                <img src={getEmoji(progress)} alt="" />
                                            </div>
                                        )}
                                        onChange={(value) => setProgress(value)}
                                        step={1}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {/* Notes Section */}
                            <div className="mb-6">
                                <p className="text-left mb-2">Anything to Note ?</p>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={4}
                                    placeholder="Add your notes here..."
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>

                            {/* Update Button */}
                            <div className="flex justify-center">
                                <Button
                                    onClick={handleUpdateProgress}
                                    className="bg-button-gradient text-white px-6 py-2"
                                >
                                    Update
                                </Button>
                            </div>
                        </div>
                    </ModalContent>
                </Modal>
            </>
        </div>
    );
};

export default Daily;