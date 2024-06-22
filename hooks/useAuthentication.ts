import React from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

const auth = getAuth();

export function useAuthentication() {
  const [user, setUser] = React.useState<User>();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        //User is signed in

        setUser(user);
      } else {
        //User is signed out

        setUser(undefined);
      }
    });

    return unsubscribe;
  }, []);

  return {
    user,
  };
}
