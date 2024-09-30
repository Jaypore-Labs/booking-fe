import React, { createContext, useState, useContext } from "react";
import { useSelector } from "react-redux";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // const [userRole, setUserRole] = useState("admin"); // admin , manager , user
    const { user } = useSelector((state) => state.user);
    const userRole = user?.role || "user";
    return (
        <UserContext.Provider value={{ userRole }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
