 /**
 * DỰ ÁN QUẢN LÝ NHÂN VIÊN
 */

// --- 1. LỚP ĐỐI TƯỢNG NHÂN VIÊN ---
function NhanVien(
  _taiKhoan, _hoTen, _email, _matKhau, _ngayLam, 
  _luongCB, _chucVu, _gioLam
) {
  this.taiKhoan = _taiKhoan;
  this.hoTen = _hoTen;
  this.email = _email;
  this.matKhau = _matKhau;
  this.ngayLam = _ngayLam;
  this.luongCB = _luongCB;
  this.chucVu = _chucVu;
  this.gioLam = _gioLam;
  this.tongLuong = 0;
  this.loaiNV = "";

  // Phương thức tính tổng lương
  this.tinhTongLuong = function () {
    if (this.chucVu === "Sếp") {
      this.tongLuong = this.luongCB * 3;
    } else if (this.chucVu === "Trưởng phòng") {
      this.tongLuong = this.luongCB * 2;
    } else {
      this.tongLuong = this.luongCB;
    }
  };

  // Phương thức xếp loại
  this.xepLoai = function () {
    if (this.gioLam >= 192) {
      this.loaiNV = "Xuất sắc";
    } else if (this.gioLam >= 176) {
      this.loaiNV = "Giỏi";
    } else if (this.gioLam >= 160) {
      this.loaiNV = "Khá";
    } else {
      this.loaiNV = "Trung bình";
    }
  };
}

// --- 2. QUẢN LÝ DANH SÁCH ---
let dsnv = [];

// Hàm lấy thông tin từ Form
function layThongTinNV() {
  const tk = document.getElementById("tknv").value;
  const hoTen = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const matKhau = document.getElementById("password").value;
  const ngayLam = document.getElementById("datepicker").value;
  const luongCB = Number(document.getElementById("luongCB").value);
  const chucVu = document.getElementById("chucvu").value;
  const gioLam = Number(document.getElementById("gioLam").value);

  // Kiểm tra Validation
  let isValid = true;

  // Validation Tài khoản (4-6 ký số)
  isValid &= checkEmpty(tk, "tbTKNV", "Tài khoản không được để trống") && 
             checkLength(tk, "tbTKNV", 4, 6, "Tài khoản phải từ 4-6 ký số");

  // Validation Họ tên (Phải là chữ)
  isValid &= checkEmpty(hoTen, "tbTen", "Họ tên không được để trống") &&
             checkName(hoTen, "tbTen", "Họ tên phải là chữ");

  // Validation Email
  isValid &= checkEmpty(email, "tbEmail", "Email không được để trống") &&
             checkEmail(email, "tbEmail", "Email không đúng định dạng");

  // Validation Mật khẩu
  isValid &= checkEmpty(matKhau, "tbMatKhau", "Mật khẩu không được để trống") &&
             checkPassword(matKhau, "tbMatKhau");

  // Validation Ngày làm
  isValid &= checkEmpty(ngayLam, "tbNgay", "Ngày làm không được để trống");

  // Validation Lương cơ bản
  isValid &= checkEmpty(luongCB, "tbLuongCB", "Lương không được để trống") &&
             checkRange(luongCB, "tbLuongCB", 1000000, 20000000, "Lương từ 1tr - 20tr");

  // Validation Chức vụ
  isValid &= checkSelect("chucvu", "tbChucVu", "Vui lòng chọn chức vụ hợp lệ");

  // Validation Giờ làm
  isValid &= checkEmpty(gioLam, "tbGiolam", "Giờ làm không được để trống") &&
             checkRange(gioLam, "tbGiolam", 80, 200, "Giờ làm từ 80 - 200 giờ");

  if (isValid) {
    let nv = new NhanVien(tk, hoTen, email, matKhau, ngayLam, luongCB, chucVu, gioLam);
    nv.tinhTongLuong();
    nv.xepLoai();
    return nv;
  }
  return null;
}

