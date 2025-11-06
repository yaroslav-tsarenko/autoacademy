import React, { useState } from "react";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import { Textarea } from "@mui/joy";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import ButtonUI from "@/ui/button/ButtonUI";
import Divider from "@/components/divider/Divider";
import { useAlert } from "@/context/AlertContext";
import { newRequest } from "@/utils/newRequest";
import { useContent, Faq } from "@/context/ContentContext";
import styles from "./AdminContent.module.scss";

type FAQItem = {
    _id?: string;
    question: string;
    answer: string;
};

const AddFAQFunctionallity: React.FC = () => {
    const { faqs = [], refreshFaqs } = useContent();
    const { showAlert } = useAlert();

    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState<FAQItem>({ question: "", answer: "" });

    const openForCreate = () => {
        setEditId(null);
        setForm({ question: "", answer: "" });
        setOpen(true);
    };

    const openForEdit = (item: Faq) => {
        setEditId(item._id ?? null);
        setForm({ question: item.question, answer: item.answer });
        setOpen(true);
    };

    const handleSave = async () => {
        if (!form.question.trim() || !form.answer.trim()) {
            showAlert("Заповніть питання та відповідь", "Помилка", "error");
            return;
        }
        try {
            if (editId) {
                await newRequest.put(`/content/faqs/${editId}`, { question: form.question, answer: form.answer });
                showAlert("FAQ оновлено", "Успіх", "success");
            } else {
                await newRequest.post("/content/faqs/create", { question: form.question, answer: form.answer });
                showAlert("FAQ додано", "Успіх", "success");
            }
            setOpen(false);
            refreshFaqs?.();
        } catch {
            showAlert("Помилка при збереженні FAQ", "Помилка", "error");
        }
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        try {
            await newRequest.delete(`/content/faqs/${id}`);
            showAlert("FAQ видалено", "Успіх", "success");
            refreshFaqs?.();
        } catch {
            showAlert("Не вдалося видалити FAQ", "Помилка", "error");
        }
    };

    return (
        <div className={styles.functionality}>
            <Divider title="Додати питання\відповідь" description="Можливо додавати, редагувати, видаляти" />
            <div className={styles.addBtn}>
                <ButtonUI color="tertiary" onClick={openForCreate}>
                    Додати FAQ
                </ButtonUI>
            </div>

            <div className={styles.list}>
                {faqs.map((f: Faq, idx: number) => (
                    <div key={f._id ?? idx} className={styles.faqItem}>
                        <div className={styles.faqHeader}>
                            <Typography level="body-lg" className={styles.question}>
                                {f.question}
                            </Typography>
                            <Typography level="body-sm" className={styles.answer}>
                                {f.answer}
                            </Typography>
                        </div>
                        <div className={styles.buttons}>
                            <span className={styles.btn}>
                                <ButtonUI color="secondary" onClick={() => openForEdit(f)}>
                                    Редагувати
                                </ButtonUI>
                            </span>
                            <span className={styles.btn}>
                                <ButtonUI color="error" onClick={() => handleDelete(f._id)}>
                                    Видалити
                                </ButtonUI>
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editId ? "Редагувати FAQ" : "Додати FAQ"}</DialogTitle>
                <DialogContent>
                    <div className={styles.formRow}>
                        <Input
                            placeholder="Питання"
                            value={form.question}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, question: e.target.value })}
                            className={styles.input}
                        />
                        <Textarea
                            placeholder="Відповідь"
                            value={form.answer}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setForm({ ...form, answer: e.target.value })}
                            minRows={4}
                            className={styles.textarea}
                        />
                    </div>
                </DialogContent>
                <DialogActions className={styles.dialogActions}>
                    <ButtonUI color="primary" onClick={() => setOpen(false)}>Скасувати</ButtonUI>
                    <ButtonUI color="secondary" onClick={handleSave}>Зберегти</ButtonUI>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AddFAQFunctionallity;
