export const formatDate = (dateString: string, format: 'short' | 'long' = 'long'): string => {
  const date = new Date(dateString);
  
  if (format === 'short') {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const isDateToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

export const isDateTomorrow = (dateString: string): boolean => {
  const date = new Date(dateString);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return date.getDate() === tomorrow.getDate() &&
         date.getMonth() === tomorrow.getMonth() &&
         date.getFullYear() === tomorrow.getFullYear();
};

export const isDatePast = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  
  return date < today;
};

export const getDaysDifference = (dateString: string): number => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatDueDate = (dueDate?: string): string => {
  if (!dueDate) return 'No due date';
  
  if (isDatePast(dueDate)) return 'Overdue';
  if (isDateToday(dueDate)) return 'Today';
  if (isDateTomorrow(dueDate)) return 'Tomorrow';
  
  const daysDiff = getDaysDifference(dueDate);
  if (daysDiff < 7) return `In ${daysDiff} day${daysDiff !== 1 ? 's' : ''}`;
  
  return formatDate(dueDate, 'short');
};