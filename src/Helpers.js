import Resizer from 'react-image-file-resizer';

export const resizeImageFile = (file, format) => new Promise(resolve => {
    Resizer.imageFileResizer(file, 400, 400, format, 75, 0,
        uri => {
            resolve(uri);
        }, 'blob' );
});

export const hasWebPSupport = () => {
    const elem = document.createElement('canvas');

    if (!!(elem.getContext && elem.getContext('2d')))
    {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    else
    {
        return false;
    }
}

export const cdnPath = (fileId) => {
    return 'https://' + process.env.REACT_APP_CDN + '/' + fileId;
}

export const guid = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}
