// ProjectDetailPage.tsx  
import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Détails du projet {id}</h1>
      <p>Page de détail du projet - En développement</p>
    </div>
  );
};

export default ProjectDetailPage; 