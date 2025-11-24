// File: `src/components/admin-content/AddInstructorFunctionallity.tsx`
import React, { useRef, useState } from "react";
import { useContent, Instructor } from "@/context/ContentContext";
import ButtonUI from "@/ui/button/ButtonUI";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/joy/Box";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Image from "next/image";
import styles from "./AdminContent.module.scss";
import { newRequest } from "@/utils/newRequest";
import { useAlert } from "@/context/AlertContext";
import Divider from "@/components/divider/Divider";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

const CHARACTERISTICS = [
    "10+ років досвіду",
    "Експерт з безпечного водіння",
    "Дружній та терплячий",
    "Сучасні методики",
    "Відмінні відгуки учнів",
    "Підтримка та мотивація",
    "Високий відсоток здачі",
    "Підготовка до іспитів",
    "Індивідуальний підхід",
];

const AddInstructorFunctionality: React.FC = () => {
    const { instructors, refreshInstructors } = useContent();
    const { showAlert } = useAlert();
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState<{
        fullName: string;
        description: string;
        characteristics: string[];
        photo: File | null;
    }>({
        fullName: "",
        description: "",
        characteristics: [],
        photo: null,
    });
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const photoInputRef = useRef<HTMLInputElement | null>(null);

    const handleOpen = (instructor?: Instructor) => {
        if (instructor) {
            setEditId(instructor._id);
            setForm({
                fullName: instructor.fullName,
                description: instructor.description,
                characteristics: instructor.characteristics,
                photo: null,
            });
            setPhotoPreview(instructor.photo || null);
        } else {
            setEditId(null);
            setForm({ fullName: "", description: "", characteristics: [], photo: null });
            setPhotoPreview(null);
        }
        setOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setForm((s) => ({ ...s, photo: file }));
        if (file) {
            const url = URL.createObjectURL(file);
            setPhotoPreview(url);
        } else {
            setPhotoPreview(null);
        }
    };

    const handleSave = async () => {
        if (!form.fullName.trim()) {
            showAlert("Вкажіть повне ім'я", "Помилка", "error");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("fullName", form.fullName);
            formData.append("description", form.description);
            formData.append("characteristics", JSON.stringify(form.characteristics));
            if (form.photo) formData.append("photo", form.photo);

            if (editId) {
                await newRequest.put(`/content/instructors/${editId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                showAlert("Інструктора оновлено", "Успіх", "success");
            } else {
                await newRequest.post("/content/instructors/create", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                showAlert("Інструктора додано", "Успіх", "success");
            }

            setOpen(false);
            setForm({ fullName: "", description: "", characteristics: [], photo: null });
            setPhotoPreview(null);
            await refreshInstructors();
        } catch {
            showAlert("Помилка при збереженні", "Помилка", "error");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await newRequest.delete(`/content/instructors/${id}`);
            showAlert("Інструктора видалено", "Успіх", "success");
            await refreshInstructors();
        } catch {
            showAlert("Помилка при видаленні", "Помилка", "error");
        }
    };

    return (
        <div className={styles.functionality}>
            <Divider title="Додати інструктора" description="Блок для додавання інструктора" />
            <ButtonUI color="tertiary" onClick={() => handleOpen()}>
                Додати інструктора
            </ButtonUI>

            <Box
                sx={{
                    display: "flex",
                    gap: 3,
                    flexWrap: "wrap",
                    marginTop: 3,
                    justifyContent: "stretch",
                }}
            >
                {instructors.map((inst) => (
                    <Box
                        key={inst._id}
                        sx={{
                            border: "1px solid #eee",
                            borderRadius: 8,
                            p: 3,
                            minWidth: 320,
                            flex: "1 1 320px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            boxShadow: "sm",
                            bgcolor: "#fff",
                        }}
                    >
                        <Image
                            src={inst.photo}
                            alt={inst.fullName}
                            width={120}
                            height={120}
                            style={{ borderRadius: 12, objectFit: "cover" }}
                        />
                        <Typography sx={{ mt: 2 }}>{inst.fullName}</Typography>
                        <Typography level="body-md" sx={{ mt: 1, mb: 1, textAlign: "center" }}>
                            {inst.description}
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center", mb: 2 }}>
                            {inst.characteristics.map((c, i) => (
                                <Box
                                    key={`${inst._id}-char-${i}`}
                                    component="span"
                                    sx={{
                                        px: 1,
                                        py: 0.5,
                                        bgcolor: "#f3f3f3",
                                        borderRadius: 4,
                                        fontSize: 13,
                                    }}
                                >
                                    {c}
                                </Box>
                            ))}
                        </Box>
                        <div className={styles.buttons}>
                            <ButtonUI color="secondary" onClick={() => handleOpen(inst)}>
                                Редагувати
                            </ButtonUI>
                            <ButtonUI color="error" onClick={() => handleDelete(inst._id)}>
                                Видалити
                            </ButtonUI>
                        </div>
                    </Box>
                ))}
            </Box>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editId ? "Редагувати інструктора" : "Додати інструктора"}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                        <Input
                            placeholder="Повне ім'я"
                            value={form.fullName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setForm({ ...form, fullName: e.target.value })
                            }
                            sx={{ width: "100%" }}
                        />
                        <Input
                            placeholder="Опис"
                            value={form.description}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setForm({ ...form, description: e.target.value })
                            }
                            sx={{ width: "100%" }}
                        />
                        <Select
                            multiple
                            value={form.characteristics}
                            onChange={(_e, value) =>
                                setForm({
                                    ...form,
                                    characteristics: Array.isArray(value) ? value : value ? [value] : []
                                })
                            }
                            placeholder="Оберіть характеристику"
                            sx={{ width: "100%", zIndex: 999999 }}
                            slotProps={{
                                listbox: {
                                    sx: {
                                        zIndex: 999999, // щоб точно було над попапом
                                    }
                                },
                                root: {
                                    sx: { zIndex: 999999 },
                                },
                                button: {
                                    sx: { zIndex: 999999 },
                                },
                            }}
                        >
                            {CHARACTERISTICS.map((c) => (
                                <Option key={c} value={c}>
                                    {c}
                                </Option>
                            ))}
                        </Select>

                        <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexDirection: "column" }}>
                            <ButtonUI color="secondary" onClick={() => photoInputRef.current?.click()}>
                                Обрати фото
                            </ButtonUI>
                            {photoPreview && (
                                <div style={{ width: 196, height: 196, position: "relative", borderRadius: 8, overflow: "hidden" }}>
                                    <Image src={photoPreview} alt="preview" fill style={{ objectFit: "cover" }} />
                                </div>
                            )}
                        </Box>

                        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
                            <ButtonUI color="primary" onClick={() => setOpen(false)}>
                                Скасувати
                            </ButtonUI>
                            <ButtonUI color="secondary" onClick={handleSave}>
                                Зберегти
                            </ButtonUI>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddInstructorFunctionality;
