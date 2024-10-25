import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem } from "@nextui-org/react";
import { Switch, cn, DatePicker, TimeInput, CheckboxGroup } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { MdDelete } from "react-icons/md";
import { CiClock2 } from "react-icons/ci";
import { CustomCheckbox } from "@/components/Home/CustomCheckbox";
import * as chrono from 'chrono-node';
import { GoGoal } from "react-icons/go";
import { getLocalTimeZone, today } from "@internationalized/date";
import { calculateCurrentAndNextScheduledDate, calculateNextScheduledDateForCustom } from "@/utils/schedulingFunctions";
import CreateHabitLoader from "@/components/Habits/CreateHabitLoader";
import { useNavigate } from "react-router-dom";
import { addHabit, parseFrequency, updateHabitDetails } from "@/utils/habitFunctions";
import HabitIconTypes from "./HabitIconTypes";

interface HabitFormProps {
    isOpen: boolean;
    onClose: Function;
    onOpenChange: Function;
    selectedHabit: Object;
    setSelectedHabit: Function
}

const HabitForm: React.FC<HabitFormProps> = ({ isOpen, onClose, onOpenChange, selectedHabit, setSelectedHabit }) => {

    const navigate = useNavigate();
    const { isOpen: isLoaderOpen, onOpen: onLoaderOpen, onClose: onLoaderClose } = useDisclosure();

    const categories = [{
        key: 1,
        label: "Health"
    }, {
        key: 2,
        label: "Productivity"
    }, {
        key: 3,
        label: "Personal Development"
    }, {
        key: 4,
        label: "Custom"
    }];

    const frequencyType = [{
        key: '1',
        label: "Daily"
    }, {
        key: '2',
        label: "Specific Days"
    }, {
        key: '3',
        label: "Custom"
    }];

    const [reminders, setReminders] = useState({
        isRequired: false,
        slots: []
    })

    const [habit, setHabit] = useState({
        habitName: "",
        isPaused: false,
        // category: "",
        // customCategory: "",
        frequencyType: "",
        specificFrequencyDays: [],
        customFrequency: "",
        customStartDay: "",
        // isReminderRequired: false,
        iconType: "",
        currentStreak: 0,
        bestStreak: 0,
        startDate: null,
        // goal: "",
        time: null,
        lastProgressUpdateDate: "",
        currentScheduledDate: "",
        nextScheduledDate: "",
        lastScheduledDate: "",
        frequencyValue: 0,
        customFrequencyType: "" //eg :- days , months
    });

    useEffect(() => {
        if (Object.keys(selectedHabit).length > 0) {
            let freqType = selectedHabit.frequencyType === "Daily" ? '1' : selectedHabit.frequencyType === "Specific Days" ? '2' : '3'
            setHabit((prev: any) => ({ ...prev, ...selectedHabit, frequencyType: freqType }));
        }
    }, [])

    // console.log(habit)


    const placeholders = ["every 3 days starting next monday", "every week starting today", "every 4 hours starting today 2pm"];
    const [fadeState, setFadeState] = useState('fade-in');
    const [customFreqPlaceholder, setCustomfreqPlaceholder] = useState(placeholders[0]);
    const [frequencyFormatError, setFrequencyFormatError] = useState("");
    const [showTooltip, setShowTooltip] = useState(false);
    const [errors, setErrors] = useState({
        habitName: "",
        // category: "",
        // customCategory: "",
        frequencyType: "",
        specificFrequencyDays: "",
        customFrequency: "",
        iconType: "",
        // startDate: "",
        // goal: "",
        time: "",
        currentScheduledDate: "",
        nextScheduledDate: "",
        frequencyValue: "",
        // isReminderRequired: ""
    })
    const [loader, setLoader] = useState("");

    useEffect(() => {
        if (habit.frequencyType == frequencyType.length) {
            const interval = setInterval(() => {
                setFadeState('fade-out');

                setTimeout(() => {
                    // Update the placeholder value after fade out
                    setCustomfreqPlaceholder((prevPlaceholder) => {
                        const currentIndex = placeholders.indexOf(prevPlaceholder);
                        const nextIndex = (currentIndex + 1) % placeholders.length;
                        return placeholders[nextIndex];
                    });
                    setFadeState('fade-in');
                }, 500); // Match the fade-out duration
            }, 4000); // Change placeholder every 4 seconds

            return () => clearInterval(interval);
        }

    }, [habit.frequencyType]);


    const updateHabit = (e: any) => {
        setHabit((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    const updateSpecificDays = (e: any) => {
        setHabit((prev) => {
            return {
                ...prev,
                specificFrequencyDays: e
            }
        })
    }

    const updateCustomFrequency = (e: any) => {
        setHabit((prev) => {
            return {
                ...prev,
                customFrequency: e.target.value
            }
        })
    }

    const createHabit = async () => {
        if (!validateForm()) return;
        setShowTooltip(false)
        onLoaderOpen();
        setLoader("loading");
        const updatedHabitObj = formatForm();
        // console.log(updatedHabitObj, 'hereee')
        setTimeout(async () => {
            try {
                await addHabit(updatedHabitObj);
                setLoader("done")
                await delayDone()
                // navigate("/daily")
            } catch (err) {
                await delayDone()
                setLoader("error")
            }
        }, 1000)
    }

    const updateHabitDetail = async () => {
        if (!validateForm()) return;
        setShowTooltip(false)
        onLoaderOpen();
        setLoader("loading");
        const updatedHabitObj = formatForm();
        // console.log(updatedHabitObj, 'hereee')
        setTimeout(async () => {
            try {
                await updateHabitDetails(updatedHabitObj?.id, updatedHabitObj);
                setLoader("done")
                await delayDone()
                // navigate("/daily")
            } catch (err) {
                await delayDone()
                setLoader("error")
            }
        }, 500)
    }

    const resetHabit = () => {
        setHabit((prev) => ({
            ...prev,
            habitName: "",
            isPaused: false,
            frequencyType: "",
            specificFrequencyDays: [],
            customFrequency: "",
            customStartDay: "",
            iconType: "",
            currentStreak: 0,
            bestStreak: 0,
            startDate: null,
            time: null,
            lastProgressUpdateDate: "",
            currentScheduledDate: "",
            nextScheduledDate: "",
            lastScheduledDate: "",
            frequencyValue: 0,
            customFrequencyType: ""
        }))
    }

    const delayDone = async () => {
        setTimeout(() => {
            onClose();
            onLoaderClose();
            setSelectedHabit({});
            resetHabit();
        }, 2000)
    }

    const validateForm = () => {
        let errorFlag = false;
        let updateErrorObj = { ...errors }
        Object.keys(habit).forEach((key) => {
            if (key != "goal" && !habit[key] || habit[key].length === 0) {
                let errorMessage = "";
                if (["habitName", "category", "frequencyType", "time", "iconType"].includes(key)) {
                    errorFlag = true;
                    errorMessage = `Field can't be empty`;
                } else if (key === "specificFrequencyDays" && habit.frequencyType === "2" && habit[key].length === 0) {
                    errorFlag = true;
                    errorMessage = "At least 1 option has to be picked";
                } else if ((key === "customCategory" && habit.category == categories.length) || (key === "customFrequency" && habit.frequencyType == frequencyType.length)) {
                    errorFlag = true;
                    errorMessage = `Field can't be empty`;
                }
                // console.log(errorMessage, key)
                updateErrorObj[key] = errorMessage;
            } else {
                updateErrorObj[key] = ""
            }
        })

        if (habit.frequencyType == frequencyType.length) {
            let res = parseFrequency(habit.customFrequency);
            if (res?.error) { errorFlag = true; setFrequencyFormatError(res.error) }
            else setFrequencyFormatError("");
        }

        // console.log(errorFlag)

        setErrors(updateErrorObj);
        return !errorFlag
    }

    const formatForm = () => {

        let updateHabitObj = { ...habit };
        // updateHabitObj.category = categories[Number(updateHabitObj.category) - 1]?.label;
        updateHabitObj.frequencyType = frequencyType[Number(updateHabitObj.frequencyType) - 1]?.label;
        updateHabitObj.specificFrequencyDays = habit.specificFrequencyDays.sort((a, b) => a - b);

        if (updateHabitObj.frequencyType === "Custom") {
            let res = parseFrequency(updateHabitObj?.customFrequency);
            if (res.error) setFrequencyFormatError(res.error)
            let { value, type, startDay } = res;
            updateHabitObj.frequencyValue = value;
            updateHabitObj.customFrequencyType = type;
            updateHabitObj.customStartDay = startDay;
            let { currentlyScheduledFor, nextScheduledFor } = calculateNextScheduledDateForCustom({ value, type, startDay }, new Date(startDay));
            updateHabitObj.currentScheduledDate = currentlyScheduledFor;
            updateHabitObj.nextScheduledDate = nextScheduledFor;
            updateHabitObj.startDate = currentlyScheduledFor;
        } else {
            let { currentlyScheduledFor, nextScheduledFor } = calculateCurrentAndNextScheduledDate(updateHabitObj.frequencyType, updateHabitObj);
            updateHabitObj.currentScheduledDate = currentlyScheduledFor;
            updateHabitObj.nextScheduledDate = nextScheduledFor;
            updateHabitObj.startDate = currentlyScheduledFor;
        }

        // let { day, month, year } = updateHabitObj.startDate
        // updateHabitObj.startDate = new Date(day, month, year);

        // console.log(updateHabitObj.time)
        // let { hour, minute, second, millisecond } = updateHabitObj.time;
        // updateHabitObj.time = { hour, minute, second, millisecond };
        return updateHabitObj;
    }

    // console.log(selectedHabit)

    return (
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
                onOpenChange={(open) => {
                    onClose()
                    setSelectedHabit({})
                }}
                scrollBehavior="inside"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">{Object.keys(selectedHabit).length > 0 ? "Update the Habit Details" : "Create a New Habit"}</ModalHeader>
                    <ModalBody>
                        <Input
                            autoComplete="off"
                            label="Habit Name"
                            placeholder="Read 10 pages daily"
                            variant="bordered"
                            value={habit.habitName}
                            name="habitName"
                            onChange={(e) => updateHabit(e)}
                            isRequired={true}
                            isInvalid={errors.habitName ? true : false}
                            color={errors.habitName ? "danger" : "default"}
                            errorMessage={errors.habitName}
                        />


                        {/* <Select
                            label="Category"
                            variant="bordered"
                            selectedKeys={[habit.category]}
                            name="category"
                            onChange={updateHabit}
                            isRequired={true}
                            isInvalid={errors.category ? true : false}
                            color={errors.category ? "danger" : "default"}
                            errorMessage={errors.category}
                        >
                            {categories.map((category) => (
                                <SelectItem key={category.key} value={category.label}>
                                    {category.label}
                                </SelectItem>
                            ))}
                        </Select>


                        {
                            habit.category == categories.length
                            &&
                            <Input
                                autoFocus
                                label="Custom Category Name"
                                placeholder="Hobbies"
                                variant="bordered"
                                value={habit.customCategory}
                                name="customCategory"
                                onChange={(e) => updateHabit(e)}
                                isRequired={true}
                                isInvalid={errors.customCategory ? true : false}
                                color={errors.customCategory ? "danger" : "default"}
                                errorMessage={errors.customCategory}
                            />
                        } */}

                        <Select
                            label="Frequency Type"
                            variant="bordered"
                            name="frequencyType"
                            // value={habit.frequencyType}
                            selectedKeys={habit.frequencyType}
                            onChange={updateHabit}
                            isRequired={true}
                            isInvalid={errors.frequencyType ? true : false}
                            color={errors.frequencyType ? "danger" : "default"}
                            errorMessage={errors.frequencyType}
                        >
                            {frequencyType.map((frequency) => (
                                <SelectItem key={frequency.key}>
                                    {frequency.label}
                                </SelectItem>
                            ))}
                        </Select>

                        {
                            habit.frequencyType == 2
                            &&
                            <CheckboxGroup
                                className="gap-1"
                                label="Select Days"
                                orientation="horizontal"
                                value={habit.specificFrequencyDays}
                                onChange={updateSpecificDays}
                                isRequired={true}
                                isInvalid={errors.specificFrequencyDays ? true : false}
                                color={errors.specificFrequencyDays ? "danger" : "default"}
                                errorMessage={errors.specificFrequencyDays}
                            >
                                <CustomCheckbox value={0}>Sunday</CustomCheckbox>
                                <CustomCheckbox value={1}>Monday</CustomCheckbox>
                                <CustomCheckbox value={2}>Tuesday</CustomCheckbox>
                                <CustomCheckbox value={3}>Wednesday</CustomCheckbox>
                                <CustomCheckbox value={4}>Thursday</CustomCheckbox>
                                <CustomCheckbox value={5}>Friday</CustomCheckbox>
                                <CustomCheckbox value={6}>Saturday</CustomCheckbox>
                            </CheckboxGroup>
                        }

                        {
                            habit.frequencyType == frequencyType.length
                            &&
                            <Input
                                autoComplete="off"
                                label="Custom frequency"
                                startContent={
                                    habit.customFrequency === ""
                                    &&
                                    <div
                                        className={`absolute left-5 top-6 text-gray-400 pointer-events-none transition-all duration-500 ${fadeState === 'fade-in' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                                            } text-[13px]`}
                                    >{customFreqPlaceholder}</div>
                                }
                                variant="bordered"
                                value={habit.customFrequency}
                                name="customFrequency"
                                onChange={updateCustomFrequency}
                                isRequired={true}
                                isInvalid={errors.customFrequency || frequencyFormatError ? true : false}
                                color={errors.customFrequency || frequencyFormatError ? "danger" : "default"}
                                errorMessage={errors.customFrequency || frequencyFormatError}
                            >
                            </Input>
                        }

                        {/* <DatePicker
                            label="Start Tracking From"
                            name="startDate"
                            value={habit.startDate}
                            onChange={(e) => {
                                // console.log(new Date(e.day, e.month, e.year))
                                setHabit((prev: any) => {
                                    return {
                                        ...prev,
                                        startDate: e
                                    }
                                })
                            }}
                            minValue={today(getLocalTimeZone())}
                            isRequired={true}
                            isInvalid={errors.startDate ? true : false}
                            color={errors.startDate ? "danger" : "default"}
                            errorMessage={errors.startDate}
                        /> */}

                        {/* <Input
                            autoFocus
                            label="Goal"
                            startContent={<GoGoal className="text-gray-500 text-[17px]" />}
                            placeholder="Read 30 books in a year"
                            variant="bordered"
                            name="goal"
                            value={habit?.goal}
                            onChange={updateHabit}
                        /> */}

                        <TimeInput label="Time"
                            startContent={
                                <CiClock2 className="text-gray-500 text-[20px]" />
                            }
                            name="time"
                            value={habit?.time}
                            onChange={(e) => {
                                setHabit((prev: any) => {
                                    return { ...prev, time: e }
                                })
                            }}
                            isRequired={true}
                            isInvalid={errors.time ? true : false}
                            color={errors.time ? "danger" : "default"}
                            errorMessage={errors.time}
                        />

                        {/* <Switch size="sm"
                            classNames={{
                                wrapper: cn(
                                    "group-data-[selected=true]:bg-button-gradient"
                                ),
                            }}
                            isSelected={habit.isReminderRequired}
                            name="isReminderRequired"
                            onChange={(e) => {
                                setHabit((prev) => {
                                    return {
                                        ...prev,
                                        isReminderRequired: e.target.checked
                                    }
                                })
                            }}
                        >
                            Want Reminder For Habit?
                        </Switch> */}

                        <div>
                            <p className="text-semibold">Choose Icon<span className="text-danger">*</span></p>
                            {errors.iconType && <span className="text-danger text-left text-sm">{errors.iconType}</span>}
                            <HabitIconTypes habit={habit} setHabit={setHabit} showTooltip={showTooltip} setShowTooltip={setShowTooltip} />
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button className="bg-button-gradient text-white border-none" onPress={Object.keys(selectedHabit).length > 0 ? updateHabitDetail : createHabit}>
                            {Object.keys(selectedHabit).length > 0 ? "Update" : "Create"}
                        </Button>
                    </ModalFooter>

                </ModalContent>
            </Modal >

            <CreateHabitLoader loader={loader} isOpen={isLoaderOpen} onClose={onLoaderClose} />
        </>
    );
}
export default HabitForm;