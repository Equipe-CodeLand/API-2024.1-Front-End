import axios from "axios"
import { useAuth } from "./useAuth"
import { useState } from "react"

export const useAxios = () => {
    const { getToken } = useAuth()
    const [loading, setLoading] = useState(true)

    const client = axios.create({
        baseURL: "http://localhost:8080",
        headers: { "Authorization": `Bearer ${getToken()}`}
    })

    const get = (url: string, config?: any) => {
        return client.get(url, config)
    }
    const post = (url: string, body: any, config?: any) => {
        return client.post(url, body, config)
    }
    const put = (url: string, body: any, config?:any) => {
        return client.put(url, body, config)
    }
    const deletar = (url: string, config?:any) => {
        return client.delete(url)
    }

    return { get, post, loading, setLoading, put, deletar }
}