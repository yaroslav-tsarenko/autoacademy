// typescript
"use client";
import React, { useRef, useState } from "react";
import Divider from "@/components/divider/Divider";
import ButtonUI from "@/ui/button/ButtonUI";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import { Textarea } from "@mui/joy";
import Cropper, { Area } from "react-easy-crop";
import Slider from "@mui/material/Slider";
import Image from "next/image";
import { getCroppedFile } from "@/utils/getCroppedFile";
import { useAlert } from "@/context/AlertContext";
import { useContent, Post } from "@/context/ContentContext";
import { newRequest } from "@/utils/newRequest";
import styles from "./AdminContent.module.scss";

const MAX_VIDEO_DURATION = 15; // секунд
const MAX_FILE_SIZE_MB = 15;

const PostsFunctionality: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [type, setType] = useState<"image" | "video" | null>(null);
    const [cropOpen, setCropOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [croppedFile, setCroppedFile] = useState<File | null>(null);
    const [postText, setPostText] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [editText, setEditText] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showAlert } = useAlert();
    const { posts, refreshPosts } = useContent();

    /** 🧩 Вибір файлу */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        const isImage = selected.type.startsWith("image");
        const isVideo = selected.type.startsWith("video");
        const sizeMB = selected.size / (1024 * 1024);

        if (sizeMB > MAX_FILE_SIZE_MB) {
            showAlert("Файл занадто великий (до 15 МБ)", "Помилка", "error");
            return;
        }

        if (!isImage && !isVideo) {
            showAlert("Дозволені лише фото або відео", "Помилка", "error");
            return;
        }

        setFile(selected);
        setPreview(URL.createObjectURL(selected));
        setType(isImage ? "image" : "video");

        if (isImage) setCropOpen(true);
        if (isVideo) validateVideoDuration(selected);
    };

    /** 🎥 Перевірка тривалості відео */
    const validateVideoDuration = (file: File) => {
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.onloadedmetadata = () => {
            if (video.duration > MAX_VIDEO_DURATION) {
                showAlert("Відео має бути ≤ 15 сек", "Помилка", "error");
                setFile(null);
                setPreview(null);
                setType(null);
            }
        };
    };

    const handleCropComplete = (_: Area, area: Area) => setCroppedAreaPixels(area);

    /** ✂️ Зберегти кадрування */
    const handleCropSave = async () => {
        if (file && croppedAreaPixels) {
            const cropped = await getCroppedFile(file, croppedAreaPixels, "1:1");
            setCroppedFile(cropped);
            setPreview(URL.createObjectURL(cropped));
            setCropOpen(false);
        }
    };

    /** 🚀 Завантажити */
    const handleUploadPost = async () => {
        const mediaFile = croppedFile || file;
        if (!mediaFile || !postText || !type) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("file", mediaFile);
        formData.append("text", postText);
        formData.append("type", type);

        try {
            await newRequest.post("/content/posts/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            showAlert("Пост успішно додано ✅", "Успіх", "success");
            setOpen(false);
            setFile(null);
            setPreview(null);
            setPostText("");
            refreshPosts();
        } catch {
            showAlert("Помилка при додаванні посту", "Помилка", "error");
        }
        setLoading(false);
    };

    /** ✏️ Редагування та видалення */
    const handleEditPost = async () => {
        if (!selectedPost || !editText) return;
        setLoading(true);
        try {
            await newRequest.put(`/content/posts/${selectedPost._id}`, { text: editText });
            showAlert("Пост оновлено ✅", "Успіх", "success");
            setEditOpen(false);
            refreshPosts();
        } catch {
            showAlert("Помилка при оновленні", "Помилка", "error");
        }
        setLoading(false);
    };

    const handleDeletePost = async () => {
        if (!selectedPost) return;
        setLoading(true);
        try {
            await newRequest.delete(`/content/posts/${selectedPost._id}`);
            showAlert("Пост видалено 🗑️", "Успіх", "success");
            setEditOpen(false);
            refreshPosts();
        } catch {
            showAlert("Помилка при видаленні", "Помилка", "error");
        }
        setLoading(false);
    };

    return (
        <div className={styles.functionality}>
            <Divider title="Пости (фото та рілси)" description="Додавай квадратні фото або відео-рілси формату 9:16." />
            <ButtonUI color="tertiary" onClick={() => setOpen(true)}>Додати пост</ButtonUI>

            {/* Сітка постів */}
            <div className={styles.mediaPreviewGrid}>
                {posts.map((post) => (
                    <div
                        key={post._id}
                        className={styles.mediaPreviewItem}
                        onClick={() => {
                            setSelectedPost(post);
                            setEditText(post.text);
                            setEditOpen(true);
                        }}
                    >
                        {post.mediaType === "video" ? (
                            <video src={post.mediaUrl} className={styles.videoThumb} />
                        ) : (
                            <Image src={post.mediaUrl} alt="post" width={80} height={80} className={styles.imageThumb} />
                        )}
                        <Typography level="body-sm" sx={{ textAlign: "center", mt: 0.5 }}>
                            {post.text.slice(0, 20)}
                        </Typography>
                    </div>
                ))}
            </div>

            {/* Додавання нового посту */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Новий пост</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        <ButtonUI color="secondary" onClick={() => fileInputRef.current?.click()}>
                            Вибрати фото або рілс
                        </ButtonUI>

                        {preview && (
                            <Box sx={{ mt: 1 }}>
                                {type === "video" ? (
                                    <video src={preview} controls className={styles.videoPreview} />
                                ) : (
                                    <Image src={preview} alt="preview" width={120} height={120} className={styles.imagePreview} />
                                )}
                            </Box>
                        )}

                        <Textarea
                            placeholder="Опис посту..."
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            minRows={3}
                        />
                        <ButtonUI
                            color="primary"
                            onClick={handleUploadPost}
                            loading={loading}
                            disabled={!file || !postText}
                        >
                            Додати пост
                        </ButtonUI>
                    </Box>

                    {/* Crop для фото */}
                    <Dialog open={cropOpen} onClose={() => setCropOpen(false)} maxWidth="xs" fullWidth>
                        <DialogTitle>Обрізати фото (1:1)</DialogTitle>
                        <DialogContent>
                            {preview && (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <div style={{ position: "relative", width: "100%", height: 300 }}>
                                        <Cropper
                                            image={preview}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={1}
                                            onCropChange={setCrop}
                                            onZoomChange={setZoom}
                                            onCropComplete={handleCropComplete}
                                        />
                                    </div>
                                    <Slider value={zoom} min={1} max={3} step={0.1} onChange={(_, val) => setZoom(Number(val))} />
                                    <ButtonUI color="primary" onClick={handleCropSave}>Зберегти обрізку</ButtonUI>
                                </Box>
                            )}
                        </DialogContent>
                    </Dialog>
                </DialogContent>
            </Dialog>

            {/* Редагування посту */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Редагувати пост</DialogTitle>
                <DialogContent>
                    {selectedPost && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {selectedPost.mediaType === "video" ? (
                                <video src={selectedPost.mediaUrl} controls className={styles.videoPreview} />
                            ) : (
                                <Image src={selectedPost.mediaUrl} alt="post" width={120} height={120} className={styles.imagePreview} />
                            )}
                            <Textarea value={editText} onChange={(e) => setEditText(e.target.value)} minRows={3} />
                            <ButtonUI color="primary" onClick={handleEditPost} loading={loading}>
                                Зберегти
                            </ButtonUI>
                            <ButtonUI color="error" onClick={handleDeletePost} loading={loading}>
                                Видалити
                            </ButtonUI>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PostsFunctionality;
