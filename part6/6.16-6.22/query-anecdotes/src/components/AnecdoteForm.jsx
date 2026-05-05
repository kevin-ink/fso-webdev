import useNotification from "../hooks/useNotification";

const AnecdoteForm = ({ addAnecdoteToServer }) => {
  const { notify } = useNotification();

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.reset();
    addAnecdoteToServer(content);
    notify(`anecdote '${content}' created`);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
