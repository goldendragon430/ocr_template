//
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function HomeView() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/dashboard');
  }, []);
  return <></>;
}
