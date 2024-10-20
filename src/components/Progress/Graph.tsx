import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Select, Button, SelectItem } from '@nextui-org/react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { queryLogs } from '@/utils/habitFunctions';
// import { getCompletionRate } from './yourHelperFile'; // Your function to get the completion rate

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
        // if (type === 'Daily') {
        //     setData([
        //         { date: '2024-01-01', count: 70 },
        //         { date: '2024-01-02', count: 80 },
        //         { date: '2024-01-03', count: 90 },
        //     ]);
        // } else if (type === 'Weekly') {
        //     setData([
        //         { weekRange: 'Week 1', count: 75 },
        //         { weekRange: 'Week 2', count: 80 },
        //     ]);
        // } else if (type === 'Monthly') {
        //     setData([
        //         { monthName: 'January', count: 85 },
        //         { monthName: 'February', count: 90 },
        //     ]);
        // }
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

    // Chart data based on selected type
    const chartData = {
        // Get the keys (date, weekRange, or monthName) based on selected type for labels
        labels: Object.keys(data),

        datasets: [
            {
                // Label will dynamically change based on the selected type (Daily/Weekly/Monthly)
                label: `${type} Progress`,

                // Get the values (percentage complete for each date, week, or month)
                data: Object.values(data),
                borderWidth: 2,
                borderColor: 'orange',
                backgroundColor: 'rgba(255, 165, 0, 0.3)',
            },
        ],
    };

    const updateFilters = (e: any) => {
        if (e.target.name === "type") setType(e.target.value);
        else if (e.target.name === "month") setMonth(e.target.value);
        else setYear(e.target.value);

        setAnalyse(false);
    }

    console.log(chartData)

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

            <div className="flex justify-between items-center mt-4">
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
                <div className="w-full h-64">
                    {type === 'Daily' ? (
                        <Line data={chartData} />
                    ) : (
                        <Bar data={chartData} />
                    )}
                </div>
            }

        </div>
    );
};

export default Graph;