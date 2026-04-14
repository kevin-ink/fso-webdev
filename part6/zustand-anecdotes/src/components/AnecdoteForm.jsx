import { useAnecdoteActions } from "../store";

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions();
  const addAnecdote = (e) => {
    e.preventDefault();
    const newAnecdote = { content: e.target.anecdote.value, votes: 0 };
    add(newAnecdote);
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
