function chooseTab(tabName) {
    var parentDiv = document.getElementById('tabs-header');
    var children = parentDiv.children;
    for (var i = 0; i < children.length; i++) {
        children[i].classList.remove('selected');
    };

    var parentDiv = document.getElementById('body-container');
    var children = parentDiv.children;
    for (var i = 0; i < children.length; i++) {
        children[i].style.display = 'none';
    }

    const selectedHeader = document.getElementById(tabName + '-tab');
    selectedHeader.classList.add('selected');

    const selectedTab = document.getElementById(tabName);
    selectedTab.style.display = 'block';
};


async function changeName() {
    var { value: formValues } = await Swal.fire({
        title: "Nhập tên mới của bạn:",
        html: `
        <input id="first-name-input" class="swal2-input" placeholder="Họ">
        <input id="last-name-input" class="swal2-input" placeholder="Tên">
        `,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: "Đổi tên",
        focusConfirm: false,
        preConfirm: () => {
            return {
                first_name: document.getElementById('first-name-input').value,
                last_name: document.getElementById('last-name-input').value
            };
        }
    });
    if (formValues) {
        fetch('/my-account/update-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formValues)
        })
        .then(response => response.json())
        .then(data => {
            if (data['status'] === 1) {
                Swal.fire({
                    title: 'Chúc mừng bạn đã đổi tên thành công!',
                    text: `${formValues['last_name']} ${formValues['first_name']}`,
                    icon: 'success'
                });
                document.getElementById('user-name-text').textContent = `${formValues['last_name']} ${formValues['first_name']}`;
            }
            else {
                Swal.fire({
                    title: 'Rất tiếc, có lỗi gì đó đã xảy ra...',
                    text: data['message'],
                    icon: 'error'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                title: 'Lỗi:',
                text: error,
                icon: 'error'
            });
        });
    }
};


function changeName_v1() {
    Swal.fire({
        title: "Nhập tên mới của bạn:",
        input: 'text',
        // inputValue: document.getElementById('user-name-text').innerText,
        // inputPlaceholder: 'Ví dụ: Xuân Thành - Trần',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Đổi tên',
        showLoaderOnConfirm: true,
        preConfirm: async (newName) => {
            try {
                const handleUrl = `
                    /my-account/change-name/?newName=${newName}
                `;
                const response = await fetch(handleUrl);
    
                if (!response.ok) {
                    return handleFailChangeName(newName, response.status, response.json());
                }
                return handleSuccessChangeName(newName, response.status, response.json());
            } catch (error) {
                handleErrorChangeName(error);
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    });
};

function handleErrorChangeName_v1(error) {
    console.log(error)
};

function handleFailChangeName_v1(userInput, responseStatus, responseBody) {
    Swal.fire({
        title: "Đổi tên chưa thành công!",
        text: '',
        icon: 'error',
        footer: '<a href="#">Why do I have this issue?</a>'
    });
};

function handleSuccessChangeName_v1(userInput, responseStatus, responseBody) {
    Swal.fire({
        title: "Đổi tên thành công!",
        text: 'Tên mới của bạn là: ' + userInput,
        icon: 'success'
    });
    const userName = document.getElementById('user-name-text');
    userName.textContent = userInput;
};



function handleAvatarImageUpload(event) {
    var file = event.target.files[0];
    var formData = new FormData();
    formData.append('avatar_image', file);

    if (file) {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn thay đổi ảnh đại diện này không ?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Có, hãy thay đổi!"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('/my-account/update-info/change-avatar', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data['status'] === 1) {
                        Swal.fire({
                            title: 'Chúc mừng!',
                            text: 'Ảnh đại diện của bạn đã được đổi thành công.',
                            icon: 'success'
                        });
                        document.getElementById('user-avatar-image').src = data['avatar_link'];
                    }
                    else {
                        Swal.fire({
                            title: 'Rất tiếc, có lỗi gì đó đã xảy ra...',
                            text: data['message'],
                            icon: 'error'
                        });
                    }
                })
                .catch(error => {
                    Swal.fire({
                        title: 'Lỗi:',
                        text: error,
                        icon: 'error'
                    });
                });
            }
        });
    }

    // else {
    //     Swal.fire({
    //         title: 'Không tìm thấy ảnh nào!',
    //         text: 'Bạn hãy chụp hoặc tải lên ảnh đại diện mới.',
    //         icon: 'error'
    //     });
    // }
};


