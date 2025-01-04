import Product from '../model/product.js'

import api from '../services/api.js'

const getEleId = id => document.getElementById(id)

const getInfoProduct = isAdd => {
  const id = getEleId('idSP').value
  const name = getEleId('TenSP').value
  const price = getEleId('GiaSP').value
  const imageUrl = getEleId('HinhSP').value
  const description = getEleId('MoTa').value

  const product = new Product(id, name, price, imageUrl, description)

  let isValid = true

  if (isAdd) {
    if (name === '') {
      isValid = false
      alert('Tên sản phẩm không được để trống!')
    }

    if (price === '') {
      isValid = false
      alert('Giá sản phẩm không được để trống!')
    }

    if (imageUrl === '') {
      isValid = false
      alert('Hình ảnh sản phẩm không được để trống!')
    }

    if (description === '') {
      isValid = false
      alert('Mô tả sản phẩm không được để trống!')
    }
  }
  return product
}

const renderListProduct = data => {
  let content = ''

  data.forEach((product, i) => {
    content += `
            <tr>
                <td>${i + 1}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>
                    <img src="./../../assets/img/${product.imageUrl}" width="50" />
                </td>
                <td>${product.description}</td>
                <td>
                    <button class="btn btn-info" data-bs-toggle="modal" data-bs-target="#myModal" onclick="handleEdit('${product.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="handleDelete('${product.id}')">Delete</button>
                </td>
            </tr>
        `
  })

  getEleId('tblDanhSachSP').innerHTML = content
}

/**
 * Sửa sản phẩm
 */
const handleEdit = id => {
  // update title
  getEleId('exampleModalLabel').innerHTML = 'Cập Nhật Sản Phẩm'

  // none button add
  getEleId('handleAdd').style.display = 'none'

  // tạo button update
  const btnUpdate = `<button class="btn btn-success" id="btnupdate" onclick="handleUpdate(${id})">Update</button>`
  document.getElementsByClassName('modal-footer')[0].innerHTML = btnUpdate

  // call api get product by id
  const promise = api.getDataById(id)
  promise
    .then(result => {
      const { data } = result
      // dom tới các thẻ input gán value
      getEleId('idSP').value = data.id
      getEleId('TenSP').value = data.name
      getEleId('GiaSP').value = data.price
      getEleId('MoTa').value = data.description
      getEleId('HinhSP').value = data.imageUrl
    })
    .catch(error => {
      console.log(error)
    })
}
window.handleEdit = handleEdit

/**
 * Cập nhật sản phẩm
 */
const handleUpdate = id => {
  const product = getInfoProduct()

  // call api update product
  const promise = api.updateData(product)

  promise
    .then(result => {
      alert('Cập nhật sản phẩm thành công!')

      getListProduct()

      // close modal
      document.getElementsByClassName('btn-close')[0].click()
    })
    .catch(error => {
      console.log(error)
    })
}
window.handleUpdate = handleUpdate

/**
 * Xóa sản phẩm
 */
const handleDelete = id => {
  const promise = api.deleteData(id)

  promise
    .then(result => {
      alert('Xóa sản phẩm thành công!')

      getListProduct()
    })
    .catch(error => {
      console.log(error)
    })
}
window.handleDelete = handleDelete

/**
 * LẤY DỮ LIỆU TỪ API
 */
const getListProduct = () => {
  const promise = api.fetchData()

  promise
    .then(result => {
      renderListProduct(result.data)
    })
    .catch(error => {
      console.log(error)
    })
}

getListProduct()

/**
 * THÊM SẢN PHẨM MỚI
 */
getEleId('handleAdd').onclick = () => {
  // lấy thông tin sản phẩm
  const product = getInfoProduct()

  // call api thêm sản phẩm
  const promise = api.addData(product)

  promise
    .then(result => {
      // hiện popup thông báo thành công.
      alert('Thêm sản phẩm thành công!')

      // render list product
      getListProduct()

      // close modal
      document.getElementsByClassName('btn-close')[0].click()
    })
    .catch(error => {
      console.log(error)
    })
}
window.handleAdd = handleAdd
