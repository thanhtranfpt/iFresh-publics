function changePlan() {
    alertPremiumTrialActivated();
};

function viewPlanInfo() {
    alertPremiumTrialActivated();
};

function changePaymentMethod() {
    alertPremiumTrialActivated();
};

function addBackupPaymentMethod() {
    alertPremiumTrialActivated();
};

function viewPaymentInformation() {
    alertPremiumTrialActivated();
};

function manageDevices() {
    alertPremiumTrialActivated();
};

function downloadPersonalInfo() {
    alertPremiumTrialActivated();
};

function manageFamilyMembers() {
    alertPremiumTrialActivated();
};


function alertPremiumTrialActivated() {
    Swal.fire({
        title: "Đã kích hoạt bản dùng thử Gói Premium!",
        text: "Bạn đang được dùng thử phiên bản Premium miễn phí trong 1 năm nhân dịp chương trình khuyến mãi đặc biệt của chúng tôi! Hãy tận hưởng trải nghiệm!",
        icon: "success"
    });
};





async function advancedSettings() {
    var { value: formValues} = await Swal.fire({
        title: "Cài đặt nâng cao",
        html: `
            <div>
            <input id="get-noti-config-input" type="checkbox" checked> Nhận thông báo từ iFresh
            </div>
            <!-- 
            <div><h3>Cập nhật tình trạng sức khỏe hiện tại của bạn: </h3>
                <input type="checkbox" id="normal-health-condition"> Bình thường</p>
                <input type="checkbox" id="tim-mach-health-condition"> Tim mạch</p>
                <input type="checkbox" id="tieu-duong-health-condition"> Tiểu đường</p>
                <input type="checkbox" id="cao-huyet-ap-health-condition"> Cao huyết áp</p>
                <input type="checkbox" id="gan-nhiem-mo-health-condition"> Gan nhiễm mỡ</p>
                <input type="checkbox" id="thoai-hoa-dot-song-co-health-condition"> Thoái hóa đốt sống cổ</p>
                <input type="checkbox" id="dau-day-than-kinh-toa-health-condition"> Đau dây thần kinh tọa</p>
                <input type="checkbox" id="tram-cam-health-condition"> Trầm cảm</p>
                <input type="checkbox" id="roi-loan-lo-au-health-condition"> Rối loạn lo âu
            </div>
            -->
        `,
        focusConfirm: false,
        preConfirm: () => {
            return {
                getNoti: document.getElementById('get-noti-config-input').checked
                // health_conditions: {
                //     normal: document.getElementById('normal-health-condition').checked,
                //     tim_mach: document.getElementById('tim-mach-health-condition').checked,
                //     tieu_duong: document.getElementById('tieu-duong-health-condition').checked,
                //     cao_huyet_ap: document.getElementById('cao-huyet-ap-health-condition').checked,
                //     gan_nhiem_mo: document.getElementById('gan-nhiem-mo-health-condition').checked,
                //     thoai_hoa_dot_song_co: document.getElementById('thoai-hoa-dot-song-co-health-condition').checked,
                //     dau_day_than_kinh_toa: document.getElementById('dau-day-than-kinh-toa-health-condition').checked,
                //     tram_cam: document.getElementById('tram-cam-health-condition').checked,
                //     roi_loan_lo_au: document.getElementById('roi-loan-lo-au-health-condition').checked
                // }
            }
        }
    });
    if (formValues) {
        fetch('/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                get_noti: formValues['getNoti']
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data['status'] === 1) {
                Swal.fire({
                    title: "",
                    text: "",
                    icon: "success"
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