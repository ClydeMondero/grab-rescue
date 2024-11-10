import { createContext, useState } from "react";

export const RequestContext = createContext();

export const RequestProvider = ({ children }) => {
  const [requesting, setRequesting] = useState(false);

  return (
    <RequestContext.Provider value={{ requesting, setRequesting }}>
      {children}
    </RequestContext.Provider>
  );
};
