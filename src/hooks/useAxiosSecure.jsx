import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
const axiosSucre = axios.create({
    baseURL: 'http://localhost:5000'
})
const useAxiosSecure = () => {
    const navigate = useNavigate()
    const logOut = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('access-token')
        localStorage.removeItem('email')
        navigate('/login')
    }
    axiosSucre.interceptors.request.use(function (config) {
        const token = localStorage.getItem('token')
        config.headers.authorization = `${token}`
        return config
    }, function (error) {
        return Promise.reject(error)
    })

    axiosSucre.interceptors.response.use(function (response) {
        // console.log(response);
        return response
    }, async (error) => {
        const status = error?.response?.status
        // console.log(status);
        if (status === 401 || status === 403) {
            // console.log('Bangladesh');
            await logOut()
            // navigate('/login')
        }
        return Promise.reject(error);
    })
    return axiosSucre
};

export default useAxiosSecure;