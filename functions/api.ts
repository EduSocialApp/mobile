import Axios from 'axios'

export const apiAxios = Axios.create({
    baseURL: 'http://192.168.1.109:3000'
})