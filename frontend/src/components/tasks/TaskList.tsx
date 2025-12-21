import React from 'react';
import { Row, Col, Alert, Placeholder } from 'react-bootstrap';
import type { Task } from '../../types/task.types';
import TaskCard from './TaskCard';
import EmptyState from '../common/EmptyState';

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

  if (loading && tasks.length === 0) {
    return (
      <div className="py-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="mb-3">
            <Placeholder as="div" animation="wave">
              <Placeholder xs={12} style={{ height: '100px' }} />
            </Placeholder>
          </div>
        ))}
      </div>
    );
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

  // Group tasks by status for better organization
  const tasksByStatus = {
    TODO: tasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
    DONE: tasks.filter(t => t.status === 'DONE'),
  };

  const hasMultipleStatuses = Object.values(tasksByStatus).filter(arr => arr.length > 0).length > 1;

  // Créer une copie locale de viewMode pour éviter les problèmes de typage
  const currentViewMode = viewMode;

  if (hasMultipleStatuses && currentViewMode === 'list') {
    return (
      <div>
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => {
          if (statusTasks.length === 0) return null;
          
          return (
            <div key={status} className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 text-capitalize">{status.replace('_', ' ')} ({statusTasks.length})</h5>
              </div>
              <Row>
                {statusTasks.map(task => (
                  <Col key={task.id} xs={12} className="mb-3">
                    <TaskCard
                      task={task}
                      onToggleStatus={onToggleStatus}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      compact={false} // Dans ce bloc, on sait que viewMode est 'list'
                    />
                  </Col>
                ))}
              </Row>
            </div>
          );
        })}
      </div>
    );
  }

  // Déterminer si les cartes doivent être compactes
  const isCompact = currentViewMode === 'compact' || currentViewMode === 'grid';

  return (
    <Row>
      {tasks.map(task => (
        <Col key={task.id} xs={12} md={columnWidth} className="mb-3">
          <TaskCard
            task={task}
            onToggleStatus={onToggleStatus}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            compact={isCompact}
          />
        </Col>
      ))}
    </Row>
  );
};

export default TaskList;