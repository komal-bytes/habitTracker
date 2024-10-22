import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Select, Button, SelectItem } from '@nextui-org/react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { queryLogs } from '@/utils/habitFunctions';

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

    const chartOptions = {
        responsive: true, // Make the chart responsive
        // plugins: {
        //     legend: {
        //         labels: {
        //             font: {
        //                 size: 14, // Font size of legend labels
        //             },
        //             color: '#333', // Color of legend text
        //         },
        //     },
        //     tooltip: {
        //         backgroundColor: 'rgba(0,0,0,0.8)', // Tooltip background color
        //         titleColor: '#fff', // Tooltip title color
        //         bodyColor: '#fff', // Tooltip body color
        //         borderWidth: 1, // Border width of the tooltip
        //         borderColor: 'orange', // Border color of the tooltip
        //         displayColors: false, // Disable color boxes in the tooltip
        //     },
        // },
        // scales: {
        //     x: {
        //         grid: {
        //             display: true, // Show grid lines on the x-axis
        //             color: 'rgba(255, 165, 0, 0.2)', // Grid line color on the x-axis
        //             borderDash: [5, 5], // Dashed lines for x-axis grid
        //         },
        //         ticks: {
        //             color: 'orange', // Color of x-axis labels
        //             font: {
        //                 size: 12, // Font size of x-axis labels
        //             },
        //         },
        //     },
        //     y: {
        //         grid: {
        //             display: true, // Show grid lines on the y-axis
        //             color: 'rgba(255, 165, 0, 0.2)', // Grid line color on the y-axis
        //         },
        //         ticks: {
        //             color: 'orange', // Color of y-axis labels
        //             font: {
        //                 size: 12, // Font size of y-axis labels
        //             },
        //         },
        //     },
        // },
    };

    const updateFilters = (e: any) => {
        if (e.target.name === "type") setType(e.target.value);
        else if (e.target.name === "month") setMonth(e.target.value);
        else setYear(e.target.value);

        setAnalyse(false);
    }

    return (
        <div className="flex-column p-8">

            <div className="flex gap-4 flex-wrap items-center">
                <Select
                    placeholder="Type"
                    name='type'
                    value={type.split(",").join('')}
                    onChange={(e) => {
                        updateFilters(e)
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
                <div className="w-full h-[200px]">
                    {type === 'Daily' ? (
                        <Line data={chartData}/>
                    ) : (
                        <Bar data={chartData} />
                    )}
                </div>
            }

        </div>
    );
};

export default Graph;