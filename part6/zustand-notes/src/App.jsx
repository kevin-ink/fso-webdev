import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import { useNoteActions } from "./components/store";
import VisibilityFilter from "./components/VisibilityFilter";
import { useEffect } from "react";

const App = () => {
  const { initialize } = useNoteActions();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <>
      <NoteForm />
      <VisibilityFilter />
      <NoteList />
    </>
  );
};

export default App;
