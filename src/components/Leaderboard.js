import { useAuthContext } from '../hooks/useAuthContext'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const Leaderboard = () => {
    const { user } = useAuthContext()
    const { problemId } = useParams();
    const [ leaderboard, setLeaderboard ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)
    const [ error, setError ] = useState(null)

    const fetchLeaderboardData = async () => {
        try {
            const response = await fetch(`/api/submissions/leaderboard/?problem_id=${problemId}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${user.token}`
                }
            })
            
            if (response.ok) {
                const data = await response.json()
                setLeaderboard(data)
            }
            else if (response.status === 404) {
                setError('No submissions found for this problem.')
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error)
            setError('An error occurred while fetching leaderboard.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchLeaderboardData()
        } // eslint-disable-next-line
      }, [problemId, user])
    

    return (
        <div className="submissions">   
            <h2>Leaderboard</h2>
            
            {isLoading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!isLoading && !error && leaderboard.length === 0 && (
                <p>No submissions found for this problem.</p>
            )}

            {!isLoading && !error && leaderboard.length > 0 && (
                <table className="submissions-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Username</th>
                            <th>Language</th>
                            <th>Verdict</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((leaderboard, index) => (
                            <tr key={index}>
                                <td>{formatDistanceToNow(new Date(leaderboard.createdAt), {addSuffix: true})}</td>
                                <td>{leaderboard.user_id.username}</td>
                                <td>{leaderboard.language}</td>
                                <td>{leaderboard.verdict}</td>
                                <td>{leaderboard.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default Leaderboard
