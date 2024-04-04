import { useAuthContext } from '../hooks/useAuthContext'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const Submission = () => {
    const { user } = useAuthContext()
    const { problemId } = useParams();
    const [ submissions, setSubmissions ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)
    const [ error, setError ] = useState(null)

    const fetchProblemSubmissionData = async () => {
        try {
            const response = await fetch(`/api/submissions/?problem_id=${problemId}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${user.token}`
                }
            })
            
            if (response.ok) {
                const data = await response.json()
                setSubmissions(data)
            }
            else if (response.status === 404) {
                setError('No submissions found for this problem.')
            }
        } catch (error) {
            console.error('Error fetching submissions:', error)
            setError('An error occurred while fetching submissions.')
        } finally {
            setIsLoading(false)
        }
    }
    
    useEffect(() => {
        if (user) {
            fetchProblemSubmissionData()
        }// eslint-disable-next-line
      }, [problemId, user])
    

    return (
        <div className="submission-page">   
            <h2 className='headd'>Submissions</h2>
            
            {isLoading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!isLoading && !error && submissions.length === 0 && (
                <p>No submissions found for this problem by the current user.</p>
            )}

            {!isLoading && !error && submissions.length > 0 && (
                <table className="submissions-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Language</th>
                            <th>Verdict</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map((submission, index) => (
                            <tr key={index}>
                            <td>{formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}</td>
                            <td>{submission.language}</td>
                            <td>{submission.verdict}</td>
                            <td>{submission.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </div>
    )
}

export default Submission
