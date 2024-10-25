import { useEffect, useState } from 'react';
import { habitIconTypes } from "@/utils/icons"
import { Modal, Select, Tabs, Tab, SelectItem } from '@nextui-org/react';
import analysis from "/icons/analysis.png";
import { getAllHabits, getLogsByHabitId } from '@/utils/habitFunctions';
import Calendar from '@/components/Progress/Calendar';
import Graph from '@/components/Progress/Graph';

const Progress = () => {
    const [habitsList, setHabitsList] = useState([]);
    const [selectedHabit, setSelectedHabit] = useState(null);
    const [selectedTab, setSelectedTab] = useState("");
    const [habitLog, setHabitLog] = useState({});

    useEffect(() => {
        (async () => {
            let habits = await getAllHabits();
            habits.forEach((habit, index) => {
                habit.key = index + 1;
            })
            console.log(habits)
            setHabitsList(habits);
        })()
    }, [])

    const getLogsForSelectedHabit = async (habitId: number) => {
        try {
            let logs = await getLogsByHabitId(habitId);
            console.log(logs)
            setHabitLog(logs);
        } catch (err) {

        }
    }

    const handleShareOnWhatsApp = async () => {
        if (navigator.canShare && progressRef.current) {
            try {
                // Capture screenshot as a data URL
                const dataUrl = await toPng(progressRef.current, { backgroundColor: '#ffffff' });

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

    return (
        <div className="h-auto p-2">
            {/* Dropdown to Select Habit */}
            <div className="mb-6 w-full md:w-1/2 lg:w-1/4">

                <Select
                    label="Select a Habit"
                    variant="bordered"
                    name="habitName"
                    aria-label="habitName"
                    // className='w-[80%]'
                    // selectedKeys={[selectedHabit?.key]}
                    value={selectedHabit?.key}
                    onChange={(e) => {
                        console.log(e)
                        const habit = habitsList.find((habit) => habit?.id == e.target.value);
                        setSelectedHabit(habit || null);
                        getLogsForSelectedHabit(habit?.id)
                    }}
                >
                    {habitsList.map((habit) => (
                        <SelectItem key={habit?.id}>
                            {habit?.habitName}
                        </SelectItem>
                    ))}
                </Select>
            </div>

            {/* If no habit is selected, show Lottie animation */}
            {!selectedHabit ? (
                <div className="w-60 h-52 m-auto">
                    <img src={analysis} alt="" className='w-[85%]' />
                    <p className='text-danger text-2xl'>Check Your Progress</p>
                </div>
            ) : (
                <div className="border flex-col items-center justify-center py-4 rounded-lg w-full md:w-2/3 lg:w-2/5 m-auto text-center">
                    {/* Habit Icon */}
                    <div className={`m-auto mb-2 border-4 border-neutral-300 rounded-full w-[180px] h-[180px] flex items-center justify-center border ${habitIconTypes[selectedHabit?.iconType]?.gradient}`}>
                        <img
                            src={habitIconTypes[selectedHabit?.iconType]?.icon}
                            alt={selectedHabit?.habitName}
                            className="w-[110px] h-[110px] mx-auto"
                        />
                    </div>

                    {/* Habit Name */}
                    <h2 className="text-2xl font-semibold ">{selectedHabit?.habitName}</h2>

                    {/* Frequency Type */}
                    <p className='text-gray-500 mb-4 textcenter'>{selectedHabit?.frequencyType === "Custom" ? selectedHabit?.customFrequency : selectedHabit.frequencyType}</p>

                    {/* Streak Information */}
                    <div className="flex justify-around border border-gray-300 rounded-lg w-[90%] m-auto p-4 mb-4">
                        <div>
                            <p className="text-secondary text-lg font-semibold">{selectedHabit.currentStreak} {selectedHabit.currentStreak == 1 ? "day" : "days"}</p>
                            <p className="text-gray-400">Current streak</p>
                        </div>
                        <div className='h-[50px] w-[1px] bg-gray-300'></div>
                        <div>
                            <p className="text-secondary text-lg font-semibold">{selectedHabit.bestStreak} {selectedHabit.bestStreak == 1 ? "day" : "days"}</p>
                            <p className="text-gray-400">Best streak</p>
                        </div>
                    </div>

                    {/* Tabs for Calendar and Graph View */}
                    <Tabs
                        aria-label="Options"
                        selectedKey={selectedTab}
                        onSelectionChange={setSelectedTab}
                        className='w-[90%]'
                        classNames={{
                            tabList: "gap-6 w-full bg-gray-300",
                            // cursor: "w-full bg-[#22d3ee]",
                            // tab: "w-2/3 border border-red-500",
                            tabContent: "group-data-[selected=true]:text-gray-400 text-center"
                        }}
                    >
                        <Tab key="Calender View" title="Calender View" className='relative'>
                            <Calendar habitLog={habitLog} />
                        </Tab>
                        <Tab key="Graph View" title="Graph View" className='relative'>
                            <Graph selectedHabit={selectedHabit} />
                        </Tab>
                    </Tabs>
                </div>
            )}
        </div>
    );
};

export default Progress;
