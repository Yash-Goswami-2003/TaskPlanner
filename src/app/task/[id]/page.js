'use client';

import React from 'react';
import TaskContainer from '../../../components/task/TaskContainer';

export default function DynamicTaskPage({ params }) {
  const resolvedParams = React.use(params);
  return <TaskContainer taskId={resolvedParams.id} />;
}
