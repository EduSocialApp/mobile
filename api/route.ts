import Axios from 'axios'

export const apiAxios = Axios.create({
    baseURL: 'http://localhost:3000',
})
