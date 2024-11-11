import React, { useEffect, useRef } from 'react';

interface ReminderPopupProps {
    isVisible: boolean;
    onClose: () => void;
}

const ReminderPopup: React.FC<ReminderPopupProps> = ({ isVisible, onClose }) => {

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const soundBuffer = useRef<AudioBuffer | null>(null);
    const sourceNode = useRef<AudioBufferSourceNode | null>(null);

    const loadSound = async () => {
        const response = await fetch('/sounds/sound1.mp3'); // Ensure this path is correct
        const arrayBuffer = await response.arrayBuffer();
        soundBuffer.current = await audioContext.decodeAudioData(arrayBuffer);
    };

    const playSound = () => {
        if (soundBuffer.current) {
            sourceNode.current = audioContext.createBufferSource();
            sourceNode.current.buffer = soundBuffer.current;
            sourceNode.current.loop = true; // Loop the sound
            sourceNode.current.connect(audioContext.destination);
            sourceNode.current.start(0);
        }
    };

    const stopSound = () => {
        if (sourceNode.current) {
            sourceNode.current.stop();
            sourceNode.current.disconnect();
            sourceNode.current = null;
        }
    };

    useEffect(() => {
        loadSound();

        if (isVisible) {
            playSound();
        } else {
            stopSound();
        }

        return () => stopSound(); // Clean up on unmount
    }, [isVisible]);

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <span className="close cursor-pointer text-gray-500" onClick={onClose}>&times;</span>
                <p className="text-lg">Update your progress today and maintain the streak!</p>
                <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                        window.location.href = '/settings#update-timer'; // Redirects to the specified URL
                    }}
                >
                    Update Now
                </button>
            </div>
        </div>
    );
};

export default ReminderPopup;