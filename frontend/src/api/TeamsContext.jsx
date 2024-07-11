// import { createContext, useEffect, useState } from "react";
// import Cookies from 'js-cookie';
// import axios from "axios";

// export const teamContext = createContext(null);

// export const TeamProvider = (props) => {
//     const [teams, setTeams] = useState([]);

//     useEffect(() => {
//         const userId = localStorage.getItem('userId'); 
//         const fetchTeams = async () => {
//             try {
//                 const response = await axios.get(`https://collab-app-backend.onrender.com/team/userTeams/${userId}`);
//                 setTeams(response.data);
//             } catch (error) {
//                 console.error('Error fetching teams:', error);
//             }
//         };

//         fetchTeams();
//     }, []);

//     return (
//         <teamContext.Provider value={{teams, setTeams}}>
//             {props.children}
//         </teamContext.Provider>
//     );
// };

import { createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";

export const teamContext = createContext(null);

export const TeamProvider = (props) => {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const userId = Cookies.get('userId'); // Fetch userId from cookie

        const fetchTeams = async () => {
            try {
                const response = await axios.get(`https://collab-app-backend.onrender.com/team/userTeams/${userId}`);
                setTeams(response.data);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        if (userId) {
            fetchTeams();
        }
    }, []);

    return (
        <teamContext.Provider value={{teams, setTeams}}>
            {props.children}
        </teamContext.Provider>
    );
};
