import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer';
import { Outlet } from 'react-router-dom';


function App() {
  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}

export default App
