import { useNavigate } from 'react-router-dom';

const Main = () => {
    const navigate = useNavigate();

  return (
    <div>
        <button onClick={() => navigate("/admin")}>Admin</button>
        <button onClick={ () =>navigate("/rescuer")}>Rescuer</button>
        <button onClick={() => navigate("/citizen")}>Citizen</button>
    </div>
  )
}
export default Main;
