import React, { useRef, useState } from "react";
import { useContent } from "@/context/ContentContext";
import Divider from "@/components/divider/Divider";
import ButtonUI from "@/ui/button/ButtonUI";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/joy/Box";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Image from "next/image";
import { useAlert } from "@/context/AlertContext";
import styles from "./AdminContent.module.scss";
import { newRequest } from "@/utils/newRequest";

type DialogType = "add" | "upload" | null;

const ActualsFunctionality: React.FC = () => {
    const { actuals, refreshActuals } = useContent();
    const { showAlert } = useAlert();

    // Dialog state
    const [open, setOpen] = useState(false);
    const [dialogType, setDialogType] = useState<DialogType>(null);
    const [selectedActualId, setSelectedActualId] = useState<string | null>(null);

    // Add Actual form state
    const [actualForm, setActualForm] = useState({ title: "", urls: [] as string[], thumbnail: "" });
    const [actualFiles, setActualFiles] = useState<File[]>([]);
    const [actualFilesPreview, setActualFilesPreview] = useState<string[]>([]);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailFilePreview, setThumbnailFilePreview] = useState<string | null>(null);
    const actualFilesInputRef = useRef<HTMLInputElement>(null);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);

    // Upload to Actual state
    const [contentFile, setContentFile] = useState<File | null>(null);
    const uploadToActualFileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);

    const handleActualFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []); // ⬅️ БЕЗ slice(0, 5)
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
                    headers: { "Content-Type": "multipart/form-data" }
                });
                urls.push(res.data.url);
            }
            // Upload thumbnail
            let thumbnailUrl = "";
            if (thumbnailFile) {
                const formData = new FormData();
                formData.append("file", thumbnailFile);
                const res = await newRequest.post("/content/actuals/upload-file", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
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
            setActualForm({ title: "", urls: [], thumbnail: "" });
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

    // Handlers for Upload to Actual
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
                headers: { "Content-Type": "multipart/form-data" }
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

    // Dialog open/close logic
    const handleOpenAddActual = () => {
        setDialogType("add");
        setSelectedActualId(null);
        setOpen(true);
    };
    const handleOpenUploadToActual = (id: string) => {
        setDialogType("upload");
        setSelectedActualId(id);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setDialogType(null);
        setSelectedActualId(null);
        setActualForm({ title: "", urls: [], thumbnail: "" });
        setActualFiles([]);
        setActualFilesPreview([]);
        setThumbnailFile(null);
        setThumbnailFilePreview(null);
        setContentFile(null);
    };

    // Render forms
    const renderActualForm = () => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Input
                placeholder="Заголовок"
                value={actualForm.title}
                onChange={e => setActualForm({ ...actualForm, title: e.target.value })}
                sx={{ width: "100%" }}
            />
            <input
                ref={actualFilesInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                style={{ display: "none" }}
                onChange={handleActualFilesSelect}
            />
            <ButtonUI color="secondary" onClick={() => actualFilesInputRef.current?.click()}>
                Вибрати фото/відео для контенту (до 5)
            </ButtonUI>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                {actualFilesPreview.map((preview, idx) => (
                    actualFiles[idx].type.startsWith("image") ? (
                        <img key={idx} src={preview} alt={`preview-${idx}`} style={{ width: 80, borderRadius: 8 }} />
                    ) : (
                        <video key={idx} src={preview} controls style={{ width: 80, borderRadius: 8 }} />
                    )
                ))}
            </Box>
            <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleThumbnailFileSelect}
            />
            <ButtonUI color="secondary" onClick={() => thumbnailInputRef.current?.click()}>
                Вибрати Обладинку
            </ButtonUI>
            {thumbnailFilePreview && (
                <Box sx={{ mt: 2 }}>
                    <img src={thumbnailFilePreview} alt="thumbnail" style={{ width: 120, borderRadius: 8 }} />
                </Box>
            )}
            <ButtonUI color="primary" onClick={handleAddActual} loading={loading} >
                Додати актуальне
            </ButtonUI>
        </Box>
    );

    const renderUploadToActual = () => {
        const actual = actuals.find(a => a._id === selectedActualId);
        return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography  sx={{ mb: 2 }}>
                    Додати контент до: {actual?.title}
                </Typography>
                <input
                    ref={uploadToActualFileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    style={{ display: "none" }}
                    onChange={handleContentFileSelect}
                />
                <ButtonUI color="secondary" onClick={() => uploadToActualFileInputRef.current?.click()} >
                    Вибрати файл
                </ButtonUI>
                {contentFile && (
                    <Box sx={{ mt: 2 }}>
                        {contentFile.type.startsWith("image") ? (
                            <img src={URL.createObjectURL(contentFile)} alt="preview" style={{ width: 120, borderRadius: 8 }} />
                        ) : (
                            <video src={URL.createObjectURL(contentFile)} controls style={{ width: 120, borderRadius: 8 }} />
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
                <ButtonUI
                    color="error"
                    onClick={async () => {
                        if (!selectedActualId) return;
                        setLoading(true);
                        try {
                            await newRequest.delete(`/content/actuals/${selectedActualId}`);
                            showAlert("Актуальне видалено", "Успіх", "success");
                            setOpen(false);
                            refreshActuals();
                        } catch {
                            showAlert("Помилка при видаленні актуального", "Помилка", "error");
                        }
                        setLoading(false);
                    }}
                >
                    Видалити актуальне
                </ButtonUI>
            </Box>
        );
    };
    // Actuals grid
    const renderActualsGrid = () => (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 24 }}>
            {actuals.map(actual => (
                <div
                    key={actual._id}
                    style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}
                    onClick={() => handleOpenUploadToActual(actual._id)}
                >
                    <Image
                        src={actual.thumbnail}
                        alt={actual.title}
                        width={80}
                        height={80}
                        style={{ objectFit: "cover", borderRadius: 8 }}
                    />
                    <Typography level="body-md">{actual.title}</Typography>
                </div>
            ))}
        </div>
    );

    return (
        <div className={styles.functionality}>
            <Divider title="Додати актуальне на сайт" description="Блок для додавання актуальних на сайт" />
            <ButtonUI color="tertiary" onClick={handleOpenAddActual}>
                Додати актуальне
            </ButtonUI>
            {renderActualsGrid()}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {dialogType === "add"
                        ? "Додати актуальне"
                        : `Додати контент до: ${actuals.find(a => a._id === selectedActualId)?.title || ""}`}
                </DialogTitle>
                <DialogContent>
                    {dialogType === "add" ? renderActualForm() : renderUploadToActual()}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ActualsFunctionality;