function handleAvatarImageUpload_v1(event) {
    var file = event.target.files[0];

    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var base64ImageSource = e.target.result;
            updateAvatar(base64ImageSource);
        };

        reader.readAsDataURL(file);

    }

    else {
        Swal.fire({
            title: 'Không tìm thấy ảnh nào!',
            text: 'Bạn hãy chụp hoặc tải lên ảnh đại diện mới.',
            icon: 'error'
        });
    }
};

function updateAvatar(base64ImageSource) {
    if (base64ImageSource) {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn thay đổi ảnh đại diện này không ?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Có, hãy thay đổi!"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('/my-account/update-info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        avatar: base64ImageSource
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data['status'] === 1) {
                        Swal.fire({
                            title: 'Chúc mừng!',
                            text: 'Ảnh đại diện của bạn đã được đổi thành công.',
                            icon: 'success'
                        });
                        document.getElementById('user-avatar-image').src = base64ImageSource;
                    }
                    else {
                        Swal.fire({
                            title: 'Rất tiếc, có lỗi gì đó đã xảy ra...',
                            text: data['message'],
                            icon: 'error'
                        });
                    }
                })
                .catch(error => {
                    Swal.fire({
                        title: 'Lỗi:',
                        text: error,
                        icon: 'error'
                    });
                });
            }
        });
    }

    else {
        Swal.fire({
            title: 'Không tìm thấy ảnh nào!',
            text: 'Bạn hãy chụp hoặc tải lên ảnh đại diện mới.',
            icon: 'error'
        });
    }
};



async function updatePassword() {
    var { value: password } = await Swal.fire({
        title: "Đổi mật khẩu:",
        input: "password",
        inputPlaceholder: "Nhập mật khẩu mới của bạn",
        showCancelButton: true,
        inputAttributes: {
            maxlength: "255",
            autocapitalize: "off",
            autocorrect: "off"
        }
    });
    if (password) {
        fetch('/my-account/update-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data['status'] === 1) {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Mật khẩu của bạn đã được đổi, hãy nhớ kỹ mật khẩu mới này nhé.',
                    icon: 'success'
                });
            }
            else {
                Swal.fire({
                    title: 'Rất tiếc, có lỗi gì đó đã xảy ra...',
                    text: data['message'],
                    icon: 'error'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                title: 'Lỗi:',
                text: error,
                icon: 'error'
            });
        });
    }
};


function shareFamily() {
    Swal.fire({
        title: 'Sắp ra mắt!',
        text: 'Tính năng này sẽ sớm được ra mắt, bạn vui lòng ghé lại sau nhé.',
        icon: 'info'
    });
};


function deleteAccount() {
    Swal.fire({
        title: "Bạn có chắc chắn muốn xóa tài khoản không?",
        text: "Chú ý: bạn sẽ không thể hoàn tác hành động này!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: "Có",
        cancelButtonText: "Không, hãy giữ lại tài khoản của tôi!"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('/my-account/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    reason: ""
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data['status'] === 1) {
                    Swal.fire({
                        title: 'Tài khoản của bạn đã được xóa thành công',
                        text: 'Hãy đăng ký tài khoản mới để tiếp tục tận hưởng các tiện ích mà iFresh mang lại nhé!',
                        icon: 'success'
                    });
                }
                else {
                    Swal.fire({
                        title: 'Rất tiếc, có lỗi gì đó đã xảy ra...',
                        text: data['message'],
                        icon: 'error'
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    title: 'Lỗi:',
                    text: error,
                    icon: 'error'
                });
            });
        }
    })
};


