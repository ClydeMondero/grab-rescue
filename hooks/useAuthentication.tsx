import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth"

//get auth hook 
const auth = getAuth();

export function useAuthentication() {
    //create user state
    const [user, setUser] = useState<User>();

    useEffect(() => {
        //check user status
        const unsuscribed = onAuthStateChanged(auth, (user) => {
            if (user) {
                //user is signed in

                setUser(user)
            } else {
                //user is not signed in
                setUser(undefined)
            }
        })

        return unsuscribed
    }, [])


    return {
        user
    };
}
