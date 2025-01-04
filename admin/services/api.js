class Api {
  fetchData () {
    const promise = axios({
      url: 'https://6766c856410f84999658928f.mockapi.io/api/Products',
      method: 'GET'
    })

    return promise
  }

  addData (product) {
    const promise = axios({
      url: `https://6766c856410f84999658928f.mockapi.io/api/Products`,
      method: 'POST',
      data: product
    })

    return promise
  }

  deleteData (id) {
    const promise = axios({
      url: `https://6766c856410f84999658928f.mockapi.io/api/Products/${id}`,
      method: 'DELETE'
    })

    return promise
  }

  updateData (product) {
    const promise = axios({
      url: `https://6766c856410f84999658928f.mockapi.io/api/Products/${product.id}`,
      method: 'PUT',
      data: product
    })

    return promise
  }

  getDataById (id) {
    const promise = axios({
      url: `https://6766c856410f84999658928f.mockapi.io/api/Products/${id}`,
      method: 'GET'
    })

    return promise
  }

  updateData (product) {
    const promise = axios({
      url: `https://6766c856410f84999658928f.mockapi.io/api/Products/${product.id}`,
      method: 'PUT',
      data: product
    })

    return promise
  }
}

export default new Api()
