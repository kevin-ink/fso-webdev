import { useEffect, useState } from "react";
import anecdoteService from "../services/anecdotes";

export const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = () => {
    setValue("");
  };

  return {
    type,
    value,
    onChange,
    reset,
  };
};

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([]);

  useEffect(() => {
    anecdoteService.getAll().then((data) => setAnecdotes(data));
  }, []);

  const addAnecdote = (anecdote) => {
    anecdoteService
      .createNew(anecdote)
      .then((createdAnecdote) =>
        setAnecdotes((prev) => prev.concat(createdAnecdote)),
      );
  };

  const deleteAnecdote = (anecdote) => {
    anecdoteService
      .remove(anecdote)
      .then(() =>
        setAnecdotes((prev) => prev.filter((a) => a.id !== anecdote.id)),
      );
  };

  return { anecdotes, addAnecdote, deleteAnecdote };
};
