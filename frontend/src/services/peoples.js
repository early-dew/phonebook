import axios from 'axios'
// const baseUrl = 'http://localhost:3001/api/persons/'
const baseUrl = 'https://phonebook-backend-zdpi.onrender.com'
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const remove = (id) => {
  return axios
    .delete(`${baseUrl}/${id}`)
    .then(response => {
      const returnedData = response.data
    })
}

const update = (id, newObject) => {
  return axios
    .put(`${baseUrl}/${id}`, newObject)
    .then(response => response.data)
}

export default { getAll, create, remove, update }