import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import VisibilityFilter from "./components/VisibilityFilter";

const App = () => {
  return (
    <>
      <NoteForm />
      <VisibilityFilter />
      <NoteList />
    </>
  );
};
export default App;
