var mouseUp = false;




function openAddItems() {
    document.getElementById('layer-2').style.display = 'block';
};

function closeAddItems() {
    document.getElementById('layer-2').style.display = 'none';
};


function closeNotificationPrompt() {
    document.getElementById('layer-3').style.display = 'none';
};

function turnOnNoti() {
    closeNotificationPrompt();
    fetch('/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'get_noti': true
        })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log('Fetch error: ', error));
};


function showMoreCombineAlerts() {
    if (fridge['items_name'].length > 0) {
        document.getElementById('loading-icon').style.display = 'block';
        fetch('/foods-n-drinks/check-combine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                combine_type: "among-many",
                get_html: true,
                items: fridge['items_name']
            })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('loading-icon').style.display = 'none';
            if (data['status'] === 1) {
                Swal.fire({
                    title: 'Các nguyên liệu trong tủ lạnh của bạn...',
                    icon: 'info',
                    html: data['results'],
                    showCloseButton: true,
                    showCancelButton: true,
                    focusConfirm: false,
                    confirmButtonText: `
                        <i class="fa fa-thumbs-up"></i> Great!
                    `,
                    confirmButtonAriaLabel: "Thumbs up, great!",
                    cancelButtonText: `
                        <i class="fa fa-thumbs-down"></i>
                    `,
                    cancelButtonAriaLabel: "Thumbs down"
                });
            }
            else {
                Swal.fire({
                    title: 'Oops...',
                    text: data['message'],
                    icon: 'error'
                });
            }
        })
        .catch(error => {
            console.log('Fetch error: ', error);
            Swal.fire({
                title: 'Rất tiếc, có lỗi gì đó đã xảy ra!',
                text: toString(error),
                icon: 'error'
            });
        });
    }
    else {
        Swal.fire({
            title: "Opps... Tủ lạnh trống trải quá!",
            text: "Bạn hãy thêm các món vào Tủ lạnh để xem thêm thông tin thú vị nhé.",
            icon: 'info'
        });
    }
};


// Hàm chuyển đổi chuỗi có dấu sang chuỗi không dấu
function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

function searchItems() {
    var searchTermInput = document.getElementById('search-input-add-item').value;
    var searchTerm = searchTermInput.trim();
    if (searchTerm.length > 0) {
        var searchTerm = removeDiacritics(searchTerm.toLowerCase());
        var searchWords = searchTerm.split(" "); // Tách searchTerm thành các từ

        // Tìm kiếm các sản phẩm và đếm số từ khóa khớp
        var results = databaseFoodItems.map(item => {
            var itemName = removeDiacritics(item.name.toLowerCase());
            var matchedWords = searchWords.filter(word => itemName.includes(word));
            var matchRatio = matchedWords.length / searchWords.length;

            if (matchRatio >= 0.5) {
                return { item, matched: matchRatio };
            }
            else {
                return null; // Filter out products with low matching ratio
            }
        }).filter(Boolean); // Remove null entries (products with low ratio)

        // Sort results by matched ratio in descending order
        results.sort((a, b) => b.matched - a.matched);

        var items = results.map(result => result.item);

        // return results
    }
    else {
        var items = databaseFoodItems;
    }

    displaySearchItems(items, searchTermInput);
};

function displaySearchItems(items, searchTermInput) {
    var searchResultsDiv = document.getElementById('search-results-items');
    // Xóa nội dung cũ trước khi hiển thị kết quả mới
    searchResultsDiv.innerHTML = '';

    if (items.length > 0) {
        items.forEach(item => {
            var itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            var imgElement = document.createElement('img');
            imgElement.src = item.image;
            var nameDiv = document.createElement('div');
            nameDiv.classList.add('name');
            nameDiv.textContent = item.name;

            itemDiv.appendChild(imgElement);
            itemDiv.appendChild(nameDiv);

            // Attach onclick event listener to the product item
            itemDiv.onclick = () => {
                handleSearchedItemClick('itemId', item.id);
            };

            searchResultsDiv.appendChild(itemDiv);
        });
    }
    else {
        var itemDiv = document.createElement('div');
        itemDiv.classList.add('item');
        var imgElement = document.createElement('img');
        imgElement.src = "https://firebasestorage.googleapis.com/v0/b/ifresh-3063a.appspot.com/o/logo.png?alt=media";
        var nameDiv = document.createElement('div');
        nameDiv.classList.add('name');
        nameDiv.textContent = searchTermInput;
        itemDiv.appendChild(imgElement);
        itemDiv.appendChild(nameDiv);
        // Attach onclick event listener to the product item
        itemDiv.onclick = () => {
            handleSearchedItemClick('itemName', searchTermInput);
        };
        searchResultsDiv.appendChild(itemDiv);
    }
};

function handleSearchedItemClick(by, value) {
    var url = `/foods-n-drinks/view-info?${by}=${value}`;
    window.location.href = url;
};


async function removeItemFromFridge(itemId) {
    var item = fridge['items'][itemId];
    Swal.fire({
        title: `Xóa ${item['name']} khỏi Tủ lạnh ?`,
        html: `${item['name']}: ${item['quantity']['amount']} ${item['quantity']['unit']}.<br> HSD dự kiến: ${item['expiry']['date']}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xóa"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('/my-fridge/remove-item', {
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
                    Swal.fire({
                        title: "Thành công!",
                        text: `Đã xóa ${item['name']} khỏi Tủ lạnh của bạn.`,
                        icon: "success"
                    });
                    var childElem = document.getElementById(`item-in-fridge-id-${itemId}`);
                    document.getElementById('fridge-items').removeChild(childElem);
                }
                else {
                    Swal.fire({
                        title: "",
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
};




if (askNotiPermit) {
    document.getElementById('layer-3').style.display = 'block';
}
else {
    closeNotificationPrompt();
}

if (openSearchTab) {
    openAddItems();
}
else {
    closeAddItems();
}

displaySearchItems(databaseFoodItems, '');


if (combineData['source_item'] && combineData['target_items']) {
    fetch('/foods-n-drinks/check-combine', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            combine_type: "1-many",
            get_html: true,
            source_item: combineData['source_item'],
            target_items: combineData['target_items']
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data['status'] != 1) {
            console.log("Error Loading Combine Message: " + data['message']);
        }
        else {
            document.getElementById('third-part').innerHTML = data['results'];
        }
    })
    .catch(error => {
        console.log('Error: ', error);
    });
};



document.addEventListener('mouseup', function(event) {
    mouseUp = true;
});

document.addEventListener('mousedown', function(event) {
    mouseUp = false;
    setTimeout(function() {
        if (mouseUp === false) {
            var itemElement = event.target;
            if (itemElement.classList.contains('one-of-items-in-fridge') && itemElement.classList.contains('item-name')) {
                var itemId = itemElement.id.substring("item-name-id-".length);
                removeItemFromFridge(itemId);
            }
        }
    }, 500);
});