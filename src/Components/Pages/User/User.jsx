import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
const User = () => {
    const token = localStorage.getItem('token')
    console.log(token);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post('http://localhost:5000/post', {
                    name: 'bangla'
                })
                console.log(res.data);
            }
            catch (err) {
                console.log('err', err);
            }
        }
        fetchData()
    }, [])
    // const { isLoading, error, data: repoData = [] } = useQuery({
    //     queryKey: ['repoData'],
    //     queryFn: async () => {
    //         const res = await axios.get(`http://localhost:5000/post`, {
    //             headers: {
    //                 Authorization: token
    //             }

    //         })
    //         return res.data
    //         // console.log();
    //     }
    // })
    // console.log(repoData);
    return (

        <div>
            <p>User</p>
        </div>
    );
};

export default User;