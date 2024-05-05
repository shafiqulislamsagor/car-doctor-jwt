import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import app from "../firebase/firebase.config";
import axios from 'axios'

export const AuthContext = createContext();
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            const UserEmail = currentUser?.email || user?.email
            const UserLogged = {email:UserEmail}
            setUser(currentUser);
            console.log('current user', currentUser);
            setLoading(false);
            if(currentUser){
                // console.log(UserLogged);
                try{
                    axios.post('http://localhost:5000/jwt',UserLogged,{withCredentials:true})
                .then(res=> {
                    console.log(res.data);
                })
                }
                catch(error){
                    console.log('not work jwt server post',error.message);
                }
            }else{
                try{
                    axios.post('http://localhost:5000/logout',UserLogged,{withCredentials:true})
                    .then(res=>{
                        console.log(res.data);
                    })
                }
                catch(error){
                    console.log(error.message);
                }
            }
        });
        return () => {
            return unsubscribe();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const authInfo = {
        user,
        loading,
        createUser, 
        signIn, 
        logOut
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;