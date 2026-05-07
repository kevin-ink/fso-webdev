import { useAnecdotes } from "../hooks";

const AnecdoteList = () => {
  const { anecdotes, deleteAnecdote } = useAnecdotes();

  const handleDelete = (anecdote) => {
    deleteAnecdote(anecdote);
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map((anecdote) => (
          <li key={anecdote.id}>
            {anecdote.content}{" "}
            <button type="button" onClick={() => handleDelete(anecdote)}>
              delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnecdoteList;
