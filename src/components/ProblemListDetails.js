import React, { useState, useEffect } from 'react';
import { useProblemListContext } from '../hooks/useProblemListContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { Link } from 'react-router-dom';

const ProblemListDetails = ({ problem }) => {
  const { dispatch } = useProblemListContext();
  const { user } = useAuthContext();
  const [error, setError] = useState(null);

  const handleClick = async () => {
    const response = await fetch(`/api/problems/?id=${problem._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();
    if (response.ok) {
      dispatch({ type: 'DELETE_PROBLEM', payload: json });
    } else {
      setError(json.error);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="problem-details">
      <Link to={`/problems/${problem._id}`} className='head'>
        <h4>{problem.title}</h4>
      </Link>
      <p>
        <b>Tags  </b>  
        <i>{problem.tag}</i> ,  
        <b> Difficulty   </b> 
        <i>{problem.difficulty}</i>
      </p>
      <span className="material-symbols-outlined" onClick={handleClick}>
        delete
      </span>

      {error && (
        <div className="error-popup">
          {error}
        </div>
      )}
    </div>
  );
};



<div className="button-container">
  <Link to="/problem-form" className="button-link">Add a New Problem</Link>
</div>
export default ProblemListDetails;