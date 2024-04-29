var itemDaysLeftPicked = null;
var itemNumLeftPickedShowed = null;
var itemNumLeftChangedByUser = false;



function editName() {
    var itemNameInput = document.getElementById('item-name-input');
    itemNameInput.focus();

    // Đặt con trỏ ở cuối input
    itemNameInput.selectionStart = itemNameInput.selectionEnd = itemNameInput.value.length;
};

function increaseAmount() {
    var itemAmountInput = document.getElementById('item-amount-input');
    var currentAmount = parseFloat(itemAmountInput.value);
    var newAmount = currentAmount + 1;
    itemAmountInput.value = newAmount;
};

function decreaseAmount() {
    var itemAmountInput = document.getElementById('item-amount-input');
    var currentAmount = parseFloat(itemAmountInput.value);
    var newAmount = currentAmount - 1;
    itemAmountInput.value = newAmount;
};

function chooseStatus(elementId) {
    // Remove the class 'selected' from all direct child of the div 'item-status-selection'
    // Select the parent div
    var parentDiv = document.getElementById('item-status-selection');
    // Get all direct children of the parent div
    var children = parentDiv.children;
    // Loop through each child and remove the 'selected' class
    for (var i = 0; i < children.length; i++) {
        children[i].classList.remove('selected');
    };

    selectedStatus = document.getElementById(elementId);
    selectedStatus.classList.add('selected');
};


function openMoreInfo() {
    const moreInfoElem = document.getElementById('layer-2');
    moreInfoElem.style.display = 'block';
};

function closeMoreInfo() {
    const moreInfoElem = document.getElementById('layer-2');
    moreInfoElem.style.display = 'none';
};

function chooseExpiryDate() {
    // To focus on an input field without triggering the keyboard
    var inputField = document.getElementById('expiry-date-input');
    inputField.focus();

    // To prevent the keyboard from showing
    inputField.blur(); // This will remove focus immediately
};

function updateDaysLeft() {
    var expiryDateValue = document.getElementById('expiry-date-input').value;
    // Split the string into day, month, and year parts
    var [day, month, year] = expiryDateValue.split('-');
    // Create a new date string in "YYYY-MM-DD" format
    var formattedExpiryDateValue = `${year}-${month}-${day}`;
    // Create a Date object from the formatted date string
    var expiryDate = new Date(formattedExpiryDateValue);

    // Get current date
    var currentDate = new Date();

    var daysLeft = (expiryDate - currentDate) / (24*60*60*1000);

    var numDaysInput = document.getElementById('num-days-input');
    numDaysInput.style.color = 'black';
    document.getElementById('left-unit').textContent = 'days';
    itemDaysLeftPicked = daysLeft;

    if (daysLeft >= 365) {
        var yearsLeft = daysLeft / 365;
        numDaysInput.value = Math.floor(yearsLeft);
        document.getElementById('left-unit').textContent = 'yrs';
        itemNumLeftPickedShowed = Math.floor(yearsLeft);
    }
    else {
        if (daysLeft >= 31) {
            var monthsLeft = daysLeft / 31;
            numDaysInput.value = Math.floor(monthsLeft);
            document.getElementById('left-unit').textContent = 'mths';
            itemNumLeftPickedShowed = Math.floor(monthsLeft);
        }
        else {
            numDaysInput.value = Math.floor(daysLeft);
            if (daysLeft < 0) {
                numDaysInput.style.color = 'red';
                numDaysInput.value = 0;
            }
            itemNumLeftPickedShowed = Math.floor(daysLeft);
        }
    }
}


function getSelectedAmountUnit() {
    var selectElement = document.getElementById('item-unit-selection');
    var selectedOptionText = selectElement.options[selectElement.selectedIndex].text;

    return selectedOptionText
}

