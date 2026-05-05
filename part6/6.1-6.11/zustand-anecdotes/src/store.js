import { create } from "zustand";
import anecdoteService from "./services/anecdoteService";

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: "",
  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll();
      set(() => ({ anecdotes }));
    },
    addVote: async (id) => {
      const anecdote = get().anecdotes.find((a) => a.id === id);
      const updated = await anecdoteService.update(id, {
        ...anecdote,
        votes: anecdote.votes + 1,
      });
      set((state) => ({
        anecdotes: state.anecdotes.map((anecdote) =>
          anecdote.id === id ? updated : anecdote,
        ),
      }));
    },
    add: async (anecdote) => {
      const newAnecdote = await anecdoteService.createNew(anecdote);
      set((state) => ({
        anecdotes: [...state.anecdotes, newAnecdote],
      }));
    },
    remove: async (id) => {
      await anecdoteService.remove(id);
      set((state) => ({
        anecdotes: state.anecdotes.filter((a) => a.id !== id),
      }));
    },
    setFilter: (value) => set(() => ({ filter: value })),
  },
}));

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes).toSorted(
    (a, b) => b.votes - a.votes,
  );

  const filter = useAnecdoteStore((state) => state.filter);
  return anecdotes.filter((a) =>
    a.content.toLowerCase().includes(filter.toLowerCase()),
  );
};

export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions);
