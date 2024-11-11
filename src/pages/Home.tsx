import React from 'react';
import { Link } from "@nextui-org/link";
import balanceLife from '@/utils/animations/balanceLife.json';
import Lottie from 'react-lottie-player'

const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-between h-screen bg-white">
            {/* Header */}
            <div className="flex justify-between w-full p-5">
                <div className="flex items-center">
                    <h1 className="text-3xl font-bold select-none text-black">
                        Habit<span className="text-primary">o</span>
                    </h1>
                </div>
            </div>

            {/* Center Animation */}
            <div className="flex flex-col items-center">
                <Lottie
                    loop
                    animationData={balanceLife}
                    play
                    style={{ width: 250, height: 250 }}
                />
                <h2 className="w-[80%] text-[35px] font-semibold text-center text-black">
                    Balance your life today
                </h2>
            </div>

            {/* Bottom Button */}
            <div className="mb-[10vh] rounded-full shadow-custom-blue">
                <Link href="/daily">
                    <a className="flex items-center justify-center w-[100px] h-16 text-white bg-button-gradient rounded-full transition duration-300 ease-in-out">
                        <span className="text-[30px]">&raquo;</span>
                    </a>
                </Link>
            </div>
        </div>
    );
};

export default Home;
