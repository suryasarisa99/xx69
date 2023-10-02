import { Routes, Route } from "react-router-dom";
import Unlock from "./auth/Unlock";
import Admin from "./auth/Admin";
// import Section from "./components/Section";
import Sudo from "./auth/Sudo";
import X from "./pages/X";
import Settings from "./pages/Settings";
import Search from "./pages/Search";
import Share from "./components/Share";
import Shared from "./pages/Shared";
import LargeCarousel from "./components/LargeCarousel";
import Clear from "./pages/Clear";
import Profile from "./profile/Profile";
import Sigin from "./auth/Sigin";
import Signup from "./auth/Signup";
import Verify from "./auth/Verify";
import Verification from "./auth/Verification";
import ProfileSection from "./profile/ProfileSection";
import ProfileView from "./profile/ProfileView";
import GoogleAuth from "./auth/GoogleAuth";
import About from "./pages/About";

function App() {
  return (
    <Routes>
      <Route path="/x/*" element={<X />} />
      <Route path="/login" element={<Unlock />} />
      <Route path="/admin" element={<Admin />} />
      {/* <Route path="/section/:selected" element={<Section />} /> */}
      <Route path="/sudo" element={<Sudo />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/search/:selected/:query" element={<Search />} />
      <Route path="/shared/:id" element={<Shared />} />
      <Route path="/share" element={<Share />} />
      <Route path="/" element={<X />} />
      <Route path="/large/:id" element={<LargeCarousel />} />
      <Route path="/clear" element={<Clear />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<GoogleAuth />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/verification/:id" element={<Verification />} />
      <Route path="/profile/:name/:type/:index" element={<ProfileSection />} />
      <Route path="/profile/:name" element={<Profile />} />
      <Route path="/test" element={<GoogleAuth />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;
