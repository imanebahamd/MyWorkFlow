import React from 'react';
import { Card } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TaskStatusChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
  title?: string;
  height?: number;
}

const TaskStatusChart: React.FC<TaskStatusChartProps> = ({ 
  data, 
  title = 'Task Status Distribution',
  height = 300
}) => {
  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.parsed;
            const percentage = Math.round((value / total) * 100);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
  };

  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Header className="bg-white border-0">
        <h5 className="mb-0">{title}</h5>
      </Card.Header>
      <Card.Body className="d-flex align-items-center justify-content-center">
        <div style={{ height: `${height}px`, width: '100%' }}>
          <Doughnut data={data} options={options} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default TaskStatusChart;