"use client"

import {newRequest} from "@/utils/newRequest";
import React, {useRef, useState} from 'react';
import styles from "./AdminContent.module.scss";
import Divider from "@/components/divider/Divider";
import ButtonUI from "@/ui/button/ButtonUI";
import {Badge, Dialog, DialogContent, DialogTitle} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {useAlert} from "@/context/AlertContext";
import {useContent} from "@/context/ContentContext";
import Image from "next/image";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import {Textarea} from "@mui/joy";
import Cropper from "react-easy-crop";
import DialogActions from "@mui/material/DialogActions";
import {getCroppedFile} from "@/utils/getCroppedFile";
import Slider from "@mui/material/Slider";
import ActualsFunctionality from "@/components/admin-content/ActualsFunctionallity";
import PostsFunctionality from "@/components/admin-content/PostsFunctionality";
import SliderFunctionality from "@/components/admin-content/SliderFunctionallity";
import AddReviewFunctionallity from "@/components/admin-content/AddReviewFunctionallity";
import AddInstructorFunctionality from "@/components/admin-content/AddInstructorFunctionallity";
import {Area} from "react-easy-crop";
import StoriesFunctionallity from "@/components/admin-content/StoriesFunctionallity";
import AddFAQFunctionallity from "@/components/admin-content/AddFAQFunctionallity";
import FeaturesFunctionallity from "@/components/admin-content/FeaturesFunctionallity";

type DialogType =
    | "story"
    | "actual"
    | "post"
    | "slider"
    | "review-photo"
    | "review"
    | "instructor"
    | "main-section"
    | null;

