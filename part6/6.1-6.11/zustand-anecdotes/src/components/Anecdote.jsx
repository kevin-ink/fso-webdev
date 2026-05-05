import { useNotificationActions } from "../notificationStore";
import { useAnecdoteActions } from "../store";

const Anecdote = ({ anecdote }) => {
  const { addVote, remove } = useAnecdoteActions();
  const { setNotification } = useNotificationActions();

  const vote = () => {
    setNotification(`You voted '${anecdote.content}'`);
    addVote(anecdote.id);
  };

  const removeAnecdote = () => {
    if (anecdote.votes > 0) return;

    setNotification(`You removed anecdote '${anecdote.content}'`);
    remove(anecdote.id);
  };

  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={vote}>vote</button>
        {anecdote.votes <= 0 && (
          <button onClick={removeAnecdote}>remove</button>
        )}
      </div>
    </div>
  );
};

export default Anecdote;
