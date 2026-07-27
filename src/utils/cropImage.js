export default async function cropImage(
    imageSrc,
    pixelCrop,
    rotation = 0,
    flip = {
        horizontal: false,
        vertical: false,
    }
) {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
    });

    // First canvas: rotate + flip whole image
    const safeArea = Math.max(image.width, image.height) * 2;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);

    ctx.rotate((rotation * Math.PI) / 180);

    ctx.scale(
        flip.horizontal ? -1 : 1,
        flip.vertical ? -1 : 1
    );

    ctx.drawImage(
        image,
        -image.width / 2,
        -image.height / 2
    );

    // Second canvas: crop
    const cropCanvas = document.createElement("canvas");
    const cropCtx = cropCanvas.getContext("2d");

    cropCanvas.width = pixelCrop.width;
    cropCanvas.height = pixelCrop.height;

    cropCtx.drawImage(
        canvas,
        pixelCrop.x + safeArea / 2 - image.width / 2,
        pixelCrop.y + safeArea / 2 - image.height / 2,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve) => {
        cropCanvas.toBlob(
            (blob) => resolve(blob),
            "image/webp",
            0.95
        );
    });
}