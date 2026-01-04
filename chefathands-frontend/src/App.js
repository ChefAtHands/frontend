import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import RecipePage from "./pages/RecipePage";
import WelcomePage from "./pages/WelcomePage";
import logo from "./content.png";

function App() {
  
  return(
    <div>
      <header className="app-header">
        <div className="header-content">
          <img src={logo} alt="ChefAtHands Logo" className="app-logo" />
          <div className="app-title">ChefAtHands</div>
        </div>
      </header>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  
  );
}

export default App;