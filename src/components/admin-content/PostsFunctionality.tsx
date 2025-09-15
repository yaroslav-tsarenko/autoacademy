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
import { getCroppedFile } from "@/utils/getCroppedFile";
import { useAlert } from "@/context/AlertContext";
import { useContent, Post } from "@/context/ContentContext";
import styles from "./AdminContent.module.scss";
import Image from "next/image";
import { newRequest } from "@/utils/newRequest";

const PostsFunctionality: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [originalPreview, setOriginalPreview] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [cropOpen, setCropOpen] = useState(false);
    const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
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

    // Handle file select
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] || null;
        if (selected && selected.type.startsWith("image")) {
            setFile(selected);
            const url = URL.createObjectURL(selected);
            setOriginalPreview(url);
            setPreview(url);
            setCropOpen(true);
        }
    };

    // Cropper logic
    const handleCropComplete = (_: Area, area: Area) => setCroppedAreaPixels(area);

    const handleCropSave = async () => {
        if (file && croppedAreaPixels) {
            const cropped = await getCroppedFile(file, croppedAreaPixels, "1:1");
            setCroppedFile(cropped);
            const croppedUrl = URL.createObjectURL(cropped);
            setPreview(croppedUrl);
            setCropOpen(false);
        }
    };

    // Upload post
    const handleUploadPost = async () => {
        if (!croppedFile || !postText) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("file", croppedFile);
        formData.append("text", postText);
        try {
            await newRequest.post("/content/posts/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            showAlert("Пост додано", "Успіх", "success");
            setOpen(false);
            setFile(null);
            setOriginalPreview(null);
            setPreview(null);
            setCroppedFile(null);
            setPostText("");
            refreshPosts();
        } catch {
            showAlert("Помилка при додаванні посту", "Помилка", "error");
        }
        setLoading(false);
    };

    // Edit post
    const handleEditPost = async () => {
        if (!selectedPost || !editText) return;
        setLoading(true);
        try {
            await newRequest.put(`/content/posts/${selectedPost._id}`, { text: editText });
            showAlert("Пост оновлено", "Успіх", "success");
            setEditOpen(false);
            setSelectedPost(null);
            refreshPosts();
        } catch {
            showAlert("Помилка при оновленні посту", "Помилка", "error");
        }
        setLoading(false);
    };

    // Delete post
    const handleDeletePost = async () => {
        if (!selectedPost) return;
        setLoading(true);
        try {
            await newRequest.delete(`/content/posts/${selectedPost._id}`);
            showAlert("Пост видалено", "Успіх", "success");
            setEditOpen(false);
            setSelectedPost(null);
            refreshPosts();
        } catch {
            showAlert("Помилка при видаленні посту", "Помилка", "error");
        }
        setLoading(false);
    };

    const renderPostsGrid = () => (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 24 }}>
            {posts.map(post => (
                <div
                    key={post._id}
                    style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}
                    onClick={() => {
                        setSelectedPost(post);
                        setEditText(post.text);
                        setEditOpen(true);
                    }}
                >
                    <Image
                        src={post.mediaUrl}
                        alt="post"
                        width={80}
                        height={80}
                        style={{ objectFit: "cover", borderRadius: 8 }}
                    />
                    <Typography level="body-md" sx={{ maxWidth: 80, textAlign: "center", fontSize: 12 }}>
                        {post.text.length > 10 ? post.text.slice(0, 10) + "..." : post.text}
                    </Typography>
                </div>
            ))}
        </div>
    );

    return (
        <div className={styles.functionality}>
            <Divider title="Додати пост на сайт" description="Блок для додавання посту на сайт рілс/фото"/>
            <ButtonUI color="tertiary" onClick={() => setOpen(true)}>
                Додати пост
            </ButtonUI>
            {renderPostsGrid()}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Додати пост</DialogTitle>
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
                                <Image src={preview} alt="preview" width={120} height={120} style={{ borderRadius: 8, objectFit: "cover" }} />
                            </Box>
                        )}
                        <Textarea
                            placeholder="Опис посту"
                            value={postText}
                            onChange={e => setPostText(e.target.value)}
                            minRows={3}
                            sx={{ width: "100%" }}
                        />
                        <ButtonUI
                            color="primary"
                            onClick={handleUploadPost}
                            loading={loading}
                            disabled={!croppedFile || !postText}
                        >
                            Додати пост
                        </ButtonUI>
                    </Box>
                    <Dialog open={cropOpen} onClose={() => setCropOpen(false)} maxWidth="xs" fullWidth>
                        <DialogTitle>Обрізати фото (1:1)</DialogTitle>
                        <DialogContent>
                            {originalPreview && (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                                    <div style={{ position: "relative", width: "100%", height: 300 }}>
                                        <Cropper
                                            image={originalPreview}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={1}
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
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Редагувати пост</DialogTitle>
                <DialogContent>
                    {selectedPost && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Image src={selectedPost.mediaUrl} alt="post" width={120} height={120} style={{ borderRadius: 8, objectFit: "cover" }} />
                            <Textarea
                                value={editText}
                                onChange={e => setEditText(e.target.value)}
                                minRows={3}
                                sx={{ width: "100%" }}
                            />
                            <ButtonUI
                                color="primary"
                                onClick={handleEditPost}
                                loading={loading}
                            >
                                Зберегти
                            </ButtonUI>
                            <ButtonUI
                                color="error"
                                onClick={handleDeletePost}
                                loading={loading}
                            >
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