import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserForm from "./user-form";
import AllScores from "./scores";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserForm />} />
        <Route path="/scores/:id" element={<AllScores />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
