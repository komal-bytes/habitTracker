import React, { useRef, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Select, Button, SelectItem } from '@nextui-org/react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { queryLogs } from '@/utils/habitFunctions';
import WhatsAppButton from '@/components/Progress/WhatsAppButton';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface Props {
    selectedHabit: Object
}

const Graph: React.FC<Props> = ({ selectedHabit }) => {

    const progressRef = useRef<HTMLDivElement>(null);
    const [type, setType] = useState('Daily');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [data, setData] = useState({});
    const [completionRate, setCompletionRate] = useState(null);
    const [analyse, setAnalyse] = useState(false);

    const handleAnalyse = async () => {
        let { logs, completionRate } = await queryLogs(type, selectedHabit?.id, year, month);

        console.log(logs, "logs")
        console.log(completionRate, "completionRate")
        setCompletionRate(completionRate)
        setData(logs)
        setAnalyse(true)
    };


    // Get available years for the year dropdown
    const getYears = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = new Date(selectedHabit?.startDate).getFullYear() || new Date().getFullYear(); i <= currentYear; i++) {
            years.push(i.toString());
        }
        return years;
    };

    const chartData = {
        labels: Object.keys(data),

        datasets: [
            {
                label: `${type} Progress`,

                data: Object.values(data),
                borderWidth: 2,
                borderColor: 'orange',
                backgroundColor: 'rgba(255, 165, 0, 0.3)',

            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,  // This allows the chart to resize based on its container
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 14,  // Adjust font size for mobile readability
                    },
                },
            },
            y: {
                ticks: {
                    font: {
                        size: 14,
                    },
                },
            },
        },
    };

    const updateFilters = (e: any) => {
        if (e.target.name === "type") setType(e.target.value);
        else if (e.target.name === "month") setMonth(e.target.value);
        else setYear(e.target.value);

        setAnalyse(false);
    }

    return (

        <>
            <div className="flex-column p-8" ref={progressRef}>

                <div className="flex gap-4 flex-wrap items-center">
                    <Select
                        placeholder="Type"
                        name='type'
                        value={type.split(",").join('')}
                        onChange={(e) => {
                            updateFilters(e)
                            setData({})
                        }}
                        className="w-32"
                        aria-label="Type"
                    >
                        <SelectItem key="Daily" value="Daily">Daily</SelectItem>
                        <SelectItem key="Weekly" value="Weekly">Weekly</SelectItem>
                        <SelectItem key="Monthly" value="Monthly">Monthly</SelectItem>
                    </Select>


                    {type !== 'Monthly' && (
                        <Select
                            placeholder="Month"
                            name='month'
                            value={month.split(",").join('')}
                            onChange={updateFilters}
                            className="w-32"
                            aria-label="Month"
                        >
                            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(
                                (month, index) => (
                                    <SelectItem key={index + 1} value={month}>
                                        {month}
                                    </SelectItem>
                                )
                            )}
                        </Select>
                    )}

                    <Select
                        placeholder="Year"
                        value={year.split(",").join('')}
                        onChange={updateFilters}
                        className="w-32"
                        aria-label="Year"
                    >
                        {getYears().map((y) => (
                            <SelectItem key={y.toString()} value={y}>
                                {y}
                            </SelectItem>
                        ))}
                    </Select>

                    {/* Analyse Button */}
                    <Button onPress={handleAnalyse}
                        className='bg-button-gradient text-white'
                    >Analyse</Button>
                </div>

                <div className="flex justify-between items-center my-4">
                    {
                        completionRate != null && analyse
                        &&
                        <div className="text-lg font-bold">Completion Rate: {completionRate}%</div>
                    }
                </div>

                {/* Chart Section */}
                {
                    (Object.keys(data).length > 0 && analyse)
                    &&
                    <div className="w-full h-[250px] md:h-[300px] lg:h-[350px]">
                        {type === 'Daily' ? (
                            <Line data={chartData} options={options} />
                        ) : (
                            <Bar data={chartData} options={options} />
                        )}
                    </div>
                }

            </div>

            {
                Object.keys(data).length > 0
                &&
                <WhatsAppButton ref={progressRef} />
            }
        </>
    );
};

export default Graph;