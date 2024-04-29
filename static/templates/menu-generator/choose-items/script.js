var fitHealth = false;



function chooseItem(itemId) {
    document.getElementById(`fridge-item-id-${itemId}`).classList.add('selected');

    // Check if the item was selected before:
    var childElement = document.getElementById(`selected-item-id-${itemId}`);
    if (document.getElementById('selected-items').contains(childElement)) {
        return
    }

    var newSelectedDiv = document.createElement('div');
    newSelectedDiv.classList.add('item-selected-container');

    var mainElement = document.createElement('div');
    mainElement.classList.add('item-selected');
    var itemInfo = fridgeItems[itemId];
    mainElement.innerHTML = `
        <div class="item-img">
            <img src="${itemInfo.image}">
        </div>
        <div class="item-text">
            <div class="item-name">${itemInfo['name']}</div>
            <div class="item-weight">${itemInfo.quantity.amount} - ${itemInfo.quantity.unit}</div>
        </div>
        <div class="amount-selected">X 1</div>
    `;

    var hrElement = document.createElement('hr');
    hrElement.classList.add('items-separated-line');

    newSelectedDiv.appendChild(mainElement);
    newSelectedDiv.appendChild(hrElement);
    newSelectedDiv.id = `selected-item-id-${itemId}`;

    newSelectedDiv.onclick = () => {
        deleteItem(itemId);
    };


    document.getElementById('selected-items').appendChild(newSelectedDiv);
};


function deleteItem(itemId) {
    document.getElementById(`fridge-item-id-${itemId}`).classList.remove('selected');
    var childElement = document.getElementById(`selected-item-id-${itemId}`);
    if (childElement) {
        document.getElementById('selected-items').removeChild(childElement);
    }
};


function chooseAllItems() {
    for (let itemId in fridgeItems) {
        itemInfo = fridgeItems[itemId];
        chooseItem(itemId);
    }
};

function deleteAllItems() {
    for (let itemId in fridgeItems) {
        deleteItem(itemId);
    }
};


function checkChooseAll() {
    var checkbox = document.getElementById('choose-all-checkbox');
    if (checkbox.checked) {
        chooseAllItems();
    }
};

function checkDeleteAll() {
    var checkbox = document.getElementById('delete-all-checkbox');
    if (checkbox.checked) {
        deleteAllItems();
    }
};


function generateMenu() {
    document.getElementById('loading-icon').style.display = 'block';
    // Get the parent div element
    var selectedItemsDiv = document.getElementById('selected-items');
    // Get all direct child elements of the parent div
    var itemDivs = selectedItemsDiv.children;
    // Create an array to store the IDs
    var itemIds = [];
    // Loop through each child element and collect IDs
    for (let i = 0; i < itemDivs.length; i++) {
        var divId = itemDivs[i].id;
        var idParts = divId.split('-');
        var itemId = idParts[3];
        itemIds.push(itemId);
    }

    fetch('/menu/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            item_ids: itemIds,
            fit_health: fitHealth
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data['status'] !== 1) {
            Swal.fire({
                title: 'Rất tiếc, có lỗi gì đó đã xảy ra...',
                text: data['message'],
                icon: 'error'
            });
        }
        else {
            Swal.fire({
                title: 'Chúc mừng!',
                text: 'Menu của bạn đã được tạo thành công.',
                icon: 'success'
            });
            window.location.href = '/menu/generate/result';
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


async function changeRequests() {
    var { value: accept } = await Swal.fire({
        title: "Yêu cầu:",
        input: 'checkbox',
        inputValue: 0,
        inputPlaceholder: "Món ăn phù hợp với tình trạng sức khỏe của tôi",
        confirmButtonText: 'OK'
    });
    if (accept) {
        fitHealth = true;
    }
    else {
        fitHealth = false;
    }
};