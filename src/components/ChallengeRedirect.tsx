import { Navigate, useParams } from 'react-router-dom';

const ChallengeRedirect = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/app/challenges/${id}`} replace />;
};

export default ChallengeRedirect; 