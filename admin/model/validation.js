import { getEleId } from '../controller/main.js'

class Validation {
  checkempty (value, divId, mess) {
    if (value === '') {
      getEleId(divId).innerHTML = mess
      getEleId(divId).style.display = 'block'
      return false
      // false là không cho phép thêm sản phẩm
    } else {
      getEleId(divId).innerHTML = ''
      getEleId(divId).style.display = 'none'
      return true
    }
  }
}

export default Validation
