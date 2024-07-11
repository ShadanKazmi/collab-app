// import React, { createContext, useEffect, useState } from "react";
// import Cookies from 'js-cookie';
// import axios from "axios";

// export const authContext = createContext(null);

// export const AuthProvider = (props) => {
//     const [userState, setUserState] = useState('Logged-Out');
//     const [token, setToken] = useState(Cookies.get("token"));
//     const [user, setUser] = useState(null);
//     useEffect(() => {
//         const token = Cookies.get("token");
//         const userId = Cookies.get("userId");
//         if (token && userId) {
//             setUserState("Logged-In");
//             setToken(token);
//             fetchUserDetails(userId);
//         }
//     }, []);

//     const fetchUserDetails = async (userId) => {
//         try {
//             const response = await axios.get(`https://collab-app-backend.onrender.com/userAuth/${userId}`);
//             const userData = response.data;
//             setUser(userData);
            
//         } catch (error) {
//             console.error('Error fetching user details:', error);
//         }
//     };

//     const login = (newToken, userData) => {
//         if (newToken && userData) {
//             setToken(newToken);
//             setUser(userData);
//             setUserState("Logged-In");
//             Cookies.set("token", newToken, { expires: 7 });
//             Cookies.set("userId", userData.userId, { expires: 7 });
//         } else {
//             console.log("No valid token or user data provided for login.");
//         }
//     };

//     const logout = () => {
//         setToken(null);
//         setUser(null);
//         setUserState('Logged-Out');
//         Cookies.remove("token");
//         Cookies.remove("userId");
//     };
//     console.log(userState);
//     return (
//         <authContext.Provider value={{ userState, setUserState, token, user, login, logout }}>
//             {props.children}
//         </authContext.Provider>
//     );
// };

import React, { createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";

export const authContext = createContext(null);

export const AuthProvider = (props) => {
    const [userState, setUserState] = useState('Logged-Out');
    const [token, setToken] = useState(Cookies.get("token"));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const token = Cookies.get("token");
        const userId = Cookies.get("userId");
        if (token && userId) {
            setUserState("Logged-In");
            setToken(token);
            fetchUserDetails(userId);
        } else {
            setLoading(false); // Set loading to false if no token or userId
        }
    }, []);

    const fetchUserDetails = async (userId) => {
        try {
            const response = await axios.get(`https://collab-app-backend.onrender.com/userAuth/${userId}`);
            const userData = response.data;
            setUser(userData);
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching user details
        }
    };

    const login = (newToken, userData) => {
        if (newToken && userData) {
            setToken(newToken);
            setUser(userData);
            setUserState("Logged-In");
            Cookies.set("token", newToken, { expires: 7 });
            Cookies.set("userId", userData.userId, { expires: 7 });
        } else {
            console.log("No valid token or user data provided for login.");
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setUserState('Logged-Out');
        Cookies.remove("token");
        Cookies.remove("userId");
    };

    return (
        <authContext.Provider value={{ userState, setUserState, token, user, login, logout, loading }}>
            {props.children}
        </authContext.Provider>
    );
};
