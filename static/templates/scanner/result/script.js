function showFullContents(elemId, header) {
    var fullContents = document.getElementById(elemId).innerText;
    Swal.fire({
        title: header,
        text: fullContents,
        icon: 'info'
    });
};



function addToFridge(itemId) {
    var itemInfo = items[itemId];
    
    if ((itemInfo['expiry_date'] && itemInfo['weight'] && itemInfo['name']) !== true) {
        var itemName = itemInfo['name'];
        window.location.href = '/foods-n-drinks/view-info?itemName=' + encodeURIComponent(itemName);

        return
    };

    fetch('/my-fridge/add-new-item', {
        method: 'POST',
        headers: {
            'Content_Type': 'application/json'
        },
        body: JSON.stringify({
            name: itemInfo['name'],
            image: itemInfo['product_image'],
            quantity: itemInfo['quantity'],
            status: itemInfo['status'],
            bought_date: getFormattedDate(new Date()),
            expiry_date: itemInfo['expiry_date']
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data['status'] === 1) {
            Swal.fire({
                title: 'Thành công!',
                text: 'Sản phẩm đã được thêm vào Tủ lạnh của bạn',
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
};


function deleteItem(itemId) {
    fetch('/scan/recently/remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            item_id: itemId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data['status'] === 1) {
            var childElement = document.getElementById(`item-${itemId}`);
            document.getElementById('scanned-items').removeChild(childElement);
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
};