async function changeLanguage() {
    var { value: language } = await Swal.fire({
        title: "Thay đổi Ngôn ngữ:",
        input: "select",
        inputOptions: {
            vietnamese: "Tiếng Việt (mặc định)",
            english: "English"
        },
        inputPlaceholder: "Chọn ngôn ngữ",
        showCancelButton: true,
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (value === "vietnamese") {
                    resolve();
                }
                else {
                    resolve("Bạn cần vui lòng chọn Tiếng Việt :)");
                }
            });
        }
    });
    if (language) {
        fetch('/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                language: language
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data['status'] === 1) {
                Swal.fire({
                    title: 'Thay đổi ngôn ngữ thành công!',
                    text: 'Ngôn ngữ mới của bạn là: ' + data['new_language'],
                    icon: 'success'
                });
            }
            else {
                Swal.fire({
                    title: 'Rất tiếc, có lỗi gì đó đã xảy ra...',
                    text: data['message'],
                    icon: 'error'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                title: 'Lỗi:',
                text: error,
                icon: 'error'
            });
        });
    }
};




async function rateUs() {
    var { value: rating } = await Swal.fire({
        title: "Vui lòng đánh giá chúng tôi trên thang điểm từ 1 - 5:",
        icon: "success",
        input: "range",
        inputLabel: "Chắc chắn là 5* rồi!",
        inputAttributes: {
            min: "1",
            max: "5",
            step: "1"
        },
        inputValue: "5"
    });
    if (rating) {
        fetch('/ratings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rating: rating
            })
        })
        .then(resonse => resonse.json())
        .then(data => {
            if (data['status'] === 1) {
                Swal.fire({
                    title: "Cảm ơn bạn đã dành thời gian đánh giá chúng tôi.",
                    text: "Nếu bạn gặp vấn đề gì khi sử dụng app hoặc muốn góp ý điều gì, đừng ngần ngại chia sẻ với chúng tôi nhé!",
                    icon: 'success'
                });
            }
            else {
                Swal.fire({
                    title: 'Rất tiếc, có lỗi gì đó đã xảy ra...',
                    text: data['message'],
                    icon: 'error'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                title: 'Lỗi:',
                text: error,
                icon: 'error'
            });
        });
    }
};




// layer 2
function closeLayer2() {
    document.getElementById('layer-2').style.display = 'none';
};

function getHealthConditions() {
    var healthConditions = {};

    var conditionValues = ['good', 'normal', 'tim-mach', 'tieu-duong', 'cao-huyet-ap', 
                            'gan-nhiem-mo', 'thoai-hoa-dot-song-co', 'dau-day-than-kinh-toa', 
                            'tram-cam', 'roi-loan-lo-au'];

    conditionValues.forEach(conditionValue => {
        var elemId = `${conditionValue}-health-condition`;
        var element = document.getElementById(elemId);
        if (element && element.type === 'checkbox') {
            healthConditions[conditionValue] = {
                status: element.checked,
                name: element.placeholder
            };
        }
        else {
            healthConditions[conditionValue] = null;
        }
    });

    return JSON.stringify(healthConditions)
};



if (updateHealthConditions) {
    document.getElementById('layer-2').style.display = 'block';
    document.getElementById('layer-2-close-btn').onclick = function() {
        closeLayer2();
        fetch('/my-account/update-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                health_conditions: getHealthConditions()
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data['status'] === 1) {
                Swal.fire({
                    title: "Cập nhật thành công!",
                    icon: "success"
                });
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                }
            }
            else {
                Swal.fire({
                    title: "Cập nhật chưa thành công!",
                    text: data['message'],
                    icon: 'error'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                title: 'Lỗi:',
                text: error,
                icon: 'error'
            });
        });
    };
};