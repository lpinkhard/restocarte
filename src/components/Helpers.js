import Resizer from 'react-image-file-resizer';

export const resizeImageFile = (file, format) => new Promise(resolve => {
    Resizer.imageFileResizer(file, 400, 400, format, 75, 0,
        uri => {
            resolve(uri);
        }, 'blob' );
});

export const cdnPath = (fileId) => {
    return 'https://' + process.env.NEXT_PUBLIC_CDN + '/' + fileId;
}

export const guid = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}
