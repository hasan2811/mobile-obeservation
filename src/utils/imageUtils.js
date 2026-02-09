/**
 * Utilitas untuk mengolah URL gambar agar tampil maksimal (High Definition)
 * Terutama untuk Google Drive agar tidak "pecah" (HD/Full Res).
 */

export const getHDImageUrl = (url) => {
    if (!url) return null;
    if (typeof url !== 'string') return null;

    // Jika sudah blob (upload lokal) atau googleusercontent langsung, biarkan
    if (url.startsWith('blob:')) return url;
    if (url.includes('googleusercontent.com') && url.includes('=s')) {
        // Jika sudah ada parameter size, paksa ke s0 (Original)
        return url.replace(/=s\d+/, '=s0');
    }

    // Handle Google Drive Link
    if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
        const idMatch = url.match(/id=([^&]+)/) || url.match(/\/d\/([^/]+)/) || url.match(/\/file\/d\/([^/]+)/);
        if (idMatch) {
            const fileId = idMatch[1];
            // Format lh3 adalah yang paling kuat (resilient) untuk embedding
            // Kita gunakan s0 untuk Full Resolution (HD)
            // Tambahkan no-cache untuk menghindari bug loading
            return `https://lh3.googleusercontent.com/d/${fileId}=s0?authuser=0`;
        }
    }

    return url;
};
