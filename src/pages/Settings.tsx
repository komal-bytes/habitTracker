import React, { useState, useEffect } from 'react';
// import { FiSun, FaMoon, FaRegEdit, SaveIcon, HeartIcon } from 'react-icons';
import { userIcons } from '@/utils/icons';
import { Button, Input } from '@nextui-org/react';
import { TimeInput } from "@nextui-org/date-input";
import { FiSun } from "react-icons/fi";
import { FaMoon } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
// import { useTheme } from "@/hooks/use-theme";
import { ThemeSwitch } from '@/components/common/theme-switch';
import { formatTime, parseTime } from '@/utils/habitFunctions';
import { useOutletContext } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { MoonFilledIcon, SunFilledIcon } from '@/components/common/icons';

const Settings: React.FC = () => {

    const { theme, setTheme } = useTheme();
    const { userInfo, setUserInfo } = useOutletContext();

    // const { theme, toggleTheme } = useTheme(userInfo?.theme || "light");
    const [profile, setProfile] = useState<string | null>(userInfo?.avatar);
    const [showIcons, setShowIcons] = useState(false);
    const [name, setName] = useState<string | null>(userInfo?.name);
    const [isEditingName, setIsEditingName] = useState(false);
    const [reminderTime, setReminderTime] = useState<Object>(parseTime(userInfo?.progressReminderTime));
    const [isEditingTime, setIsEditingTime] = useState(false);

    const handleProfileChange = (icon: string) => {
        let imageName = icon.split("/")[2].split('.')[0];
        imageName = convertToCamelCase(imageName);
        setProfile(imageName);
        updateUserInfoInStorage("avatar", imageName)
        setShowIcons(false);
    };

    function convertToCamelCase(str) {
        return str
            .split('-')
            .map((word, index) => {
                if (index === 0) {
                    return word;
                }
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join('');
    }

    const updateUserInfoInStorage = (name, value) => {

        let info = {
            ...userInfo,
            [name]: name === "progressReminderTime" ? formatTime(value) : value
        }

        localStorage.setItem("userInfo", JSON.stringify(info));
        setUserInfo(info)
    }

    const handleNameSave = () => {
        updateUserInfoInStorage("name", name)
        setIsEditingName(false);
    };

    const handleThemeToggle = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    const handleTimeSave = () => {
        updateUserInfoInStorage("progressReminderTime", reminderTime)
        setIsEditingTime(false);
    };


    return (
        <div className="relative flex flex-col items-center justify-between p-4 h-full">

            <div>
                {/* Profile Picture */}
                <div className="relative flex flex-col justify-center items-center">
                    <img
                        src={userIcons[profile] || userIcons.user}
                        alt="Profile"
                        className="rounded-full w-[200px] h-[200px]"
                    />
                    {showIcons ? (
                        <div className="flex flex-wrap items-center space-x-2 mt-2 border-2 border-gray-200 p-4 rounded-lg">
                            {Object.values(userIcons).map((icon, idx) => {
                                console.log(icon)
                                return < img
                                    key={idx}
                                    src={icon}
                                    alt={`icon-${idx}`
                                    }
                                    className={`${icon === "/icons/user.png" ? 'w-[53px] h-[53px]' : "w-[57px] h-[57px]"} cursor-pointer`}
                                    onClick={() => handleProfileChange(icon)}
                                />
                            })}
                        </div>
                    ) : (
                        <Button
                            className="mt-4 bg-button-gradient text-white"
                            onClick={() => setShowIcons(true)}
                        >
                            Change
                        </Button>
                    )}
                </div>

                <div className='w-full p-4'>
                    {/* Name Section */}
                    <div className="flex items-center space-x-4 mt-4">
                        {isEditingName ? (
                            <Input
                                value={name || ''}
                                onChange={(e) => setName(e.target.value)}
                                className="px-2 py-1"
                            />
                        ) : (
                            <p>{name || 'Set a name'}</p>
                        )}
                        {isEditingName ? (
                            <Button
                                className="mt-2 bg-button-gradient text-white"
                                onClick={handleNameSave}
                            >
                                Save
                            </Button>
                            // <SaveIcon className="cursor-pointer" onClick={handleNameSave} />
                        ) : (
                            <FaRegEdit className="cursor-pointer text-xl" onClick={() => setIsEditingName(true)} />
                        )}
                    </div>

                    {/* Theme Toggle */}
                    <div className="flex items-center mt-4 space-x-4">
                        <p>Change Theme to {theme === "dark" ? 'light' : 'dark'}</p>
                        {/* {isDark ? (
                    <FiSun className="cursor-pointer" onClick={handleThemeToggle} />
                ) : (
                    <FaMoon className="cursor-pointer" onClick={handleThemeToggle} />
                )} */}
                        {/* <ThemeSwitch theme={theme} toggleTheme={toggleTheme} setUserInfo={setUserInfo} /> */}

                        {theme === "light" ? (
                            <MoonFilledIcon className='cursor-pointer' size={22} onClick={() => setTheme('dark')} />
                        ) : (
                            <SunFilledIcon className='cursor-pointer' size={22} onClick={() => setTheme('light')} />
                        )}

                    </div>

                    {/* Progress Update Reminder Time */}
                    <div className="flex items-center mt-4 space-x-4">
                        {isEditingTime ? (
                            <TimeInput value={reminderTime} onChange={setReminderTime} />
                        ) : (
                            <p>Progress Update Reminder Time: {formatTime(reminderTime)}</p>
                        )}
                        {isEditingTime ? (
                            <Button
                                className="mt-2 bg-button-gradient text-whitef"
                                onClick={handleTimeSave}
                            >
                                Save
                            </Button>
                            // <SaveIcon className="cursor-pointer" onClick={() => handleTimeSave(reminderTime)} />
                        ) : (
                            <FaRegEdit className="cursor-pointer text-xl" onClick={() => setIsEditingTime(true)} />
                        )}
                    </div>
                </div>

            </div>

            {/* Footer */}
            <div className="text-center">
                <p className="text-sm">Built with ❤️ by <span className="text-secondary">Komal Tolambia</span></p>
            </div>
        </div>
    );
};

export default Settings;
