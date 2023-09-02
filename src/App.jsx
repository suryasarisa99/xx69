import { Routes, Route } from "react-router-dom";
import Unlock from "./pages/Unlock";
import Admin from "./pages/Admin";
import Section from "./components/Section";
import Sudo from "./pages/Sudo";
import X from "./pages/X";
import Settings from "./pages/Settings";
import Search from "./pages/Search";
import Share from "./components/Share";
import Shared from "./pages/Shared";
import LargeCarousel from "./components/LargeCarousel";
import Clear from "./pages/Clear";
import Profile from "./pages/Profile";
import Sigin from "./pages/Sigin";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import Verification from "./pages/Verification";

function App() {
  return (
    <Routes>
      <Route path="/x/*" element={<X />} />
      <Route path="/login" element={<Unlock />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/section/:selected" element={<Section />} />
      <Route path="/sudo" element={<Sudo />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/search/:selected/:query" element={<Search />} />
      <Route path="/shared/:id" element={<Shared />} />
      <Route path="/share" element={<Share />} />
      <Route path="/" element={<X />} />
      <Route path="/large/:id" element={<LargeCarousel />} />
      <Route path="/clear" element={<Clear />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Sigin />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/verification/:id" element={<Verification />} />
      <Route path="/profile/:name" element={<Profile />} />
    </Routes>
  );
}

export default App;
