interface CropImageProps {
  image: any;
  pixelCrop: any;
}

const createImage = (url: string) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", error => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // might be able to removed
    image.src = url;
  });

/**
 * 
 * @param {File} image
 * @param {Object} pixelCrop
 * @param {number} rotation
 */

export const getCroppedImg = async ({ image, pixelCrop }: CropImageProps) => {
  const format: string = image.match(/data:(image\/\w+);/)[1];
  image = await createImage(image);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  // @ TO DO Add rotation to image crop
  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  // ctx.rotate(getRadianAngle(rotation))
  ctx.translate(-safeArea / 2, -safeArea / 2);

  ctx.drawImage(image, safeArea / 2 - image.width * 0.5, safeArea / 2 - image.height * 0.5);
  const data = ctx.getImageData(0, 0, safeArea, safeArea);
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  
  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y),
  );

  return new Promise(resolve => {
    canvas.toBlob(file => {
      resolve(file);
    }, format);
  });
};
