import { useNotificationActions } from "../notificationStore";
import { useAnecdoteActions } from "../store";

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions();
  const { setNotification } = useNotificationActions();

  const addAnecdote = (e) => {
    e.preventDefault();
    add(e.target.anecdote.value);
    setNotification(`You added a new anecdote '${e.target.anecdote.value}'`);
    e.target.reset;
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
