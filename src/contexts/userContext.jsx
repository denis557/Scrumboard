import React, { useState, createContext } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [userInfo, setUserInfo] = useState(null);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};




// const UserContext = createContext();
// const updateUserContext = createContext();

// export function useUser() {
//     return useContext(UserContext);
// }

// export function UserProvider({ children }) {
//     const [userInfo, setUserInfo] = useState(null);

//     const navigate = useNavigate();

//     const getUserInfo = async () => {
//         try {
//             const response = await axiosInstance.get('/get-user');
//             if(response.data && response.data.user) {
//                 setUserInfo(response.data.user);
//             }
//         } catch (error) {
//             if(error.response.status === 401) {
//                 localStorage.clear();
//                 navigate('/login');
//             }
//         }
//     };

//     useEffect(() => {
//         getUserInfo();
//         return () => {};
//     }, []);

//     return(
//         <UserContext.Provider value={userInfo}>
//             {children}
//         </UserContext.Provider>
//     )
// }