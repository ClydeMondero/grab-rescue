import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Main, Admin, Rescuer, Citizen, Login} from "./pages/";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path='/login' element={<Login />}/>
          <Route path="/admin" element={<Admin />} />
          <Route path='/rescuer' element={<Rescuer />}/>
          <Route path='/citizen' element={<Citizen />}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;