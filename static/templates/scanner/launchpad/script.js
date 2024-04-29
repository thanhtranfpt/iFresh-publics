document.getElementById('image-input').addEventListener('change', function() {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();

        reader.addEventListener('load', function() {
            const base64Image = reader.result;
            localStorage.setItem('iFresh-temp_data', base64Image);
            console.log('Image saved to local storage.');
        });

        reader.readAsDataURL(file);

        window.location.href = '/scan/image';
    }
});