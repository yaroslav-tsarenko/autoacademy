"use client";

import React, { useRef, useState } from "react";
import styles from "./StoriesFunctionallity.module.scss";
import Divider from "@/components/divider/Divider";
import ButtonUI from "@/ui/button/ButtonUI";
import Image from "next/image";
import { useAlert } from "@/context/AlertContext";
import { useContent } from "@/context/ContentContext";
import { newRequest } from "@/utils/newRequest";
import {
    Badge,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slider,
    Typography,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedFile } from "@/utils/getCroppedFile";

const MAX_FILE_SIZE_MB = 5;

const StoriesFunctionality = () => {
    const { stories, refreshStories } = useContent();
    const { showAlert } = useAlert();

    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [storyToDelete, setStoryToDelete] = useState<string | null>(null);

    const [file, setFile] = useState<File | null>(null);
    const [cropOpen, setCropOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    /** 🧩 Вибір файлу */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] || null;
        if (!selected) return;

        const isImage = selected.type.startsWith("image");
        const isVideo = selected.type.startsWith("video");

        if (!isImage && !isVideo) {
            showAlert("Можна завантажувати лише фото або відео", "Помилка", "error");
            return;
        }

        const sizeMB = selected.size / (1024 * 1024);
        if (sizeMB > MAX_FILE_SIZE_MB) {
            showAlert("Файл перевищує 5 МБ, виберіть легший", "Помилка", "error");
            return;
        }

        setFile(selected);
        if (isImage) setCropOpen(true);
    };

    const handleCropComplete = (_: Area, area: Area) => setCroppedAreaPixels(area);

    const handleCropSave = async () => {
        if (file && file.type.startsWith("image") && croppedAreaPixels) {
            const cropped = await getCroppedFile(file, croppedAreaPixels, "9:16");
            setFile(cropped);
        }
        setCropOpen(false);
    };

    const handleFileSelect = () => fileInputRef.current?.click();

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        setLoading(true);

        try {
            await newRequest.post("/content/stories/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            showAlert("Сторіс успішно додано ✅", "Успіх", "success");
            refreshStories();
            setOpen(false);
            setFile(null);
        } catch {
            showAlert("Помилка при завантаженні сторіс", "Помилка", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStory = async () => {
        if (!storyToDelete) return;
        try {
            await newRequest.delete(`/content/stories/${storyToDelete}`);
            showAlert("Сторіс видалено", "Успіх", "success");
            refreshStories();
        } catch {
            showAlert("Не вдалося видалити сторіс", "Помилка", "error");
        } finally {
            setDeleteDialogOpen(false);
            setStoryToDelete(null);
        }
    };

    return (
        <div className={styles.wrapper}>
            <Divider
                title="Додати сторіс на сайт"
                description="Формат 9:16, до 5 МБ, фото або відео ≤ 15 сек. Підходить для вертикального перегляду."
            />
                <ButtonUI color="tertiary" onClick={() => setOpen(true)}>
                    Додати сторіс
                </ButtonUI>

            {/* 📸 Попередній перегляд */}
            <div className={styles.grid}>
                {stories.map((story) => (
                    <div
                        key={story._id}
                        className={styles.item}
                        onClick={() => {
                            setStoryToDelete(story._id!);
                            setDeleteDialogOpen(true);
                        }}
                    >
                        {story.type === "image" ? (
                            <Image src={story.url} alt="story" width={200} height={360} />
                        ) : (
                            <video src={story.url} className={styles.video} muted />
                        )}
                    </div>
                ))}
            </div>

            {/* 🪄 Діалог додавання */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Завантаження сторіс</DialogTitle>
                <DialogContent>
                    <Typography className={styles.hint}>
                        Дозволені файли: <b>зображення / відео</b> (формат 9:16, розмір ≤ 5 МБ, тривалість ≤ 15 сек)
                    </Typography>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />

                    {file && (
                        <div className={styles.filePreview}>
                            {file.type.startsWith("image") && (
                                <img src={URL.createObjectURL(file)} alt={file.name} />
                            )}
                            {file.type.startsWith("video") && (
                                <video src={URL.createObjectURL(file)} controls />
                            )}
                            <div className={styles.fileName}>{file.name}</div>
                        </div>
                    )}

                    <div className={styles.buttonsRow}>
                        <ButtonUI color="secondary" onClick={handleFileSelect}>
                            Вибрати файл
                        </ButtonUI>
                        <ButtonUI
                            color="primary"
                            onClick={file ? handleUpload : undefined}
                            disabled={!file}
                            loading={loading}
                        >
                            Завантажити
                        </ButtonUI>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ✂️ Кроп */}
            <Dialog
                open={cropOpen}
                onClose={() => setCropOpen(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{ sx: { minHeight: 500, background: "#fff" } }}
            >
                <DialogContent sx={{ p: 0 }}>
                    {file && (
                        <div className={styles.cropWrapper}>
                            <Cropper
                                image={URL.createObjectURL(file)}
                                crop={crop}
                                zoom={zoom}
                                aspect={9 / 16}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={handleCropComplete}
                            />
                        </div>
                    )}
                    <div className={styles.zoomControl}>
                        <Typography>Масштаб:</Typography>
                        <Slider
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.01}
                            onChange={(_, value) => setZoom(Number(value))}
                        />
                    </div>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                    <ButtonUI color="primary" onClick={handleCropSave}>
                        Зберегти кадрування
                    </ButtonUI>
                </DialogActions>
            </Dialog>

            {/* 🗑️ Видалення */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Видалити сторіс?</DialogTitle>
                <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
                        Скасувати
                    </Button>
                    <Button color="error" onClick={handleDeleteStory}>
                        Видалити
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default StoriesFunctionality;
