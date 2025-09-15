export async function getCroppedFile(
    file: File,
    croppedAreaPixels: { x: number; y: number; width: number; height: number },
    aspect: string // e.g. "9:16"
): Promise<File> {
    if (file.type.startsWith("image")) {
        const image = await loadImage(URL.createObjectURL(file));
        const canvas = document.createElement("canvas");
        // Parse aspect ratio
        const [w, h] = aspect.split(":").map(Number);
        const aspectRatio = w / h;
        // Set canvas size based on crop and aspect
        let cropWidth = croppedAreaPixels.width;
        let cropHeight = croppedAreaPixels.height;
        // Adjust crop to match aspect ratio
        if (cropWidth / cropHeight > aspectRatio) {
            cropWidth = cropHeight * aspectRatio;
        } else {
            cropHeight = cropWidth / aspectRatio;
        }
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            cropWidth,
            cropHeight,
            0,
            0,
            cropWidth,
            cropHeight
        );
        return new Promise<File>((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) throw new Error("Canvas is empty");
                resolve(new File([blob], file.name, { type: file.type }));
            }, file.type);
        });
    } else if (file.type.startsWith("video")) {
        return file;
    } else {
        throw new Error("Unsupported file type");
    }
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}