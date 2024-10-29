

import { getCurrentUser } from "@/lib/appwrite";
import { createContext, useContext, useState, useEffect, PropsWithChildren } from "react";

type ContextState = {
    isLoggedIn: boolean,
    setIsLoggedIn(value: boolean): void,
    user: any,
    setUser(value: any): void
    isLoading: boolean
    setIsLoading(value: boolean): void
}

const GlobalContext = createContext<ContextState | undefined>(undefined);

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobalContext must be used within a GlobalProvider");
    }
    return context;
};

const GlobalProvider = ({children}:PropsWithChildren)=> {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<null | any>(null);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=> {

        getCurrentUser().then((res)=> {
            if(res){
                setIsLoggedIn(true)
                setUser(res)
            } else {
                setIsLoggedIn(false)
                setUser(null)
            }

        })
        .catch((err)=>console.log(err))
        .finally(()=> setIsLoading(false))

    },[])

    return (
        <GlobalContext.Provider
            value={{
                isLoading, setIsLoading,
                user, setUser,
                isLoggedIn, setIsLoggedIn
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider