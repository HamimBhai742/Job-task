import axios from 'axios';
const axiosSucre = axios.create({
    baseURL: 'https://jobs-task-01-server.vercel.app'
})
const useAxiosSecure = () => {
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
        console.log(status);
        if (status === 401 || status === 403) {
            // console.log('Bangladesh');
            // localStorage.removeItem('token')
            // localStorage.removeItem('access-token')
            // localStorage.removeItem('email')
            // navigate('/login')
        }
        return Promise.reject(error);
    })
    return axiosSucre
};

export default useAxiosSecure;