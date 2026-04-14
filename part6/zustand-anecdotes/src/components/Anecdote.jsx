import { useAnecdoteActions } from "../store";

const Anecdote = ({ anecdote }) => {
  const { addVote } = useAnecdoteActions();

  const vote = (id) => {
    addVote(id);
  };

  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => vote(anecdote.id)}>vote</button>
      </div>
    </div>
  );
};

export default Anecdote;
