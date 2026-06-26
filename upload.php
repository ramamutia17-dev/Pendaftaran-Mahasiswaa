<?php
header('Content-Type: application/json');

if (!file_exists('images')) {
    mkdir('images', 0777, true);
}

if (isset($_FILES['foto'])) {
    $file = $_FILES['foto'];
    $namaFileAsli = basename($file['name']);
    $targetPath = 'images/' . $namaFileAsli;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        echo json_encode([
            'success' => true,
            'fileName' => $namaFileAsli
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Gagal memindahkan file. Periksa hak akses folder images.'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Tidak ada file yang diterima oleh server.'
    ]);
}
?>