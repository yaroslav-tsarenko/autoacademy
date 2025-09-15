"use client"

import React, { useRef, useState } from "react";
import Box from "@mui/joy/Box";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import ButtonUI from "@/ui/button/ButtonUI";
import { Textarea } from "@mui/joy";
import Cropper, { Area } from "react-easy-crop";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Slider from "@mui/material/Slider";
import { useAlert } from "@/context/AlertContext";
import { newRequest } from "@/utils/newRequest";
import { getCroppedFile } from "@/utils/getCroppedFile";
import { useContent, Review } from "@/context/ContentContext";
import Image from "next/image";
import Divider from "@/components/divider/Divider";

const initialForm = {
    fullName: "",
    avatar: "",
    photo: "",
    rating: 5,
    reviews: "",
    ago: "",
    role: "",
    text: "",
};

const AddReviewFunctionality: React.FC = () => {
    const { showAlert } = useAlert();
    const { reviews, refreshReviews } = useContent();
    const [form, setForm] = useState(initialForm);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    // Dialog state
    const [open, setOpen] = useState(false);

    // Cropper state
    const [cropOpen, setCropOpen] = useState<null | "avatar" | "photo">(null);
    const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    // Edit state
    const [editOpen, setEditOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    // Refs
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);

    // Handlers for cropping
    const handleCropComplete = (_: Area, area: Area) => setCroppedAreaPixels(area);

    const handleCropSave = async () => {
        if (cropOpen === "avatar" && avatarFile && croppedAreaPixels) {
            const cropped = await getCroppedFile(avatarFile, croppedAreaPixels, "1:1");
            setAvatarFile(cropped);
            setAvatarPreview(URL.createObjectURL(cropped));
        }
        if (cropOpen === "photo" && photoFile && croppedAreaPixels) {
            const cropped = await getCroppedFile(photoFile, croppedAreaPixels, "4:3");
            setPhotoFile(cropped);
            setPhotoPreview(URL.createObjectURL(cropped));
        }
        setCropOpen(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
    };

    // File select handlers
    const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
            setCropOpen("avatar");
        }
    };
    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
            setCropOpen("photo");
        }
    };

    // Submit handler
    const handleAddReview = async () => {
        if (!avatarFile || !photoFile) {
            showAlert("Аватар і фото для відгуку обов&apos;язкові", "Помилка", "error");
            return;
        }
        const formData = new FormData();
        formData.append("fullName", form.fullName);
        formData.append("avatar", avatarFile);
        formData.append("photo", photoFile);
        formData.append("rating", String(form.rating));
        formData.append("reviews", form.reviews);
        formData.append("ago", form.ago);
        formData.append("role", form.role);
        formData.append("text", form.text);

        try {
            await newRequest.post("/content/reviews/create", formData);
            showAlert("Відгук успішно додано", "Успіх", "success");
            setForm(initialForm);
            setAvatarFile(null);
            setAvatarPreview(null);
            setPhotoFile(null);
            setPhotoPreview(null);
            setOpen(false);
            refreshReviews();
        } catch {
            showAlert("Помилка при додаванні відгуку", "Помилка", "error");
        }
    };

    // Edit handlers
    const handleEditClick = (review: Review) => {
        setSelectedReview(review);
        setForm({
            fullName: review.fullName,
            avatar: review.avatar,
            photo: review.photo,
            rating: review.rating,
            reviews: review.reviews,
            ago: review.ago,
            role: review.role,
            text: review.text,
        });
        setAvatarPreview(review.avatar);
        setPhotoPreview(review.photo);
        setEditOpen(true);
    };

    const handleUpdateReview = async () => {
        if (!selectedReview) return;
        const formData = new FormData();
        formData.append("fullName", form.fullName);
        if (avatarFile) formData.append("avatar", avatarFile);
        if (photoFile) formData.append("photo", photoFile);
        formData.append("rating", String(form.rating));
        formData.append("reviews", form.reviews);
        formData.append("ago", form.ago);
        formData.append("role", form.role);
        formData.append("text", form.text);

        try {
            await newRequest.put(`/content/reviews/${selectedReview._id}/update`, formData);
            showAlert("Відгук оновлено", "Успіх", "success");
            setEditOpen(false);
            setSelectedReview(null);
            setAvatarFile(null);
            setPhotoFile(null);
            setAvatarPreview(null);
            setPhotoPreview(null);
            refreshReviews();
        } catch {
            showAlert("Помилка при оновленні відгуку", "Помилка", "error");
        }
    };

    const handleDeleteReview = async () => {
        if (!selectedReview) return;
        try {
            await newRequest.delete(`/content/reviews/${selectedReview._id}`);
            showAlert("Відгук видалено", "Успіх", "success");
            setEditOpen(false);
            setSelectedReview(null);
            refreshReviews();
        } catch {
            showAlert("Помилка при видаленні відгуку", "Помилка", "error");
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
            <Divider title="Додати або підтвердити відгук" description="Блок для додавання відгуків"/>
            <ButtonUI color="tertiary" onClick={() => setOpen(true)}>
                Додати відгук
            </ButtonUI>
            {/* Reviews grid */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                {reviews.map(review => (
                    <Box
                        key={review._id}
                        sx={{
                            border: "1px solid #eee",
                            borderRadius: 2,
                            p: 2,
                            minWidth: 220,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }}
                        onClick={() => handleEditClick(review)}
                    >
                        <Image src={review.avatar} alt="avatar" width={48} height={48} style={{ borderRadius: 24 }} />
                        <Typography level="body-md" sx={{ mt: 1 }}>{review.fullName}</Typography>
                        <Image src={review.photo} alt="review-photo" width={120} height={90} style={{ borderRadius: 8, marginTop: 8 }} />
                    </Box>
                ))}
            </Box>
            {/* Add Review Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontSize: 24 }}>Додати відгук</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                        <Typography level="body-md">Ім&apos;я</Typography>
                        <Input
                            placeholder="Ім&apos;я"
                            value={form.fullName}
                            onChange={e => setForm({ ...form, fullName: e.target.value })}
                            sx={{ width: "100%" }}
                        />
                        <ButtonUI color="secondary" onClick={() => avatarInputRef.current?.click()}>
                            Вибрати аватар
                        </ButtonUI>
                        <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleAvatarSelect}
                        />
                        {avatarPreview && (
                            <Box sx={{ mt: 2 }}>
                                <Image src={avatarPreview} alt="avatar" width={80} height={80} style={{ borderRadius: 8 }} />
                            </Box>
                        )}
                        <Typography level="body-md">Фото для відгуку</Typography>
                        <ButtonUI color="secondary" onClick={() => photoInputRef.current?.click()}>
                            Вибрати фото для відгуку
                        </ButtonUI>
                        <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handlePhotoSelect}
                        />
                        {photoPreview && (
                            <Box sx={{ mt: 2 }}>
                                <Image src={photoPreview} alt="review-photo" width={120} height={90} style={{ borderRadius: 8 }} />
                            </Box>
                        )}
                        <Typography level="body-md">Оцінка</Typography>
                        <select
                            value={form.rating}
                            onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
                            style={{ width: "100%", marginTop: 8, padding: 8, borderRadius: 8 }}
                        >
                            {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <Input
                            placeholder="Кількість відгуків"
                            value={form.reviews}
                            onChange={e => setForm({ ...form, reviews: e.target.value })}
                            sx={{ width: "100%" }}
                        />
                        <Input
                            placeholder="Скільки часу тому"
                            value={form.ago}
                            onChange={e => setForm({ ...form, ago: e.target.value })}
                            sx={{ width: "100%" }}
                        />
                        <Input
                            placeholder="Роль"
                            value={form.role}
                            onChange={e => setForm({ ...form, role: e.target.value })}
                            sx={{ width: "100%" }}
                        />
                        <Textarea
                            placeholder="Текст відгуку"
                            value={form.text}
                            onChange={e => setForm({ ...form, text: e.target.value })}
                            sx={{ width: "100%" }}
                            minRows={3}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                    <ButtonUI color="secondary" onClick={handleAddReview}>
                        Додати відгук
                    </ButtonUI>
                </DialogActions>
                {/* Cropper Dialog */}
                <Dialog open={!!cropOpen} onClose={() => setCropOpen(null)} fullWidth maxWidth="sm">
                    <DialogContent sx={{ minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {(cropOpen === "avatar" && avatarPreview) && (
                            <div style={{ width: "100%", height: "300px", position: "relative" }}>
                                <Cropper
                                    image={avatarPreview}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={handleCropComplete}
                                />
                            </div>
                        )}
                        {(cropOpen === "photo" && photoPreview) && (
                            <div style={{ width: "100%", height: "300px", position: "relative" }}>
                                <Cropper
                                    image={photoPreview}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={4 / 3}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={handleCropComplete}
                                />
                            </div>
                        )}
                        <Slider
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.01}
                            onChange={(_, value) => setZoom(Number(value))}
                            sx={{ width: "80%", mt: 2 }}
                            aria-label="Zoom"
                        />
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                        <ButtonUI color="secondary" onClick={handleCropSave}>
                            Зберегти Кадрування
                        </ButtonUI>
                    </DialogActions>
                </Dialog>
            </Dialog>
            {/* Edit Review Dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontSize: 24 }}>Редагувати / Видалити відгук</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                        <Typography level="body-md">Ім&apos;я</Typography>
                        <Input
                            placeholder="Ім&apos;я"
                            value={form.fullName}
                            onChange={e => setForm({ ...form, fullName: e.target.value })}
                            sx={{ width: "100%" }}
                        />
                        <ButtonUI color="secondary" onClick={() => avatarInputRef.current?.click()}>
                            Змінити аватар
                        </ButtonUI>
                        <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleAvatarSelect}
                        />
                        {avatarPreview && (
                            <Box sx={{ mt: 2 }}>
                                <Image src={avatarPreview} alt="avatar" width={80} height={80} style={{ borderRadius: 8 }} />
                            </Box>
                        )}
                        <Typography level="body-md">Фото для відгуку</Typography>
                        <ButtonUI color="secondary" onClick={() => photoInputRef.current?.click()}>
                            Змінити фото для відгуку
                        </ButtonUI>
                        <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handlePhotoSelect}
                        />
                        {photoPreview && (
                            <Box sx={{ mt: 2 }}>
                                <Image src={photoPreview} alt="review-photo" width={120} height={90} style={{ borderRadius: 8 }} />
                            </Box>
                        )}
                        <Typography level="body-md">Оцінка</Typography>
                        <select
                            value={form.rating}
                            onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
                            style={{ width: "100%", marginTop: 8, padding: 8, borderRadius: 8 }}
                        >
                            {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <Input
                            placeholder="Кількість відгуків"
                            value={form.reviews}
                            onChange={e => setForm({ ...form, reviews: e.target.value })}
                            sx={{ width: "100%" }}
                        />
                        <Input
                            placeholder="Скільки часу тому"
                            value={form.ago}
                            onChange={e => setForm({ ...form, ago: e.target.value })}
                            sx={{ width: "100%" }}
                        />
                        <Input
                            placeholder="Роль"
                            value={form.role}
                            onChange={e => setForm({ ...form, role: e.target.value })}
                            sx={{ width: "100%" }}
                        />
                        <Textarea
                            placeholder="Текст відгуку"
                            value={form.text}
                            onChange={e => setForm({ ...form, text: e.target.value })}
                            sx={{ width: "100%" }}
                            minRows={3}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 2, gap: 2 }}>
                    <ButtonUI color="primary" onClick={handleUpdateReview}>
                        Зберегти зміни
                    </ButtonUI>
                    <ButtonUI color="error" onClick={handleDeleteReview}>
                        Видалити
                    </ButtonUI>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AddReviewFunctionality;