// In danh sách ra Table
function renderTable(array) {
  let content = "";
  array.forEach((nv) => {
    content += `
      <tr>
        <td>${nv.taiKhoan}</td>
        <td>${nv.hoTen}</td>
        <td>${nv.email}</td>
        <td>${nv.ngayLam}</td>
        <td>${nv.chucVu}</td>
        <td>${nv.tongLuong.toLocaleString()} VNĐ</td>
        <td>${nv.loaiNV}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editNV('${nv.taiKhoan}')" data-toggle="modal" data-target="#myModal">Sửa</button>
          <button class="btn btn-danger btn-sm" onclick="deleteNV('${nv.taiKhoan}')">Xóa</button>
        </td>
      </tr>
    `;
  });
  document.getElementById("tableDanhSach").innerHTML = content;
}

// --- 3. CÁC CHỨC NĂNG CHÍNH ---

// Thêm Nhân Viên
document.getElementById("btnThemNV").onclick = function() {
    let nv = layThongTinNV();
    if(nv) {
        dsnv.push(nv);
        renderTable(dsnv);
        alert("Thêm thành công!");
    }
}

// Xóa Nhân Viên
function deleteNV(tk) {
    dsnv = dsnv.filter(nv => nv.taiKhoan !== tk);
    renderTable(dsnv);
}

// Sửa Nhân Viên (Đổ dữ liệu lên form)
function editNV(tk) {
    let nv = dsnv.find(item => item.taiKhoan === tk);
    if(nv) {
        document.getElementById("tknv").value = nv.taiKhoan;
        document.getElementById("tknv").disabled = true; // Không cho sửa tài khoản
        document.getElementById("name").value = nv.hoTen;
        document.getElementById("email").value = nv.email;
        document.getElementById("password").value = nv.matKhau;
        document.getElementById("datepicker").value = nv.ngayLam;
        document.getElementById("luongCB").value = nv.luongCB;
        document.getElementById("chucvu").value = nv.chucVu;
        document.getElementById("gioLam").value = nv.gioLam;
    }
}

// Cập nhật Nhân Viên
document.getElementById("btnCapNhat").onclick = function() {
    let nvMoi = layThongTinNV();
    if(nvMoi) {
        let index = dsnv.findIndex(item => item.taiKhoan === nvMoi.taiKhoan);
        if(index !== -1) {
            dsnv[index] = nvMoi;
            renderTable(dsnv);
            alert("Cập nhật thành công!");
            document.getElementById("tknv").disabled = false;
        }
    }
}

// Tìm kiếm theo loại (Xếp loại)
document.getElementById("btnTimNV").onclick = function() {
    let tuKhoa = document.getElementById("searchName").value.toLowerCase().trim();
    let dskq = dsnv.filter(nv => nv.loaiNV.toLowerCase().includes(tuKhoa));
    renderTable(dskq);
}

// --- 4. HELPER VALIDATION ---
function checkEmpty(val, spanId, mess) {
  if (val === "" || val === 0) {
    document.getElementById(spanId).innerHTML = mess;
    document.getElementById(spanId).style.display = "block";
    return false;
  }
  document.getElementById(spanId).innerHTML = "";
  return true;
}

function checkLength(val, spanId, min, max, mess) {
  if (val.length < min || val.length > max) {
    document.getElementById(spanId).innerHTML = mess;
    document.getElementById(spanId).style.display = "block";
    return false;
  }
  return true;
}

function checkName(val, spanId, mess) {
    const pattern = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỵỷỹýỳỹ \s]+$/;
    if(pattern.test(val)) return true;
    document.getElementById(spanId).innerHTML = mess;
    document.getElementById(spanId).style.display = "block";
    return false;
}

function checkEmail(val, spanId, mess) {
    const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(pattern.test(val)) return true;
    document.getElementById(spanId).innerHTML = mess;
    document.getElementById(spanId).style.display = "block";
    return false;
}

function checkPassword(val, spanId) {
    const pattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,10}$/;
    if(pattern.test(val)) return true;
    document.getElementById(spanId).innerHTML = "Mật khẩu 6-10 ký tự, ít nhất 1 số, 1 hoa, 1 ký tự đặc biệt";
    document.getElementById(spanId).style.display = "block";
    return false;
}

function checkRange(val, spanId, min, max, mess) {
    if(val >= min && val <= max) return true;
    document.getElementById(spanId).innerHTML = mess;
    document.getElementById(spanId).style.display = "block";
    return false;
}

function checkSelect(id, spanId, mess) {
    if(document.getElementById(id).selectedIndex !== 0) return true;
    document.getElementById(spanId).innerHTML = mess;
    document.getElementById(spanId).style.display = "block";
    return false;
}
