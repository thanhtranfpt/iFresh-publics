if (showResults) {
    document.getElementById('results').style.display = 'block';
    document.getElementById('search-input').value = searchQuery;
}

else {
    document.getElementById('results').style.display = 'none';
}


document.getElementById('search-input').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        var searchQuery = document.getElementById('search-input').value;
        window.location.href = `/explore/search?query=${searchQuery}`;
        document.getElementById('loading-icon').style.display = 'block';
        setTimeout(function() {
            Swal.fire({
                title: "Bạn vui lòng đợi một chút nhé!",
                text: "Chúng tôi đang tìm những sản phẩm phù hợp nhất dành cho bạn...",
                icon: 'success'
            });
        }, 3000);
    }
});