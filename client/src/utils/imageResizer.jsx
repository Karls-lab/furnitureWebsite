import React from 'react';


const resizeImageWithAspectRatio = async (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function () {
                let width = img.width;
                let height = img.height;

                let aspectRatio = width / height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = maxWidth / aspectRatio;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = maxHeight * aspectRatio;
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/jpeg', 1);
            };
            img.onerror = function (error) {
                reject(error);
            };
        };
        reader.onerror = function (error) {
            reject(error);
        };
    });
};

export { resizeImageWithAspectRatio };