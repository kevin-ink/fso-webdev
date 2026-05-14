import axios from 'axios'
const baseUrl = '/api/users'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getBlogsByUsername = async username => {
  const response = await axios.get(`${baseUrl}/${username}/blogs`)
  return response.data
}

export default { getAll, getBlogsByUsername }
