import { useEffect, useState } from "react";
import { useContext } from "react";
import { createContext } from "react";

// Config firebase.
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(false);

  // Check si user está activo
  useEffect(() => {
    // observable por firebase 👇
    const unsuscribe = onAuthStateChanged(auth, (user) => {
      console.log(user);
      setUser(user);
    });
    return unsuscribe;
  }, []);

  // Cuando inicia la aplicación siempre el user estará false
  // Pero al terminar el useEffect, el user podrá ser null o un objeto
  if (user === false) return <p>Loading App...</p>;

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
