// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import health from "/icons/heart-attack.png";
// import timeManagement from "/icons/wall-clock.png";
// import skills from "/icons/manual.png";
// import growth from "/icons/growth-mindset.png";
// import mindfulness from "/icons/yoga.png";

// const CircularLottieAnimation = () => {
//     const images = [health, timeManagement, mindfulness, skills, growth];

//     // Number of animations
//     const numAnimations = 5;
//     // Radius of the circular path
//     const radius = 100;
//     // Animation rotation speed
//     const rotationSpeed = 0.04;

//     // State to track the current rotation angle
//     const [angle, setAngle] = useState(0);

//     // Update the angle for rotation
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setAngle(prevAngle => prevAngle + rotationSpeed);
//         }, 100);

//         return () => clearInterval(interval);
//     }, []);


//     return (
//         <div className="flex items-center justify-center w-[100vw] h-[75vh]">
//             <div className="relative w-[100%] h-[100%]">
//                 {
//                     images.map((image, index) => {
//                         const currentAngle = angle + (index * (2 * Math.PI / numAnimations)); // Calculate angle for each animation
//                         const x = radius * Math.cos(currentAngle); // Calculate x position
//                         const y = radius * Math.sin(currentAngle); // Calculate y position

//                         return (
//                             <motion.div
//                                 key={index}
//                                 className="absolute top-[45%] left-[40%]"
//                                 style={{
//                                     transform: `translate(${x}px, ${y}px)`,
//                                 }}
//                                 // initial={{ rotateY: 0 }}
//                                 // animate={{ rotateY: 180 }}
//                                 transition={{ duration: 0.6, ease: "easeInOut" }}
//                             >
//                                 {
//                                     typeof (image) === "string"
//                                         ?
//                                         <img src={image} alt="" className="w-[20%] min-w-[80px] h-[20%] min-h-[80px]" />
//                                         :
//                                         image
//                                 }
//                             </motion.div>
//                         );
//                     })
//                 }
//             </div>
//         </div>
//     );
// };

// export default CircularLottieAnimation;

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import health from "/icons/heart-attack.png";
import timeManagement from "/icons/wall-clock.png";
import skills from "/icons/manual.png";
import growth from "/icons/growth-mindset.png";
import mindfulness from "/icons/yoga.png";

const CircularLottieAnimation = () => {
    const images = [health, timeManagement, mindfulness, skills, growth];

    // Function to generate random starting positions
    const getRandomPosition = () => {
        const x = Math.random() * (window.innerWidth - 100); // Adjust for image width
        const y = Math.random() * (window.innerHeight - 100); // Adjust for image height
        const dir = getRandomDirection();
        return { x, y, vx: dir.x, vy: dir.y };
    };

    const [positions, setPositions] = useState([]);


    // Function to generate random directions with very low speed
    const getRandomDirection = () => {
        return {
            x: (Math.random() - 0.5) * 3, // Decreased speed for slower movement
            y: (Math.random() - 0.5) * 3, // Decreased speed for slower movement
        };
    };

    const newPositions = (pos) => {

        // Generate a new random direction
        const direction = getRandomDirection();
        let newX = pos.x + pos.vx //direction.x;
        let newY = pos.y + pos.vy//direction.y;

        // Check for boundaries and reverse direction if needed
        if (newX > window.innerWidth - 100 || newX < 0) {
            pos.vx *= -1; // Reverse direction on x-axis
            newX = pos.x + pos.vx//direction.x; // Update position after reversing
        }
        if (newY > window.innerHeight - 100 || newY < 0) {
            pos.vy *= -1; // Reverse direction on y-axis
            newY = pos.y + pos.vy//direction.y; // Update position after reversing
        }

        // console.log(newX, newY);
        pos.vx += direction.x * 0.5;
        pos.vy += direction.y * 0.5;

        return { x: newX, y: newY, vx: pos.vx, vy: pos.vy };
    }

    // const normalize = (pos) => {
    //     const mag = Math.sqrt(pos.vx ** 2 + pos.vy ** 2);
    //     pos.vx *= 5 / mag;
    //     pos.vy *= 5 / mag;
    // }
    // const newPositions = (pos) => {
    //     // Generate a new random direction
    //     const direction = getRandomDirection();
    //     pos.vx += direction.x * 0.5;
    //     pos.vy += direction.y * 0.5;
    //     normalize(pos);

    //     let newX = pos.x + pos.vx;
    //     let newY = pos.y + pos.vy;
    //     // Check for boundaries and reverse direction if needed
    //     if (newX > window.innerWidth - 200 || newX < 100) {
    //         pos.vx *= -1; // Reverse direction on x-axis
    //         newX = pos.x + pos.vx; // Update position after reversing
    //     }
    //     if (newY > window.innerHeight - 200 || newY < 100) {
    //         pos.vy *= -1; // Reverse direction on y-axis
    //         newY = pos.y + pos.vy; // Update position after reversing
    //     }



    //     // console.log(newX, newY);

    //     return { x: newX, y: newY, vx: pos.vx, vy: pos.vy };
    // }

    useEffect(() => {

        const initailPositions = images.map(getRandomPosition);
        setPositions(initailPositions);

        const interval = setInterval(() => {
            setPositions((prev: any) => {
                return prev.map((pos) => newPositions(pos));
            })
        }, 200);

        return () => clearInterval(interval);

    }, [])

    // console.log(positions)

    return (
        <div className="flex items-center justify-center w-[100vw] h-[75vh] border border-red-500">
            <div className="relative w-full h-full">
                {
                    positions.map((pos, index) => {
                        // console.log(positions[index]?.x, positions[index]?.y)
                        const x = pos?.x;
                        const y = pos?.y;
                        // console.log(x, y);
                        return <motion.div
                            key={index}
                            className="absolute"
                            style={{
                                transform: `translate(${x}px, ${y}px)`,
                                transition: "transform 0.2s ease-in-out",
                            }}
                        // transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                            <img src={images[index]} alt="" className="w-[20%] min-w-[80px] h-[20%] min-h-[80px] opacity-50" />
                        </motion.div>
                    })
                }
            </div>
        </div >
    );
};

export default CircularLottieAnimation;
