import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddRescuer from './components/AddRescuer';
import IncomingRequests from './components/IncomingRequests';
import Rescuers from './components/Rescuers'; 
import OngoingRescues from './components/OngoingRescues';  
import GenerateReports from './components/GenerateReports'; 
import Settings from './components/Settings';  
import ViewProfile from './components/ViewProfile';  
import ChangePassword from './components/ChangePassword';  
import Sidebar from './components/Sidebar'

// import Login from './pages/Login';
// import ForgotPassword from './pages/ForgotPassword';
// import ChangePassword from './pages/ChangePassword';

const App = () => {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/addRescuer" element={<AddRescuer/>} />
            <Route path="/incomingRequests" element={<IncomingRequests />} />
            <Route path="/rescuers" element={<Rescuers />} />
            <Route path="/ongoingRescues" element={<OngoingRescues />} />
            <Route path="/generateReports" element={<GenerateReports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/viewProfile" element={<ViewProfile />} />
            <Route path="/changePassword" element={<ChangePassword />} /> 
          </Routes>
        </div>
      </div>
    </Router>
    
    // <Login />
    // <ForgotPassword />
    // <ChangePassword />
  );
};

export default App;
