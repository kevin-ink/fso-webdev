import { useState } from "react";

const Button = (props) => {
  const { onClick, text } = props;

  return <button onClick={onClick}>{text}</button>;
};

const StatisticLine = (props) => {
  const { text, value } = props;

  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = (props) => {
  const { good, neutral, bad } = props;

  return (
    <>
      <h1>statistics</h1>
      {good + neutral + bad === 0 ? ( // if no feedback has been given, show "No feedback given"
        <p>No feedback given</p>
      ) : (
        <table>
          <tbody>
            <StatisticLine text="good" value={good} />
            <StatisticLine text="neutral" value={neutral} />
            <StatisticLine text="bad" value={bad} />
            <StatisticLine text="all" value={good + neutral + bad} />
            <StatisticLine
              text="average"
              value={(good - bad) / (good + neutral + bad)}
            />
            <StatisticLine
              text="positive"
              value={(good / (good + neutral + bad)) * 100 + " %"}
            />
          </tbody>
        </table>
      )}
    </>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