const AdminContent = () => {
    const [open, setOpen] = useState(false);
    const [dialogType, setDialogType] = useState<DialogType>(null);
    const [loading, setLoading] = useState(false);
    const {showAlert} = useAlert();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {stories, actuals, refreshActuals, refreshSlider, refreshPosts} = useContent();
    const [actualForm, setActualForm] = useState({title: "", urls: [] as string[], thumbnail: ""});
    const [actualFiles, setActualFiles] = useState<File[]>([]);
    const [actualFilesPreview, setActualFilesPreview] = useState<string[]>([]);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailFilePreview, setThumbnailFilePreview] = useState<string | null>(null);
    const actualFilesInputRef = useRef<HTMLInputElement>(null);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const [contentFile, setContentFile] = useState<File | null>(null);
    const uploadToActualFileInputRef = useRef<HTMLInputElement>(null);
    const [selectedActualId, setSelectedActualId] = useState<string | null>(null);
    const [postFile, setPostFile] = useState<File | null>(null);
    const [postText, setPostText] = useState("");
    const postFileInputRef = useRef<HTMLInputElement>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const {mainSection, upsertMainSection, refreshMainSection} = useContent();
    const [mainDialogOpen, setMainDialogOpen] = useState(false);
    const [mainForm, setMainForm] = useState({
        title: mainSection?.title || "",
        description: mainSection?.description || "",
        publications: mainSection?.publications || 0,
        followers: mainSection?.followers || 0,
        students: mainSection?.students || "",
    });
    console.log(mainDialogOpen)


    const [file, setFile] = useState<File | null>(null);
    const [cropOpen, setCropOpen] = useState(false);
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] || null;
        if (selected && selected.type.startsWith("image")) {
            setFile(selected);
            setCropOpen(true);
        } else {
            setFile(selected); // For video, just preview
        }
    };
    const handleCropComplete = (_: Area, area: Area) => setCroppedAreaPixels(area);

    const handleCropSave = async () => {
        if (file && file.type.startsWith("image") && croppedAreaPixels) {
            const cropped = await getCroppedFile(file, croppedAreaPixels, "9:16");
            setFile(cropped);
        }
        setCropOpen(false);
    };
    const [mainLoading, setMainLoading] = useState(false);

    const handleSaveMainSection = async () => {
        setMainLoading(true);
        await upsertMainSection(mainForm);
        showAlert("Головний блок оновлено", "Успіх", "success");
        setMainLoading(false);
        setMainDialogOpen(false);
        refreshMainSection();
        setOpen(false)
    };

    const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAvatarFile(e.target.files?.[0] || null);
    };

    const handleReviewPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReviewPhotoFile(e.target.files?.[0] || null);
    };
    const [sliderFile, setSliderFile] = useState<File | null>(null);
    const sliderFileInputRef = useRef<HTMLInputElement>(null);
    const [reviewForm, setReviewForm] = useState({
        fullName: "",
        avatar: "",
        photo: "",
        rating: 5,
        reviews: "",
        ago: "",
        role: "",
        text: "",
        type: "text",
    });
    const [reviewPhotoFile, setReviewPhotoFile] = useState<File | null>(null);
    const reviewPhotoInputRef = useRef<HTMLInputElement>(null);


    const handlePostFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPostFile(e.target.files?.[0] || null);
    };

    const handleAddReview = async () => {
        if (!avatarFile || !reviewPhotoFile) {
            showAlert("Аватар і фото для відгуку обов'язкові", "Помилка", "error");
            return;
        }
        const formData = new FormData();
        formData.append("fullName", reviewForm.fullName);
        formData.append("avatar", avatarFile);
        formData.append("photo", reviewPhotoFile);
        formData.append("rating", String(reviewForm.rating));
        formData.append("reviews", reviewForm.reviews);
        formData.append("ago", reviewForm.ago);
        formData.append("role", reviewForm.role);
        formData.append("text", reviewForm.text);

        try {
            await newRequest.post("/content/reviews/create", formData);
            showAlert("Відгук успішно додано", "Успіх", "success");
        } catch {
            showAlert("Помилка при додаванні відгуку", "Помилка", "error");
        }
    };

    const handleUploadPost = async () => {
        if (!postFile || !postText) return;
        const formData = new FormData();
        formData.append("file", postFile);
        formData.append("text", postText);
        try {
            setLoading(true);
            await newRequest.post("/content/posts/upload", formData, {
                headers: {"Content-Type": "multipart/form-data"}
            });
            showAlert("Пост успішно додано", "Успіх", "success");
            setPostFile(null);
            setPostText("");
            refreshPosts();
            handleClose();
        } catch {
            showAlert("Помилка при додаванні посту", "Помилка", "error");
        }
        setLoading(false);
    };

    const handleActualFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []).slice(0, 5);
        setActualFiles(files);
        setActualFilesPreview(files.map(file => URL.createObjectURL(file)));
    };

    const handleThumbnailFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setThumbnailFile(file);
        setThumbnailFilePreview(file ? URL.createObjectURL(file) : null);
    };

    const handleAddActual = async () => {
        setLoading(true);
        try {
            // Upload content files
            const urls: string[] = [];
            for (const file of actualFiles) {
                const formData = new FormData();
                formData.append("file", file);
                const res = await newRequest.post("/content/actuals/upload-file", formData, {
                    headers: {"Content-Type": "multipart/form-data"}
                });
                urls.push(res.data.url);
            }
            // Upload thumbnail
            let thumbnailUrl = "";
            if (thumbnailFile) {
                const formData = new FormData();
                formData.append("file", thumbnailFile);
                const res = await newRequest.post("/content/actuals/upload-file", formData, {
                    headers: {"Content-Type": "multipart/form-data"}
                });
                thumbnailUrl = res.data.url;
            }
            // Send all data
            await newRequest.post("/content/actuals/create", {
                title: actualForm.title,
                urls,
                thumbnail: thumbnailUrl
            });
            showAlert("Актуальне додано", "Успіх", "success");
            setActualForm({title: "", urls: [], thumbnail: ""});
            setActualFiles([]);
            setActualFilesPreview([]);
            setThumbnailFile(null);
            setThumbnailFilePreview(null);
            refreshActuals();
            handleClose();
        } catch {
            showAlert("Помилка при додаванні актуального", "Помилка", "error");
        }
        setLoading(false);
    };

    const handleOpen = (type: DialogType) => {
        setDialogType(type);
        setOpen(true);
        setFile(null);
    };

    const handleClose = () => {
        setOpen(false);
        setDialogType(null);
        setFile(null);
    };

    const handleActualFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setActualFiles(file ? [file] : []);
        setActualFilesPreview(file ? [URL.createObjectURL(file)] : []);
    };


    const handleActualFileUpload = async () => {
        if (!actualFiles.length) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("file", actualFiles[0]);
        try {
            const res = await newRequest.post("/content/actuals/upload-file", formData, {
                headers: {"Content-Type": "multipart/form-data"}
            });
            setActualForm({...actualForm, urls: [...actualForm.urls, res.data.url]});
            showAlert("Файл успішно завантажено", "Успіх", "success");
        } catch {
            showAlert("Помилка при завантаженні файлу", "Помилка", "error");
        }
        setLoading(false);
    };

    const handleThumbnailFileUpload = async () => {
        if (!thumbnailFile) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("file", thumbnailFile);
        try {
            const res = await newRequest.post("/content/actuals/upload-file", formData, {
                headers: {"Content-Type": "multipart/form-data"}
            });
            setActualForm({...actualForm, thumbnail: res.data.url});
            showAlert("Thumbnail успішно завантажено", "Успіх", "success");
        } catch {
            showAlert("Помилка при завантаженні thumbnail", "Помилка", "error");
        }
        setLoading(false);
    };

    const handleContentFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContentFile(e.target.files?.[0] || null);
    };

    const handleUploadActualContent = async () => {
        if (!contentFile || !selectedActualId) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("file", contentFile);
        try {
            await newRequest.post(`/content/actuals/${selectedActualId}/upload`, formData, {
                headers: {"Content-Type": "multipart/form-data"}
            });
            showAlert("Контент додано до актуального", "Успіх", "success");
            setContentFile(null);
            setSelectedActualId(null);
            setOpen(false);
            refreshActuals();
        } catch {
            showAlert("Помилка при завантаженні контенту", "Помилка", "error");
        }
        setLoading(false);
    };

    const handleSliderFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSliderFile(e.target.files?.[0] || null);
    };

    const handleUploadSlider = async () => {
        if (!sliderFile) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("file", sliderFile);
        try {
            await newRequest.post("/content/slider/upload-single", formData, {
                headers: {"Content-Type": "multipart/form-data"}
            });
            showAlert("Фото для слайдеру додано", "Успіх", "success");
            setSliderFile(null);
            refreshSlider();
            handleClose();
        } catch {
            showAlert("Помилка при додаванні фото для слайдеру", "Помилка", "error");
        }
        setLoading(false);
    };

    const renderReviewForm = () => (
        <Box className={styles.content}>
            <Input
                placeholder="Ім'я"
                value={reviewForm.fullName}
                onChange={e => setReviewForm({...reviewForm, fullName: e.target.value})}
                sx={{width: "100%"}}
            />
            <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                style={{display: "none"}}
                onChange={handleAvatarSelect}
            />
            <ButtonUI color="secondary" onClick={() => avatarInputRef.current?.click()}>
                Вибрати аватар
            </ButtonUI>
            {avatarFile && (
                <Box sx={{mt: 2}}>
                    <img src={URL.createObjectURL(avatarFile)} alt="avatar" style={{width: 80, borderRadius: 8}}/>
                </Box>
            )}
            <select
                value={reviewForm.rating}
                onChange={e => setReviewForm({...reviewForm, rating: Number(e.target.value)})}
                style={{width: "100%", marginTop: 8, padding: 8, borderRadius: 8}}
            >
                {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <Input
                placeholder="Кількість відгуків"
                value={reviewForm.reviews}
                onChange={e => setReviewForm({...reviewForm, reviews: e.target.value})}
                sx={{width: "100%"}}
            />
            <Input
                placeholder="Скільки часу тому"
                value={reviewForm.ago}
                onChange={e => setReviewForm({...reviewForm, ago: e.target.value})}
                sx={{width: "100%"}}
            />
            <Input
                placeholder="Роль"
                value={reviewForm.role}
                onChange={e => setReviewForm({...reviewForm, role: e.target.value})}
                sx={{width: "100%"}}
            />
            <Textarea
                placeholder="Текст відгуку"
                value={reviewForm.text}
                onChange={e => setReviewForm({...reviewForm, text: e.target.value})}
                sx={{width: "100%"}}
                minRows={3}
            />
            <input
                ref={reviewPhotoInputRef}
                type="file"
                accept="image/*"
                style={{display: "none"}}
                onChange={handleReviewPhotoSelect}
            />
            <ButtonUI color="secondary" onClick={() => reviewPhotoInputRef.current?.click()}>
                Вибрати фото для відгуку
            </ButtonUI>
            {reviewPhotoFile && (
                <Box sx={{mt: 2}}>
                    <img src={URL.createObjectURL(reviewPhotoFile)} alt="review-photo"
                         style={{width: 120, borderRadius: 8}}/>
                </Box>
            )}
            <ButtonUI color="primary" onClick={handleAddReview}>
                Додати відгук
            </ButtonUI>
        </Box>
    );

    const renderSliderForm = () => (
        <Box className={styles.content}>
            <input
                ref={sliderFileInputRef}
                type="file"
                accept="image/*"
                style={{display: "none"}}
                onChange={handleSliderFileSelect}
            />
            <ButtonUI color="secondary" onClick={() => sliderFileInputRef.current?.click()}>
                Вибрати фото для слайдеру
            </ButtonUI>
            {sliderFile && (
                <Box sx={{mt: 2}}>
                    <img src={URL.createObjectURL(sliderFile)} alt={sliderFile.name}
                         style={{width: 120, borderRadius: 8}}/>
                </Box>
            )}
            <ButtonUI color="primary" onClick={handleUploadSlider}>
                Додати фото
            </ButtonUI>
        </Box>
    );


    const handleUpload = async () => {
        if (!file || !dialogType) return;
        const formData = new FormData();
        formData.append("file", file);
        setLoading(true)
        let endpoint = "";
        switch (dialogType) {
            case "story":
                endpoint = "/content/stories/upload";
                break;
            default:
                endpoint = "";
        }
        if (!endpoint) return;

        try {
            setLoading(true)
            await newRequest.post(endpoint, formData, {
                headers: {"Content-Type": "multipart/form-data"}
            });
            showAlert("Файл успішно завантажено", "Все чудово", "success");
            setLoading(false)
            handleClose();
        } catch (err) {
            showAlert("Сталась невідома помилка, спробуйте знову", "Все погано", "error");
        }
        setLoading(false)
    };

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const renderPostForm = () => (
        <Box className={styles.content}>
            <input
                ref={postFileInputRef}
                type="file"
                accept="image/*,video/*"
                style={{display: "none"}}
                onChange={handlePostFileSelect}
            />
            <ButtonUI color="secondary" onClick={() => postFileInputRef.current?.click()}>
                Вибрати фото/відео
            </ButtonUI>
            {postFile && (
                <Box sx={{mt: 2}}>
                    {postFile.type.startsWith("image") ? (
                        <img src={URL.createObjectURL(postFile)} alt={postFile.name}
                             style={{width: 120, borderRadius: 8}}/>
                    ) : (
                        <video src={URL.createObjectURL(postFile)} controls style={{width: 120, borderRadius: 8}}/>
                    )}
                </Box>
            )}
            <Textarea
                placeholder="Текст посту (можна використовувати HTML)"
                value={postText}
                onChange={e => setPostText(e.target.value)}
                sx={{width: "100%", mt: 2}}
                minRows={3}
            />
            <ButtonUI color="primary" onClick={handleUploadPost}>
                Додати пост
            </ButtonUI>
        </Box>
    );

    const renderActualForm = () => (
        <Box className={styles.content}>
            <Input
                placeholder="Заголовок"
                value={actualForm.title}
                onChange={e => setActualForm({...actualForm, title: e.target.value})}
                sx={{width: "100%"}}
            />
            <input
                ref={actualFilesInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                style={{display: "none"}}
                onChange={handleActualFilesSelect}
            />
            <ButtonUI color="secondary" onClick={() => actualFilesInputRef.current?.click()}>
                Вибрати фото/відео для контенту (до 5)
            </ButtonUI>
            <Box sx={{display: "flex", gap: 2, flexWrap: "wrap", mt: 2}}>
                {actualFilesPreview.map((preview, idx) => (
                    actualFiles[idx].type.startsWith("image") ? (
                        <img key={idx} src={preview} alt={`preview-${idx}`} style={{width: 80, borderRadius: 8}}/>
                    ) : (
                        <video key={idx} src={preview} controls style={{width: 80, borderRadius: 8}}/>
                    )
                ))}
            </Box>
            {/* Hidden input for thumbnail */}
            <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                style={{display: "none"}}
                onChange={handleThumbnailFileSelect}
            />
            <ButtonUI color="secondary" onClick={() => thumbnailInputRef.current?.click()}>
                Вибрати thumbnail
            </ButtonUI>
            {thumbnailFilePreview && (
                <Box sx={{mt: 2}}>
                    <img src={thumbnailFilePreview} alt="thumbnail" style={{width: 120, borderRadius: 8}}/>
                </Box>
            )}
            <ButtonUI color="primary" onClick={handleAddActual}>
                Додати актуальне
            </ButtonUI>
        </Box>
    );

    const renderUploadToActual = () => {
        const actual = actuals.find(a => a._id === selectedActualId);
        return (
            <Box className={styles.content}>
                <Typography sx={{mb: 2}}>
                    Додати контент до: {actual?.title}
                </Typography>
                <input
                    ref={uploadToActualFileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    style={{display: "none"}}
                    onChange={handleContentFileSelect}
                />
                <ButtonUI color="secondary" onClick={() => uploadToActualFileInputRef.current?.click()}>
                    Вибрати файл
                </ButtonUI>
                {contentFile && (
                    <Box sx={{mt: 2}}>
                        {contentFile.type.startsWith("image") ? (
                            <img src={URL.createObjectURL(contentFile)} alt={contentFile.name}
                                 style={{width: 120, borderRadius: 8}}/>
                        ) : (
                            <video src={URL.createObjectURL(contentFile)} controls
                                   style={{width: 120, borderRadius: 8}}/>
                        )}
                    </Box>
                )}
                <ButtonUI
                    color="primary"
                    onClick={handleUploadActualContent}
                    loading={loading}
                    disabled={!contentFile}
                >
                    Завантажити контент
                </ButtonUI>
            </Box>
        );
    };

    const renderActualsList = () => (
        <div className={styles.mediaPreviewGrid}>
            {actuals.map(actual => (
                <div key={actual._id} className={styles.mediaPreviewItem}>
                    <Image src={actual.thumbnail} alt={actual.title} width={80} height={80}
                           style={{objectFit: "cover", borderRadius: 8}}/>
                    <Typography level="body-md">{actual.title}</Typography>
                    <ButtonUI color="secondary" onClick={() => {
                        setSelectedActualId(actual._id);
                        setDialogType("actual");
                        setOpen(true);
                    }}>
                        Додати контент
                    </ButtonUI>
                </div>
            ))}
        </div>
    );


    const renderContent = () => {
        switch (dialogType) {
            case "story":
                return (
                    <div className={styles.content}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            className={styles.fileInput}
                            onChange={handleFileChange}
                        />
                        {file && (
                            <Badge
                                onClick={() => setFile(null)}
                                badgeContent={<CloseIcon fontSize="small"/>}
                                color="error"
                            >
                                <div className={styles.filePreviewRow}>
                                    {file.type.startsWith("image") && (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className={styles.filePreviewImg}
                                        />
                                    )}
                                    {file.type.startsWith("video") && (
                                        <video
                                            src={URL.createObjectURL(file)}
                                            controls
                                            className={styles.filePreviewVideo}
                                        />
                                    )}
                                    <div className={styles.fileNameBadge}>
                                        {file.name}
                                    </div>
                                </div>
                            </Badge>
                        )}
                        <div className={styles.uploadBtn}>
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
                        <Dialog
                            open={cropOpen}
                            onClose={() => setCropOpen(false)}
                            fullWidth
                            maxWidth="sm"
                            PaperProps={{
                                sx: {
                                    minHeight: 500,
                                    height: "80vh",
                                    display: "flex",
                                    flexDirection: "column",
                                    background: "#fff",
                                }
                            }}
                        >
                            <DialogContent
                                sx={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    p: 0,
                                }}
                            >
                                {file && file.type.startsWith("image") && (
                                    <>
                                        <div style={{width: "100%", height: "60vh", position: "relative"}}>
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
                                        <Slider
                                            value={zoom}
                                            min={1}
                                            max={3}
                                            step={0.01}
                                            onChange={(_, value) => setZoom(Number(value))}
                                            sx={{width: "80%", mt: 2}}
                                            aria-label="Zoom"
                                        />
                                    </>
                                )}
                            </DialogContent>
                            <DialogActions sx={{justifyContent: "center", pb: 2}}>
                                <ButtonUI color="primary" onClick={handleCropSave}>
                                    Зберегти Кадрування
                                </ButtonUI>
                            </DialogActions>
                        </Dialog>
                    </div>
                );
            case "actual":
                return selectedActualId ? renderUploadToActual() : renderActualForm();
            case "post":
                return renderPostForm();
            case "slider":
                return renderSliderForm();
            case "main-section":
                return (
                    <Box
                        className={styles.content}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            width: "100%",
                            alignItems: "stretch",
                        }}
                    >
                        <Typography level="body-md">Заголовок</Typography>
                        <Input
                            placeholder="Заголовок"
                            value={mainForm.title}
                            onChange={e => setMainForm({...mainForm, title: e.target.value})}
                            sx={{width: "100%"}}
                        />
                        <Typography level="body-md">Кількість публікацій</Typography>
                        <Input
                            placeholder="Кількість публікацій"
                            type="number"
                            value={mainForm.publications}
                            onChange={e => setMainForm({...mainForm, publications: Number(e.target.value)})}
                            sx={{width: "100%"}}
                        />
                        <Typography level="body-md">Кількість підписників</Typography>
                        <Input
                            placeholder="Кількість підписників"
                            type="number"
                            value={mainForm.followers}
                            onChange={e => setMainForm({...mainForm, followers: Number(e.target.value)})}
                            sx={{width: "100%"}}
                        />
                        <Typography level="body-md">Кількість учнів</Typography>
                        <Input
                            placeholder="Кількість учнів"
                            value={mainForm.students}
                            onChange={e => setMainForm({...mainForm, students: e.target.value})}
                            sx={{width: "100%"}}
                        />
                        <Typography level="body-md">Опис</Typography>
                        <Textarea
                            placeholder="Опис"
                            value={mainForm.description}
                            onChange={e => setMainForm({...mainForm, description: e.target.value})}
                            sx={{width: "100%"}}
                            minRows={3}
                        />
                        <ButtonUI color="primary" onClick={handleSaveMainSection} loading={mainLoading}>
                            Зберегти
                        </ButtonUI>
                    </Box>
                );
            case "review-photo":
                return <div>Форма для додавання фото відгуку</div>;
            case "review":
                return renderReviewForm();
            case "instructor":
                return <div>Форма для додавання інструктора</div>;
            default:
                return null;
        }
    };

    const renderActualsGrid = () => (
        <div className={styles.mediaPreviewGrid}>
            {actuals.map(actual => (
                <div
                    key={actual._id}
                    className={styles.mediaPreviewItem}
                    style={{cursor: "pointer"}}
                    onClick={() => {
                        setSelectedActualId(actual._id);
                        setDialogType("actual");
                        setOpen(true);
                    }}
                >
                    <Image
                        src={actual.thumbnail}
                        alt={actual.title}
                        width={80}
                        height={80}
                        style={{objectFit: "cover", borderRadius: 8}}
                    />
                    <Typography level="body-md">{actual.title}</Typography>
                </div>
            ))}
        </div>
    );

    const getDialogTitle = () => {
        if (dialogType === "actual" && selectedActualId) {
            const actual = actuals.find(a => a._id === selectedActualId);
            return `Додати фото/відео до актуального (${actual?.title || ""})`;
        }
        if (dialogType === "main-section") return "Редагувати головний блок сайту";
        switch (dialogType) {
            case "story":
                return "Блок для додавання сторіс, завантажте фото або відео форматом 9:16 максимум 15 секунд до 5 мб";
            case "actual":
                return "Додати актуальне";
            case "post":
                return "Додати пост";
            case "slider":
                return "Додати фото для слайдеру";
            case "review-photo":
                return "Додати фото відгуку";
            case "review":
                return "Додати відгук";
            case "instructor":
                return "Додати інструктора";
            default:
                return "";
        }
    };

    return (
        <>
            <div className={styles.wrapper}>
                <Divider title="Адмін Панель" description="Керування контентом сайту"/>
                <div className={styles.functionality}>
                    <Divider title="Головний блок сайту" description="Редагування заголовків і опису"/>
                    <ButtonUI color="tertiary" onClick={() => {
                        setDialogType("main-section");
                        setOpen(true);
                    }}>
                        Змінити
                    </ButtonUI>
                </div>
                <StoriesFunctionallity/>
                <ActualsFunctionality/>
                <PostsFunctionality/>
                <SliderFunctionality/>
                <AddReviewFunctionallity/>
                <AddInstructorFunctionality/>
                <AddFAQFunctionallity/>
                <FeaturesFunctionallity/>
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                sx={{"& .MuiDialog-paper": {minWidth: 350}}}
            >
                <DialogTitle>{getDialogTitle()}</DialogTitle>
                <DialogContent>
                    {renderContent()}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AdminContent;