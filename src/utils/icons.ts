import { timeManagement } from '/icons/wall-clock.png';
import book from "/icons/book.png";
import dumbell from "/icons/dumbell.png";
import health from "/icons/cardiogram.png";
import task from "/icons/checklist.png";
import time from "/icons/time-management.png";
import water from "/icons/water.png";
import meditate from "/icons/exercise.png";
import food from "/icons/salad.png";
import leaf from "/icons/leaf.png";
import artistic from "/icons/inspiration.png";

// const habitIcons = [
//     { icon: artistic, color: "#FF6F61" },
//     { icons: meditate, color: "#DA6A16" },
//     { icon: food, color: "#FFA500" },
//     { icon: water, color: "#007BFF" },
//     { icon: time, color: "#FFAD00" },
//     { icon: task, color: "#003366" },
//     { icon: health, color: "#F50E0E" },
//     { icon: dumbell, color: "#000" },
//     { icon: leaf, color: "#4CAF50" },
//     { icon: book, color: "#800020" }
// ]

export const habitIconTypes = {
    artistic: {
        icon: artistic,
        gradient: "bg-gradient-to-br from-[#FFB0A1] via-[#FFD2C4] to-[#FFE5DA]", // Even lighter shades of #FF6F61
        name: "Artistic"
    },
    meditation: {
        icon: meditate,
        gradient: "bg-gradient-to-br from-[#ECA676] via-[#F3C1A1] to-[#F9D9C5]", // Even lighter shades of #DA6A16
        name: "Meditation"
    },
    diet: {
        icon: food,
        gradient: "bg-gradient-to-br from-[#FFDA7A] via-[#FFE7A2] to-[#FFF3CC]", // Even lighter shades of #FFA500
        name: "Diet"
    },
    hydration: {
        icon: water,
        gradient: "bg-gradient-to-br from-[#7FCFFF] via-[#A9E2FF] to-[#D1F1FF]",// Even lighter shades of #007BFF
        name: "Fluids"
    },
    timeManagement: {
        icon: time,
        gradient: "bg-gradient-to-br from-[#FFE07F] via-[#FFEBA2] to-[#FFF5CC]", // Even lighter shades of #FFAD00
        name: "Time Management"
    },
    taskManagement: {
        icon: task,
        gradient: "bg-gradient-to-br from-[#668BB3] via-[#87A4C5] to-[#B0C3DB]",// Even lighter shades of #003366
        name: "Tasks Management"
    },
    health: {
        icon: health,
        gradient: "bg-gradient-to-br from-[#FF9A9A] via-[#FFB8B8] to-[#FFD3D3]",// Even lighter shades of #F50E0E
        name: "Health"
    },
    fitness: {
        icon: dumbell,
        gradient: "bg-gradient-to-br from-[#666666] via-[#8C8C8C] to-[#B2B2B2]",// Even lighter shades of #000000
        name: "Fitness"
    },
    lifestyle: {
        icon: leaf,
        gradient: "bg-gradient-to-br from-[#8FE7A8] via-[#A7F0BD] to-[#CFF8DC]", // Even lighter shades of #4CAF50
        name: "Lifestyle"
    },
    productivity: {
        icon: book,
        gradient: "bg-gradient-to-br from-[#B87575] via-[#D09A9A] to-[#EBC2C2]",// Even lighter shades of #800020
        name: "Productivity"
    }
};



import user from "/icons/user.jpg";
import oldMan from "/icons/old-man.png";
import boy from "/icons/boy.png";
import man from "/icons/man.png";
import beardMan from "/icons/beard-man.png";
import desiWoman from "/icons/desi-woman.png";
import modernWoman from "/icons/modern-woman.png";
import woman from "/icons/woman.png";
import girl from "/icons/girl.png";


export const userIcons = { user, oldMan, boy, beardMan, man, girl, desiWoman, woman, modernWoman };