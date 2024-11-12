import { Nav } from "../components";
import { useNavigate } from "react-router-dom";

const AdminTutorial = () => {
  const navigate = useNavigate();

  return (
    <>
      <Nav navigate={navigate} />
      Admin Tutorial
    </>
  );
};

export default AdminTutorial;
