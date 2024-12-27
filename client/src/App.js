import './App.css';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import LoginPage from './Pages/Admin/Student/LoginPage';
import UserContextProvider, { UserProvider } from './Components/UserContext';
import AdminDashboardPage from './Pages/Admin/AdminDashboardPage';
import StudentDashboardPage from './Pages/Admin/Student/StudentDashboardPage';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './Components/ProtectedRouter';
import UserListPage from './Pages/Admin/UserListPage';
import TestList from './Components/Admin/TestList';
import TestListPage from './Pages/Admin/TestListPage';
import MarkListPage from './Pages/Admin/Student/MarkListPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <UserContextProvider>
      <Toaster position="top-right" toastOptions={{duration: 5000}}/>
      <Routes>
      <Route path="/" element={<LoginPage />} />
          <Route path='/admin-dashboard' element={<ProtectedRoute><AdminDashboardPage/></ProtectedRoute>}></Route>
          <Route path='/student-dashboard' element={<ProtectedRoute><StudentDashboardPage/></ProtectedRoute>}></Route>
          <Route path='/user-list' element={<ProtectedRoute><UserListPage></UserListPage></ProtectedRoute>}></Route>
          <Route path='/test-list' element={<ProtectedRoute><TestListPage/></ProtectedRoute>}></Route>
          <Route path='/mark-list' element={<ProtectedRoute><MarkListPage/></ProtectedRoute>}></Route>

      </Routes>
      </UserContextProvider>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
