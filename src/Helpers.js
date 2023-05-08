import Resizer from 'react-image-file-resizer';

export const resizeImageFile = (file, format) => new Promise(resolve => {
    Resizer.imageFileResizer(file, 400, 400, format, 80, 0,
        uri => {
            resolve(uri);
        }, 'blob' );
});
