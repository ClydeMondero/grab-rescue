import { ToastContainer, toast } from "react-toastify";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const contextClass = {
  success: "bg-green-500 text-green-100",
  error: "bg-red-400 text-red-100",
  info: "bg-blue-400 text-blue-100",
  warning: "bg-orange-400 text-yellow-100",
  default: "bg-gray-500 text-gray-100",
  dark: "bg-black text-gray-500",
};

const iconTypes = {
  success: <FaCheckCircle />,
  error: <FaExclamationCircle />,
  info: <FaInfoCircle />,
  warning: <FaExclamationTriangle />,
  default: <FaInfoCircle />,
};

const Toast = ({ position = "bottom-left" }) => (
  <ToastContainer
    toastClassName={({ type }) =>
      `${
        contextClass[type || "default"]
      } relative flex items-center p-3 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer`
    }
    bodyClassName="flex items-center text-sm font-medium"
    position={position}
    icon={({ type }) => iconTypes[type || "default"]}
  />
);

export default Toast;
