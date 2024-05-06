import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true
})

const useAxios = () => {
    const { logOut } = useContext(AuthContext)
    const navigate = useNavigate()
    useEffect(() => {
        axios.interceptors.request.use(res => {
            return res
        }, err => {
            console.log('error token', err.response);
            if (err.response.status) {
                logOut()
                navigate('/login')
            }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return axiosSecure;
};

export default useAxios;