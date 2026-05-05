import { useStatistics } from "../store";

const Statistics = () => {
  const { bad, good, neutral } = useStatistics();

  return (
    <div>
      <h2>statistics</h2>
      {good + bad + neutral === 0 && <p>no feedback given</p>}
      {good + bad + neutral > 0 && (
        <table>
          <tbody>
            <tr>
              <td>good</td>
              <td>{good}</td>
            </tr>
            <tr>
              <td>neutral</td>
              <td>{neutral}</td>
            </tr>
            <tr>
              <td>bad</td>
              <td>{bad}</td>
            </tr>
            <tr>
              <td>all</td>
              <td>{good + neutral + bad}</td>
            </tr>
            <tr>
              <td>average</td>
              <td>{(good - bad) / (good + neutral + bad)}</td>
            </tr>
            <tr>
              <td>positive</td>
              <td>{(good / (good + neutral + bad)) * 100 + " %"}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Statistics;
