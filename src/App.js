import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import NoPage from "./Pages/NoPage";
import Chat from "./Pages/Chat";
import Places from "./Pages/Places";
import PrivateRoute from "./components/PrivateRoute";

const AppContent = () => {
  const { userId } = useContext(AuthContext); // Get userId from context

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/places" element={<Places />} />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat userId={userId} /> {/* Pass dynamic userId */}
            </PrivateRoute>
          }
        />
        <Route path="/" element={<p>Welcome to the search engine!</p>} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
