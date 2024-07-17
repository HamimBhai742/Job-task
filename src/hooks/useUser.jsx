import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from './useAxiosSecure';

const useUser = () => {
    const email = localStorage.getItem('email')
    const axiosSecure = useAxiosSecure()
    const { data: userData = [] } = useQuery({
        queryKey: [''],
        queryFn: async () => {
            const res = await axiosSecure.get(`/user?email=${email}`)
            return res.data
        }
    })
    return [userData]
};

export default useUser;