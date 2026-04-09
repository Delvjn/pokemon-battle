import axios from "axios"

const API_BASE_URL = 'https://pokeapi.co/api/v2'

async function getById(id) {
    try {
        const response = await axios.get(`${API_BASE_URL}/pokemon/${id}`);

        return (
            response.data
        )
    } catch (error) {
        console.error('Failed to load:', error)
        return null
    }
}

export { getById }