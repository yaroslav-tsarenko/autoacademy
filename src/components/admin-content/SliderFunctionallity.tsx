import React, { useRef, useState } from "react";
import Divider from "@/components/divider/Divider";
import ButtonUI from "@/ui/button/ButtonUI";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/joy/Box";
import Image from "next/image";
import Slider from "@mui/material/Slider";
import Cropper from "react-easy-crop";
import { getCroppedFile } from "@/utils/getCroppedFile";
import { useAlert } from "@/context/AlertContext";
import { useContent } from "@/context/ContentContext";
import styles from "./AdminContent.module.scss";
import { newRequest } from "@/utils/newRequest";

// Add this type at the top of the file
type CroppedArea = {
    width: number;
    height: number;
    x: number;
    y: number;
};

const SliderFunctionality: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [cropOpen, setCropOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedArea | null>(null);
    const [croppedFile, setCroppedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // For replace/delete dialog
    const [editOpen, setEditOpen] = useState(false);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

    const { showAlert } = useAlert();
    const { sliderImages, refreshSlider } = useContent();

    // Add new photo
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] || null;
        if (selected && selected.type.startsWith("image")) {
            setFile(selected);
            const url = URL.createObjectURL(selected);
            setPreview(url);
            setCropOpen(true);
        }
    };

    const handleCropComplete = (_: unknown, area: CroppedArea) => setCroppedAreaPixels(area);

    const handleCropSave = async () => {
        if (file && croppedAreaPixels) {
            const cropped = await getCroppedFile(file, croppedAreaPixels, "16:9");
            setCroppedFile(cropped);
            setPreview(URL.createObjectURL(cropped));
            setCropOpen(false);
        }
    };

    const handleUploadSlider = async () => {
        if (!croppedFile) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("file", croppedFile);
        try {
            await newRequest.post("/content/slider/upload-single", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            showAlert("Фото додано до слайдеру", "Успіх", "success");
            setOpen(false);
            setFile(null);
            setPreview(null);
            setCroppedFile(null);
            refreshSlider();
        } catch {
            showAlert("Помилка при додаванні фото", "Помилка", "error");
        }
        setLoading(false);
    };

    // Edit (replace/delete) photo
    const handleEditOpen = (idx: number) => {
        setSelectedIdx(idx);
        setEditOpen(true);
    };

    const handleDelete = async () => {
        if (selectedIdx === null) return;
        setLoading(true);
        try {
            await newRequest.delete(`/content/slider/delete/${selectedIdx}`);
            showAlert("Фото видалено", "Успіх", "success");
            setEditOpen(false);
            refreshSlider();
        } catch {
            showAlert("Помилка при видаленні фото", "Помилка", "error");
        }
        setLoading(false);
    };

    const handleReplaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] || null;
        if (!selected || selectedIdx === null) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("file", selected);
        try {
            await newRequest.post(`/content/slider/replace/${selectedIdx}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            showAlert("Фото замінено", "Успіх", "success");
            setEditOpen(false);
            refreshSlider();
        } catch {
            showAlert("Помилка при заміні фото", "Помилка", "error");
        }
        setLoading(false);
    };

    return (
        <div className={styles.functionality}>
            <Divider title="Додати фото для слайдеру" description="Додавання фото для слайдеру на головний екран"/>
            <ButtonUI color="tertiary" onClick={() => setOpen(true)}>
                Додати фото
            </ButtonUI>
            {/* Show slider images */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 24 }}>
                {sliderImages.map((img, idx) => (
                    <div
                        key={idx}
                        style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}
                        onClick={() => handleEditOpen(idx)}
                    >
                        <Image src={img} alt={`slider-${idx}`} width={120} height={68} style={{ objectFit: "cover", borderRadius: 8 }} />
                    </div>
                ))}
            </div>
            {/* Add photo dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Додати фото для слайдеру</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        <ButtonUI color="secondary" onClick={() => fileInputRef.current?.click()}>
                            Вибрати фото
                        </ButtonUI>
                        {preview && (
                            <Box sx={{ mt: 2 }}>
                                <Image src={preview} alt="preview" width={320} height={180} style={{ borderRadius: 8, objectFit: "cover" }} />
                            </Box>
                        )}
                        <ButtonUI
                            color="primary"
                            onClick={handleUploadSlider}
                            loading={loading}
                            disabled={!croppedFile}
                        >
                            Додати фото
                        </ButtonUI>
                    </Box>
                    <Dialog open={cropOpen} onClose={() => setCropOpen(false)} maxWidth="xs" fullWidth>
                        <DialogTitle>Обрізати фото (16:9)</DialogTitle>
                        <DialogContent>
                            {preview && (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                                    <div style={{ position: "relative", width: "100%", height: 300 }}>
                                        <Cropper
                                            image={preview}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={16 / 9}
                                            onCropChange={setCrop}
                                            onZoomChange={setZoom}
                                            onCropComplete={handleCropComplete}
                                        />
                                    </div>
                                    <Slider
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        onChange={(_, value) => setZoom(Number(value))}
                                        sx={{ width: "100%" }}
                                    />
                                    <ButtonUI color="primary" onClick={handleCropSave} >
                                        Зберегти обрізку
                                    </ButtonUI>
                                </Box>
                            )}
                        </DialogContent>
                    </Dialog>
                </DialogContent>
            </Dialog>
            {/* Edit (replace/delete) dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Редагувати фото</DialogTitle>
                <DialogContent>
                    {selectedIdx !== null && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Image src={sliderImages[selectedIdx]} alt="edit-preview" width={320} height={180} style={{ borderRadius: 8, objectFit: "cover" }} />
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                id="replace-slider-file"
                                onChange={handleReplaceFileChange}
                            />
                            <ButtonUI color="secondary" onClick={() => document.getElementById("replace-slider-file")?.click()}>
                                Замінити фото
                            </ButtonUI>
                            <ButtonUI color="error" onClick={handleDelete} loading={loading}>
                                Видалити фото
                            </ButtonUI>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SliderFunctionality;