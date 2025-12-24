import React from 'react';
import { Card } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeeklyChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
    }[];
  };
  title?: string;
  height?: number;
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ 
  data, 
  title = 'Weekly Task Completion',
  height = 250
}) => {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y} tasks`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        },
        title: {
          display: true,
          text: 'Tasks Completed'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Day of Week'
        }
      }
    }
  };

  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Header className="bg-white border-0">
        <h5 className="mb-0">{title}</h5>
      </Card.Header>
      <Card.Body>
        <div style={{ height: `${height}px` }}>
          <Line data={data} options={options} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default WeeklyChart;