import axios from "axios"

const BASE_URL='https://v-ai-venkats-projects-88e781aa.vercel.app/api'
const api=axios.create({
    baseURL:BASE_URL,

})

export default api;