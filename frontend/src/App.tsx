import { Route, Routes } from "react-router";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
