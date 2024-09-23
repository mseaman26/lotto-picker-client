import { createContext , useState, useEffect} from "react";
import Auth from "./auth";
import { getUserById, refreshTokenAPI } from './apiHelpers'
//import socket.io-client

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [accesToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);


    useEffect(() => {
        const savedAccessToken = JSON.parse(localStorage.getItem('accessToken'));
        const savedRefreshToken = JSON.parse(localStorage.getItem('refreshToken'));
        if(savedAccessToken){
            setAccessToken(savedAccessToken);
            setRefreshToken(savedRefreshToken);
        }
    }, [])

    useEffect(() => {
        if(accesToken ){
            if(!Auth.isTokenExpired(accesToken)){
                Auth.login(accesToken, refreshToken);
                getUserById(Auth.getProfile().user_id)
                .then(data => {
                    setUser(data);
                })
                .catch(err => {
                    console.log('error', err);
                })
                .finally(() => {
                    setAuthLoading(false);
                })
            }
            else{
                //if access token is expired, call refresh token api
                refreshTokenAPI(refreshToken)
                .then(data => {
                    Auth.login(data.accessToken, data.refreshToken);
                    setAccessToken(data.access);
                    setRefreshToken(data.refresh);
                    Auth.login(data.accessToken, data.refreshToken);
                    getUserById(Auth.getProfile().user_id)
                    .then(data => {
                        setUser(data);
                    })
                    .catch(err => {
                        console.log('error', err);
                    })
                    .finally(() => {
                        setAuthLoading(false);
                    })
                })
                .catch(err => {
                    console.log('error', err);
                })
            } 
        }
    }, [accesToken])

    return (
        <AuthContext.Provider value={{ user, setUser, accesToken, setAccessToken, setRefreshToken, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

