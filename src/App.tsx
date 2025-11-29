import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import { Welcome } from './pages/Welcome';
import { Chats } from './pages/Chats';
import { ChatView } from './pages/ChatView';
import { Profile } from './pages/Profile';
import { NFTGeneratorPage } from './pages/NFTGenerator';
import { NFTMarketplace } from './pages/NFTMarketplace';
import { Checkout } from './pages/Checkout';
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <GlobalStyles />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/chats" /> : <Welcome />}
        />
        <Route
          path="/chats"
          element={isAuthenticated ? <Chats /> : <Navigate to="/" />}
        />
        <Route
          path="/chat/:id"
          element={isAuthenticated ? <ChatView /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/" />}
        />
        <Route path="/nft-generator" element={<NFTGeneratorPage />} />
        <Route path="/marketplace" element={<NFTMarketplace />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
