function chooseTab(tabName) {
    if (tabName === 'guidance') {
        document.getElementById('wrapper-guidance').style.display = 'block';
        document.getElementById('shopping-container').style.display = 'none';
        document.getElementById('guidance-tab').classList.add('selected');
        document.getElementById('shopping-tab').classList.remove('selected');
    }
    else {
        document.getElementById('wrapper-guidance').style.display = 'none';
        document.getElementById('shopping-container').style.display = 'block';
        document.getElementById('guidance-tab').classList.remove('selected');
        document.getElementById('shopping-tab').classList.add('selected');
    }
};


function showRecommendedItems(productId) {
    var recommendedItems = document.getElementById('recommended-items-' + productId);
    recommendedItems.style.display = 'flex';
};