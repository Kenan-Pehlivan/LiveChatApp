import React, { Children, useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Auth from "./pages/auth";
import Profile from './pages/profile';
import Chat from './pages/chat';
import { useAppStore } from './store';
import { apiClient } from './lib/api-client';
import { GET_USER_INFO } from './utils/constants';

//Wenn der User nicht eingeloggt ist oder die Registrierung vollständig abgeschlossen hat, wird er zum Auth Seite weitegeleitet
const PrivateRoute = ({children}) => {
  const {userInfo} = useAppStore();
  const isAuthenicated = !!userInfo;
  return isAuthenicated ? children : <Navigate to="/auth" />;
};

//Wenn der User eingeloggt ist wird er zum Chat Seite weitergeleitet und darf nicht auf der Auth zurück kehren
const AuthRoute = ({children}) => {
  const {userInfo} = useAppStore();
  const isAuthenicated = !!userInfo;
  return isAuthenicated ? <Navigate to="/chat" /> : children;
};

const App = () => {
  const {userInfo, setUserInfo} = useAppStore();
  const [loading, setLoading] = useState(true);
  //Beim wieder Laden der Seit die User Daten holen?????
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {withCredentials:true});
        if(response.status===200 && response.data.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        } 
        console.log({response});
      } catch (error) {
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };
    if (!userInfo){
      getUserData();
    } else {
      setLoading(false);
    }

  }, [userInfo, setUserInfo]);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    //Routen für die Seiten unserer Webseite
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>}/>
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>}/>
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>}/>
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;