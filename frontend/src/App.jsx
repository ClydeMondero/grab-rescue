import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IncomingRequests from './components/IncomingRequests';
import AssignRescuers from './components/AssignRescuers'; 
import OngoingRescues from './components/OngoingRescues';  
import GenerateReports from './components/GenerateReports'; 
import Settings from './components/Settings';  
import ViewProfile from './components/ViewProfile';  
import ChangePassword from './components/ChangePassword';  
import Sidebar from './components/Sidebar'

const App = () => {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/incomingRequests" element={<IncomingRequests />} />
            <Route path="/assignRescuer" element={<AssignRescuers />} />
            <Route path="/ongoingRescues" element={<OngoingRescues />} />
            <Route path="/generateReports" element={<GenerateReports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/viewProfile" element={<ViewProfile />} />
            <Route path="/changePassword" element={<ChangePassword />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
