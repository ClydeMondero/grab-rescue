import logo from "../assets/logo.png";

const Nav = ({ navigate }) => {
  return (
    <div className="hidden lg:h-[10%] bg-accent text-white shadow-lg px-4 py-2 lg:flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img
          src={logo}
          alt="logo"
          className="h-12 text-primary cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>
      <ul className="space-x-4 flex items-center justify-center">
        <li>
          <p
            className="text-lg font-semibold cursor-pointer text-text-primary"
            onClick={() => navigate("/about")}
          >
            About
          </p>
        </li>
        <li>
          <p
            className="text-lg font-semibold cursor-pointer text-text-primary"
            onClick={() => navigate("/download")}
          >
            Download
          </p>
        </li>
        <li
          onClick={() => navigate("/login?role=Rescuer")}
          className="cursor-pointer text-text-primary border-primary border-[2px] px-4 py-2 rounded-md hover:opacity-80"
        >
          <p className="text-primary text-md font-semibold">Login as Rescuer</p>
        </li>
        <li
          onClick={() => navigate("/login?role=Admin")}
          className="cursor-pointer border-[2px] border-primary px-4 py-2 rounded-md hover:opacity-80"
        >
          <p className="text-primary text-md font-semibold">Login as Admin</p>
        </li>
      </ul>
    </div>
  );
};

export default Nav;
