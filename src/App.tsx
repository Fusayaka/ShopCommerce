import './App.css'
import { Header } from './components';
import { Footer } from './components';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


function App() {
  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        <Outlet />
      </main>
      
      <Footer />

      <ToastContainer
        position='top-right'
        autoClose={3000}
        newestOnTop={true}
        limit={3}
        pauseOnHover={false}
      />
    </div>
  );
}

export default App
