function closeTerms() {
    document.getElementById('layer-2').style.display = 'none';
};

function openTerms() {
    document.getElementById('layer-2').style.display = 'block';
};


async function loginFacebook() {
    var { value: accept } = await Swal.fire({
        title: "Vui lòng đăng nhập bằng Tài khoản iFresh của bạn hoặc Đăng nhập với Google",
        text: "Tính năng Đăng nhập bằng Facebook sẽ sớm được ra mắt!",
        icon: "success"
    });
};