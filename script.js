$(document).ready(function () {
    let URLFotoObjek = ""; 
    $('#foto').on('change', function () {
        const file = this.files[0];
        $('#error-foto').text(''); 
        $('#preview-container').hide(); 

        if (!file) return;

        const allowedExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedExtensions.includes(file.type)) {
            $('#error-foto').text('Format file harus JPG, JPEG, atau PNG.');
            $(this).val(''); 
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            $('#error-foto').text('Ukuran file maksimal adalah 2 MB.');
            $(this).val(''); 
            return;
        }

        URLFotoObjek = URL.createObjectURL(file);
        $('#image-preview').attr('src', URLFotoObjek);
        $('#preview-container').slideDown(300); 
    });

    $('#regForm').on('submit', function (e) {
        e.preventDefault(); 
        
        let isValid = true;
        $('.error-msg').text(''); // Reset semua pesan error


        const nim = $('#nim').val().trim();
        const nama = $('#nama').val().trim();
        const email = $('#email').val().trim();
        const hp = $('#hp').val().trim();
        const gender = $('input[name="gender"]:checked').val();
        const prodi = $('#prodi').val();
        const alamat = $('#alamat').val().trim();

    
        if (nim === '' || !/^[0-9]+$/.test(nim) || nim.length < 8) {
            $('#error-nim').text('NIM tidak valid (Minimal 8 digit angka).');
            isValid = false;
        }
        if (nama === '' || nama.length < 5) {
            $('#error-nama').text('Nama Lengkap minimal 5 karakter.');
            isValid = false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '' || !emailRegex.test(email)) {
            $('#error-email').text('Format email tidak valid.');
            isValid = false;
        }
        if (hp === '' || !/^[0-9]+$/.test(hp) || hp.length < 10) {
            $('#error-hp').text('Nomor HP tidak valid (Minimal 10 digit angka).');
            isValid = false;
        }
        if (!gender) { $('#error-gender').text('Jenis Kelamin wajib dipilih.'); isValid = false; }
        if (prodi === '') { $('#error-prodi').text('Program Studi wajib dipilih.'); isValid = false; }
        if (alamat === '' || alamat.length < 10) { $('#error-alamat').text('Alamat minimal 10 karakter.'); isValid = false; }
        
        if ($('#foto').get(0).files.length === 0 && $('#resFoto').attr('src') === '') { 
            $('#error-foto').text('Pas foto wajib diunggah.'); 
            isValid = false; 
        }

        if (isValid) {
            if ($('#foto').get(0).files.length > 0) {
                let formData = new FormData();
                formData.append('foto', $('#foto').get(0).files[0]);

                $('#btnSubmit').text('Menyimpan...').prop('disabled', true);

                $.ajax({
                    url: 'upload.php',
                    type: 'POST',
                    data: formData,
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    success: function (response) {
                        if (response.success) {
                            tampilkanKartuHasil(nim, nama, email, hp, gender, prodi, alamat, 'images/' + response.fileName);
                        } else {
                            $('#error-foto').text(response.message);
                        }
                    },
                    error: function () {
                        alert('Gagal mengirim data. Pastikan file upload.php berada di folder yang sama.');
                    },
                    complete: function () {
                        $('#btnSubmit').text('Submit').prop('disabled', false);
                    }
                });
            } else {
                const fotoLama = $('#resFoto').attr('src');
                tampilkanKartuHasil(nim, nama, email, hp, gender, prodi, alamat, fotoLama);
            }
        }
    });

    function tampilkanKartuHasil(nim, nama, email, hp, gender, prodi, alamat, pathFoto) {
        $('#resNim').text(nim);
        $('#resNama').text(nama);
        $('#resEmail').text(email);
        $('#resHp').text(hp);
        $('#resGender').text(gender);
        $('#resProdi').text(prodi);
        $('#resAlamat').text(alamat);
        $('#resFoto').attr('src', pathFoto);

        $('#regForm').fadeOut(400, function() {
            $('#summaryCard').fadeIn(400);
        });
    }

    $('#regForm').on('reset', function() {
        $('.error-msg').text('');
        URLFotoObjek = "";
        $('#preview-container').slideUp(300);
        $('#resFoto').attr('src', ''); 
    });

    $('#btnEdit').on('click', function () {
        $('#summaryCard').fadeOut(400, function() {
            $('#regForm').fadeIn(400);
        });
    });
});