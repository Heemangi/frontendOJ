import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuthContext } from '../hooks/useAuthContext';
import SubmissionForm from './SubmissionForm';

const ProblemPage = () => {
    const { problemId } = useParams();
    const { user } = useAuthContext();
    const [fetchedProblem, setFetchedProblem] = useState(null);
    const [activeTab, setActiveTab] = useState("description");

    const fetchProblemData = async () => {
        const response = await fetch('/api/problems/' + problemId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        const problemData = await response.json();
        if (response.ok) {
            setFetchedProblem(problemData);
        }
    };

    useEffect(() => {
        if (user) {
            fetchProblemData();
        }
    }, [user]);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <div className="problem-page" >
            {fetchedProblem && (
                <div className="problem-section" >
                    <h2>{fetchedProblem.title}</h2>
                    <div className="tab-buttons">
                        <button
                            className={`tab-button ${activeTab === "description" ? "active" : ""}`}
                            onClick={() => handleTabClick("description")}
                        >
                            Description
                        </button>
                        <button
                            className={`tab-button ${activeTab === "submissions" ? "active" : ""}`}
                            onClick={() => handleTabClick("submissions")}
                        >
                            Submissions
                        </button>
                        <button
                            className={`tab-button ${activeTab === "leaderboard" ? "active" : ""}`}
                            onClick={() => handleTabClick("leaderboard")}
                        >
                            Leaderboard
                        </button>
                    </div>
                    <div className="tab-content">
                        {activeTab === "description" && (
                            <div>
                                <p><b>Description    </b> {fetchedProblem.description}</p>
                                <p><b>Tag    </b>{fetchedProblem.tag}</p>
                                <p><b>Difficulty    </b> {fetchedProblem.difficulty}</p>
                            </div>
                        )}
                        {activeTab === "submissions" && (
                         <Link to={`/problems/${problemId}/submissions`} className="link-button">
                          Submissions
                        </Link> 
                        )}

                        {activeTab === "leaderboard" && (
                            <Link to={`/problems/${problemId}/leaderboard`} className="link-button">
                            View Leaderboard
                            </Link>
                        )}

                        
                    </div>
                </div>
            )}

            <SubmissionForm problemId={problemId} />
        </div>
    );
};

export default ProblemPage;
