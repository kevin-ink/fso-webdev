import { useAnecdotes, useField } from "../hooks";
import { useNavigate } from "react-router-dom";

const CreateNew = () => {
  const navigate = useNavigate();
  const { addAnecdote } = useAnecdotes();
  const { reset: resetContent, ...content } = useField("text");
  const { reset: resetAuthor, ...author } = useField("text");
  const { reset: resetInfo, ...info } = useField("text");

  const handleSubmit = (e) => {
    e.preventDefault();
    addAnecdote({
      content: content.value,
      author: author.value,
      info: info.value,
    });
    navigate("/");
  };

  const handleResetClick = () => {
    resetContent();
    resetAuthor();
    resetInfo();
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button>create</button>
        <button type="button" onClick={handleResetClick}>
          reset
        </button>
      </form>
    </div>
  );
};

export default CreateNew;
