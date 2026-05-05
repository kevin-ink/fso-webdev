import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import useNotification from "./hooks/useNotification";
import { useAnecdotes } from "./useAnecdotes";

const App = () => {
  const { notify } = useNotification();

  const {
    anecdotes,
    isPending,
    isError,
    addAnecdote: addAnecdoteToServer,
    addVote: addVoteToAnecdote,
  } = useAnecdotes();

  const handleVote = (anecdote) => {
    addVoteToAnecdote(anecdote);
    notify(`anecdote '${anecdote.content}' voted`);
  };

  if (isPending) {
    return <div>loading...</div>;
  }

  if (isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm addAnecdoteToServer={addAnecdoteToServer} />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
