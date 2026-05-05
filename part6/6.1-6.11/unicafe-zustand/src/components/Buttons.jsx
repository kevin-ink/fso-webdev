import { useStatisticsControls } from "../store";

const Buttons = () => {
  const { incrementBad, incrementGood, incrementNeutral } =
    useStatisticsControls();

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={incrementGood}>good</button>
      <button onClick={incrementNeutral}>neutral</button>
      <button onClick={incrementBad}>bad</button>
    </div>
  );
};

export default Buttons;
