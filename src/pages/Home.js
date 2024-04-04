import React, { useEffect } from 'react';
import { useProblemListContext } from '../hooks/useProblemListContext';
import { useAuthContext } from '../hooks/useAuthContext';
import ProblemListDetails from '../components/ProblemListDetails';
import { Link } from 'react-router-dom';

const Home = () => {
  const { problems, dispatch } = useProblemListContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchProblems = async () => {
      const response = await fetch('/api/problems', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_PROBLEMS', payload: json });
      }
    };

    if (user) {
      fetchProblems();
    }
  }, [dispatch, user]);

  return (
    <div className="home">
      <div className='problems'>
        {problems && problems.map((problem) => (
          <ProblemListDetails key={problem._id} problem={problem} />
        ))}
      </div>
      <div className="button-container">
        <Link to="/problem-form" className="button-link">Add a New Problem</Link>
    </div>

      </div>
  );
};

export default Home;
