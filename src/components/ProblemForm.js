import { useState } from "react"
import { useProblemListContext } from "../hooks/useProblemListContext"
import { useAuthContext } from "../hooks/useAuthContext"

const ProblemForm = () => {
    const {dispatch} = useProblemListContext()
    const {user} = useAuthContext()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [tag, setTag] = useState('')
    const [difficulty, setDifficulty] = useState('easy')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])
    const [testCases, setTestCases] = useState([{ input: '', output: '' }]);

    const handleAddTestCase = () => {
        setTestCases([...testCases, { input: '', output: '' }])
    }

    const handleTestCaseChange = (index, key, value) => {
        const updatedTestCases = [...testCases]
        updatedTestCases[index][key] = value
        setTestCases(updatedTestCases)
    }

    const handleRemoveTestCase = (index) => {
        const updatedTestCases = [...testCases]
        updatedTestCases.splice(index, 1)
        setTestCases(updatedTestCases)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user){
            setError('You must be logged in')
            return
        }

        const invalidTestCases = testCases.some(
            (testCase) => testCase.output.trim() === ''
        )
        
        if (invalidTestCases) {
            setError("All test cases must have output specified")
            return
        }

        const problem = {title, description, test_cases: testCases, tag, difficulty}
        const response = await fetch('/api/problems', {
            method: 'POST',
            body: JSON.stringify(problem),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }

        if (response.ok) {
            setTitle('')
            setDescription('')
            setTag('')
            setDifficulty('easy')
            setError(null)
            setEmptyFields([])
            setTestCases([{ input: '', output: '' }]);
            console.log('New Problem Added', json)
            dispatch({type: 'CREATE_PROBLEM', payload: json})
        }
    }

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3><strong>NEW PROBLEM</strong></h3>
            
            <label>Problem Title</label>
            <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className={emptyFields.includes('title') ? 'error' : ''}
            />

            <label>Problem Description </label>
            <input
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className={emptyFields.includes('description') ? 'error' : ''}
            />

            <label>Tags </label>
            <input
                type="text"
                onChange={(e) => setTag(e.target.value)}
                value={tag}
                className={emptyFields.includes('tag') ? 'error' : ''}
            />

            <label>Difficulty</label>
            <select value={difficulty} className={emptyFields.includes('difficulty') ? 'error' : ''} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select><br />   

            <label>Test Cases</label>
            {testCases.map((testCase, index) => (
                <div key={index}>
                <input
                    type="text"
                    placeholder="Input"
                    value={testCase.input}
                    className={emptyFields.includes('test_cases') ? 'error' : ''}
                    onChange={(e) =>
                    handleTestCaseChange(index, "input", e.target.value)
                    }
                />
                <input
                    type="text"
                    placeholder="Output"
                    value={testCase.output}
                    className={emptyFields.includes('test_cases') ? 'error' : ''}
                    onChange={(e) =>
                    handleTestCaseChange(index, "output", e.target.value)
                    }
                />
                <button type="button" onClick={() => handleRemoveTestCase(index)}>
                    Delete
                </button>
                </div>
            ))}
            <button type="button" onClick={handleAddTestCase}>
                Add Test Case
            </button>   

            <button>Add Problem</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default ProblemForm
