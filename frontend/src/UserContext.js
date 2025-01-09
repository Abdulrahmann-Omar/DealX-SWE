import React, { createContext, useState, useContext } from 'react';

// Create Context for User
const UserContext = createContext();

// Custom hook to use UserContext
export const useUser = () => {
return useContext(UserContext);
};

// Provider component to wrap your app and provide user data
export const UserProvider = ({ children }) => {
const [user, setUser] = useState(null);

// Set user data in context
const login = (userData) => {
setUser(userData);
localStorage.setItem('user', JSON.stringify(userData)); // Optionally store it in localStorage
};

const logout = () => {
setUser(null);
localStorage.removeItem('user');
};

return (
<UserContext.Provider value={{ user, login, logout }}>
    {children}
</UserContext.Provider>
);
};
