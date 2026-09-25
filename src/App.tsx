import './App.css'
import { Header } from './components';
import { Footer } from './components';
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
