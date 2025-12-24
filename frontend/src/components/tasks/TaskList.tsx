import React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import type { Task } from '../../types/task.types';
import TaskCard from './TaskCard';
import EmptyState from '../common/EmptyState';
import Loader from '../common/Loader';

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  error?: string | null;
  onToggleStatus?: (task: Task) => Promise<void>;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
  emptyMessage?: string;
  viewMode?: 'list' | 'grid' | 'compact';
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading = false,
  error = null,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
  emptyMessage = 'No tasks found',
  viewMode = 'list',
}) => {
  const columnWidth = viewMode === 'grid' ? 6 : 12;

  if (loading) {
    return <Loader message="Loading tasks..." />;
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error loading tasks</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks yet"
        message={emptyMessage}
        icon="folder"
        actionText="Create your first task"
        onAction={() => window.location.href = window.location.pathname + '?create=true'}
      />
    );
  }

  // Compact view - simple list
  if (viewMode === 'compact') {
    return (
      <div>
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleStatus={onToggleStatus}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            compact={true}
          />
        ))}
      </div>
    );
  }

  // Grid or List view
  return (
    <Row>
      {tasks.map((task, index) => (
        <Col 
          key={task.id} 
          xs={12} 
          md={columnWidth} 
          className="mb-3"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <TaskCard
            task={task}
            onToggleStatus={onToggleStatus}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            compact={false}
          />
        </Col>
      ))}
    </Row>
  );
};

export default TaskList;