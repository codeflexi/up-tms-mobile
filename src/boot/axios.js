import { boot } from 'quasar/wrappers'
import axios from 'axios'

const server = axios.create({ baseURL: 'http://localhost:5000' })
// server.defaults.withCredentials = true

// axios.defaults.withCredentials = true;
const axiosOpenCharge = axios.create({ baseURL: 'https://api.openchargemap.io/v3/poi/' })

// Authorization: options.token ? `Bearer ${options.token}` : '',

if (localStorage.getItem('token')) {
    server.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem('token');
} else {
    server.defaults.headers.common.Authorization = 'Bearer ' + ''
}

export default boot(({ app }) => {
    app.config.globalProperties.$axios = axios
    app.config.globalProperties.$axiosOpenCharge = axiosOpenCharge
    app.config.globalProperties.$server = server
})

export { server, axios, axiosOpenCharge }
