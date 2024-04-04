import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";


const SubmissionForm = ({ problemId }) => {
  const { user } = useAuthContext();
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [output, setOutput] = useState(null);
  const [submission, setSubmission] = useState(null);

  const runCode = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const payload = { language, code, input };
    const response = await fetch("/api/code/run", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }

    if (response.ok) {
      setLanguage("");
      setCode("");
      setInput("");
      setError(null);
      setEmptyFields([]);
      setOutput(json.output);
      console.log("Submission Made", json.output);
    }
  };

  const submitCode = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const payload = { language, code, problem_id: problemId };
    const response = await fetch("/api/code/submit", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }

    if (response.ok) {
      setLanguage("java");
      setCode("");
      setInput("");
      setError(null);
      setEmptyFields([]);
      setSubmission(json);
      console.log("Submission Made", json);
    }
  };

  return (
    <form className="compile">
      <div>
        <label>
          <b>Enter your code</b>
        </label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="java">Java</option>
          <option value="py">Python</option>
          <option value="cpp">C ++ </option>
        </select>
      </div>
      <textarea
  rows="15"
  cols="60"
  value={code}
  onChange={(e) => setCode(e.target.value)}
  className={emptyFields.includes("code") ? "error" : ""}
  style={{ color: "black", width: 700, height: 350, border: "1px solid black" }}
/>


      <label>
        <b>Enter input here</b>
      </label>
      <textarea 
        rows="5"
        cols="60"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={emptyFields.includes("input") ? "error" : ""}
        style={{ width: 700 }}
      />
      <div className="button-container">
        <button type="button" onClick={runCode} className="small-button">
          Run Code
        </button>
        <button type="button" onClick={submitCode} className="small-button">
          Submit Code
        </button>
      </div>
      {error && <div className="error">{error}</div>}

      {output && (
        <div className="output">
          <label>Output</label>
          <div className="output">{output}</div>
        </div>
      )}

      {submission && (
        <div>
          <label>Submission</label>
          <div className={submission.verdict === "failed" ? "error" : "output"}>
            <p>Verdict -  {submission.verdict}</p>
            <p>Total Test Cases - {submission.totalTestCases}</p>
            <p>Test Cases Passed -  {submission.testCasesPassed}</p>
          </div>
        </div>
      )}
    </form>
  );
};

export default SubmissionForm;