function addItemToFridge() {
    document.getElementById('loading-icon').style.display = 'block';
    var itemName = document.getElementById('item-name-input').value;
    var itemImage = document.getElementById('item-image').src;
    var itemQuantity = {
        amount: document.getElementById('item-amount-input').value,
        unit: getSelectedAmountUnit()
    };
    var itemStatus = getSelectedItemStatus();
    var currentDate = new Date();
    var itemBoughtDate = getFormattedDate(currentDate);
    var itemExpiryDate = getItemExpiryDate();
    if (!itemExpiryDate) {
        Swal.fire({
            title: 'Bổ sung thông tin',
            text: 'Bạn hãy bổ sung thêm thông tin về hạn sử dụng cho món này nhé!',
            icon: 'info'
        });
        document.getElementById('loading-icon').style.display = 'none';
        return 
    }

    var itemInfo = {
        name: itemName,
        image: itemImage,
        quantity: itemQuantity,
        status: itemStatus,
        bought_date: itemBoughtDate,
        expiry_date: itemExpiryDate
    };

    fetch('/my-fridge/add-new-item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemInfo)
    })
    .then(response => response.json())
    .then(data => {
        if (data['status'] === 1) {
            Swal.fire({
                title: 'Thành công!',
                text: `Chúc mừng, ${itemName} đã được thêm vào Tủ lạnh của bạn.`,
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
        console.log(data);
    })
    .catch(error => {
        Swal.fire({
            title: 'Rất tiếc, có lỗi gì đó đã xảy ra...',
            text: error,
            icon: 'error'
        });
        console.log('Fetch Error: ', error);
    });

    document.getElementById('loading-icon').style.display = 'none';
};

function getSelectedItemStatus() {
    var selectedDiv = document.querySelector('div#item-status-selection > div.status.selected');
    return selectedDiv.textContent
};

function getItemDaysLeft() {
    var itemNumLeft = document.getElementById('num-days-input').value;
    var itemLeftUnit = document.getElementById('left-unit').textContent;
    if (itemDaysLeftPicked === null) {
        var keepValues = true;
    }
    else {
        if (itemNumLeft.toString() === itemNumLeftPickedShowed.toString()) {
            return itemDaysLeftPicked
        }
    }


    if (!itemNumLeftChangedByUser) {
        if (item['expiry']['days_left'] === '') {
            Swal.fire({
                title: 'Hạn sử dụng là khi nào nhỉ ?',
                text: 'Bạn hãy cung cấp thêm thông tin cho món này nhé!',
                icon: 'info'
            });
        }
        else {
            return item['expiry']['days_left']
        }
    }

    if (itemLeftUnit === 'days') {
        return itemNumLeft
    }
    else if (itemLeftUnit === 'mths') {
        return parseInt(itemNumLeft) * 30
    }
    else if (itemLeftUnit === 'yrs') {
        return parseInt(itemNumLeft) * 365
    }
};

function userChangedItemNumLeft() {
    itemNumLeftChangedByUser = true;
};

function getItemExpiryDate() {
    var itemDaysLeft = getItemDaysLeft();
    if (itemDaysLeft.toString().trim() === '') {
        return ''
    }
    
    var expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(itemDaysLeft));
    var expiryDateFormatted = getFormattedDate(expiryDate);
    return expiryDateFormatted
};


function handleUploadItemImage(event) {
    var file = event.target.files[0];
    var formData = new FormData();
    formData.append('item_image', file);

    if (file) {
        Swal.fire({
            title: 'Thay đổi bằng ảnh này ?',
            // text: "You won't be able to revert this!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Đúng vậy!"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('/my-fridge/add-new-item/upload-image', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data['status'] === 1) {
                        Swal.fire({
                            title: 'Thành công!',
                            // text: 'Ảnh đại diện của bạn đã được đổi thành công.',
                            icon: 'success'
                        });
                        document.getElementById('item-image').src = data['image_link'];
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
};

function getFormattedDate(dateObject) {
    // Extract day, month, and year from the date object
    var day = dateObject.getDate();
    var month = dateObject.getMonth() + 1; // January is 0, so we add 1
    var year = dateObject.getFullYear();

    // Ensure day and month are two digits (e.g., '01', '02', ..., '31')
    var formattedDay = day < 10 ? '0' + day : day;
    var formattedMonth = month < 10 ? '0' + month : month;

    // Create the formatted date string in 'dd-mm-yyyy' format
    var formattedDate = `${formattedDay}-${formattedMonth}-${year}`;

    return formattedDate
};



$(function() {
    $("#expiry-date-input").datepicker({
        dateFormat: 'dd-mm-yy', // Định dạng ngày
        onSelect: updateDaysLeft
    });
});


document.addEventListener('DOMContentLoaded', function() {
    // Set default item quantity unit
    document.getElementById('item-unit-selection').selectedIndex = item['quantity']['unit_selected'];

    // Set default item status
    document.getElementById(`status-${item.status.selected}`).classList.add('selected');

    // IntroJS
    introJs().setOptions({
        steps: [
            {
                intro: "Hãy cùng thêm những món mới vào Tủ lạnh nào!"
            },
            {
                element: document.querySelector('#item-image'),
                intro: "Bấm vào đây để chụp ảnh sản phẩm của bạn."
            },
            {
                element: document.querySelector('#item-configs-container > div.item-amount-container'),
                intro: "Thay đổi số lượng"
            },
            {
                element: document.querySelector('#calendar-icon'),
                intro: "Cập nhật hạn sử dụng cho sản phẩm"
            },
            {
                element: document.querySelector('#item-status-selection'),
                intro: "Chọn cách bạn sẽ bảo quản món này."
            }
        ]
    }).start();
});