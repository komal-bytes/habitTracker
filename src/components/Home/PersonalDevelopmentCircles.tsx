import { Card, CardBody } from "@nextui-org/react"

const aspects = [
    { id: "health", name: "Health", color: "bg-red-500" },
    { id: "skills", name: "Skills", color: "bg-blue-500" },
    {
        id: "growth", name: "Growth", color: "bg-green-500"
    },
    { id: "timeManagement", name: "Time Management", color: "bg-yellow-300" },
    { id: "mindfulness", name: "Mindfulness", color: "bg-orange-500" },
]

const shapes = aspects?.map((aspect) => {
    return <Card key={aspect.name} className="w-[20%] min-w-[80px] h-[20%] min-h-[80px] bg-transparent shadow-none">
        <CardBody className={`flex items-center justify-center ${aspect.color} rounded-full shadow-lg`}>
            <p className={`text-white text-center font-caveat ${aspect.name === "Time Management" ? "text-[12px]" : aspect.name === "Mindfulness" ? "text-[14px]" : "text-[18px]"}`}>
                {aspect.name}
            </p>
        </CardBody>
    </Card >
})

const circles = {};
aspects.map((aspect, index) => {
    circles[aspect.id] = shapes[index];
})

export default circles;