// Hàm được thực thi khi có sự thay đổi URL
window.addEventListener('popstate', function(event) {
    // Thực thi hàm tương ứng
    myFunctionOnURLChange();
});

// Hàm được gọi khi trang web load URL mới hoàn tất
window.addEventListener('load', function(event) {
    // Thực thi hàm tương ứng
    myFunctionOnLoadComplete();
});

// Hàm để thực thi khi có sự thay đổi URL
function myFunctionOnURLChange() {
    document.getElementById('loading-icon').style.display = 'block';
};

// Hàm để thực thi khi trang load URL mới hoàn tất
function myFunctionOnLoadComplete() {
    document.getElementById('loading-icon').style.display = 'none';
};



document.getElementById('home-page').addEventListener('click', function() {
    window.location.href = '/';
});

document.getElementById('scan-page').addEventListener('click', function() {
    window.location.href = '/scan';
});

document.getElementById('menu-page').addEventListener('click', function() {
    window.location.href = '/menu';
});

document.getElementById('explore-page').addEventListener('click', function() {
    window.location.href = '/explore';
});



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