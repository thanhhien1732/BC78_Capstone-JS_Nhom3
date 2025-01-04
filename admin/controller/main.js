import Product from '../model/product.js'

import api from '../services/api.js'

import Validation from '../model/validation.js'

// create new object from class Validation
const validation = new Validation()

export const getEleId = id => document.getElementById(id)

const getInfoProduct = isAdd => {
  const id = getEleId('idSP').value
  const name = getEleId('TenSP').value
  const price = getEleId('GiaSP').value
  const imageUrl = getEleId('HinhSP').value
  const description = getEleId('MoTa').value

  const product = new Product(id, name, price, imageUrl, description)

  // Check validation
  // nếu true thì cho phép thêm sản phẩm
  // nếu false thì không cho phép thêm sản phẩm
  let isValid = true

  if (isAdd) {
    // productID
    isValid &= validation.checkempty(
      product.id,
      'invalidID',
      'Vui lòng nhập ID sản phẩm'
    )
  }

  // productName
  isValid &= validation.checkempty(
    product.name,
    'invalidTen',
    'Vui lòng nhập tên sản phẩm'
  )
  // &&
  // validation.checkCharacterString(
  //   foodName,
  //   'invalidTen',
  //   'Please input character string'
  // )

  // productPrice
  isValid &= validation.checkempty(
    product.price,
    'invalidPrice',
    'Vui lòng nhập giá sản phẩm'
  )

  // product description
  isValid &= validation.checkempty(
    product.description,
    'invalidDes',
    'Vui lòng nhập mô tả sản phẩm'
  )

  // product image
  isValid &= validation.checkempty(
    product.imageUrl,
    'invalidImg',
    'Vui lòng nhập hình ảnh sản phẩm'
  )

  //   // foodType
  //   isValid &= validation.checkSelect(
  //     'loai',
  //     'invalidLoai',
  //     'Please input food type'
  //   )
  //   // foodDiscount
  //   isValid &= validation.checkSelect(
  //     '10 || 20',
  //     'invalidKhuyenMai',
  //     'Please input food discount'
  //   )

  //   // description
  //   isValid &= validation.checkempty(
  //     foodDescription,
  //     'invalidMoTa',
  //     'Please input food description'
  //   )

  // Tình hướng phủ định này là không thêm sản phẩm
  if (!isValid) return null

  return product
}

const renderListProduct = data => {
  let content = ''

  data.forEach((product, i) => {
    content += `
            <tr>
                <td>${product.id}</td>
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

getEleId('btnThemSP').onclick = () => {
  // updata title
  getEleId('exampleModalLabel').innerHTML = 'Thêm Sản Phẩm'

  // reset value
  getEleId('form-product').reset()

  // none button update
  getEleId('btnupdate').style.display = 'none'

  // create button add
  const btnAdd = `<button class="btn btn-success" id="handleAdd" onclick="handleAdd()">Thêm</button>`
  document.getElementsByClassName('modal-footer')[0].innerHTML = btnAdd

  // show button add
  getEleId('handleAdd').style.display = 'block'

  // mở khóa input id
  getEleId('idSP').removeAttribute('disabled')
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
      getEleId('idSP').setAttribute('disabled', true)
      getEleId('TenSP').value = data.name
      getEleId('GiaSP').value = data.price
      getEleId('HinhSP').value = data.imageUrl
      getEleId('MoTa').value = data.description
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
  const product = getInfoProduct(false)

  // check product
  if (!product) return

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
const handleAdd = () => {
  // lấy thông tin sản phẩm
  const product = getInfoProduct(true)

  if (!product) {
    return
  }

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

/**
 * TÌM KIẾM SẢN PHẨM
 */
getEleId('search').addEventListener('keyup', function () {
  // Lấy giá trị từ ô input
  const keyword = getEleId('search').value

  // tạo mảng result = []
  let result = []
  // Duyệt qua mảng arr
  // 1. Duyệt qua mảng arr
  // 1.1 product = arr[i]
  // 1.2 Nếu product.name trùng vs keyword thì thêm product vào result
  // 2. trả về result
  const promise = api.fetchData()
  promise
    .then(result => {
      result = result.data
      let content = ''
      result.forEach((product, i) => {
        // chuyển keyword và food.name về chữ thường
        const keywordLowercase = keyword.toLowerCase()
        const productNameLowercase = product.name.toLowerCase()

        if (productNameLowercase.indexOf(keywordLowercase) !== -1) {
          content += `
                    <tr>
                        <td>${product.id}</td>
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
        }
      })
      getEleId('tblDanhSachSP').innerHTML = content
    })
    .catch(error => {
      console.log(error)
    })
})

/**
 * SẮP XẾP SẢN PHẨM THEO GIÁ
 */

getEleId('selLoai').addEventListener('change', function () {
  const value = getEleId('selLoai').value

  const promise = api.fetchData()
  promise
    .then(result => {
      result = result.data
      let content = ''
      if (value === 'small') {
        result.sort((a, b) => {
          return a.price - b.price
        })
      } else if (value === 'big') {
        result.sort((a, b) => {
          return b.price - a.price
        })
      } else if (value === 'default') {
        result.sort((a, b) => {
          return a.id - b.id
        })
      }

      result.forEach((product, i) => {
        content += `
                    <tr>
                        <td>${product.id}</td>
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
    })
    .catch(error => {
      console.log(error)
    })
})
