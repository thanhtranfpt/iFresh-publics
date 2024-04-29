function clickScan() {
    document.getElementById('loading-icon').style.display = 'block';
};



document.addEventListener('DOMContentLoaded', function() {
    const imageData = localStorage.getItem('iFresh-temp_data');
    localStorage.removeItem('iFresh-scanner-launchpad-imageData');
    if (imageData) {
        document.getElementById('image-display').setAttribute('src', imageData);
        document.getElementById('loading-icon').style.display = 'block';

        fetch('/scan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'base64_image_source': imageData
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data['status'] === 0) {
                Swal.fire({
                    title: 'Rất tiếc, chúng tôi không tìm thấy mã vạch sản phẩm nào!',
                    text: 'Bạn có muốn quét lại không ?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Có, để tôi chụp lại!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/scan';
                    }
                });
            }
            else if (data['status'] === 2) {
                Swal.fire({
                    title: 'Chúng tôi tìm thấy mã QR này, bạn có muốn xem thêm thông tin không ?',
                    text: `Nội dung mã QR: ${data['qr_content']}`,
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Có, hãy đi theo đường dẫn này'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = data['qr_content'];
                    }
                });
            }
            else if (data['status'] === 3) {
                Swal.fire({
                    title: 'Rất tiếc, chúng tôi không tìm thấy thông tin cho sản phẩm này!',
                    text: 'Bạn có muốn quét lại không ?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Có, hãy để tôi chụp lại'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/scan';
                    }
                });
            }
            else if (data['status'] === 1) {
                window.location.href = '/scan/result';
            }
            else if (data['status'] === 4) {
                var productName = data['product_name'];
                window.location.href = '/foods-n-drinks/view-info?itemName=' + encodeURIComponent(productName);
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
    
    else {
        console.log('No image data found in local storage.');
        Swal.fire({
            title: 'Không tìm thấy mã vạch sản phẩm!',
            text: "Bạn có muốn quét lại không ?",
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Có, để tôi chụp lại!"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/scan';
            }
        });
    }

    document.getElementById('loading-icon').style.display = 'none';
    
});