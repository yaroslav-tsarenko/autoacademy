import React, { useEffect, useState } from "react";
import Divider from "@/components/divider/Divider";
import ButtonUI from "@/ui/button/ButtonUI";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/joy/Box";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import { Textarea } from "@mui/joy";
import { useAlert } from "@/context/AlertContext";
import { useContent, Tariff } from "@/context/ContentContext";
import styles from "./AdminContent.module.scss";

const FeaturesFunctionallity: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: "",
        price: "",
        featuresText: "",
        buttonText: "Записатися",
        popular: false,
    });
    const [selected, setSelected] = useState<Tariff | null>(null);

    const { showAlert } = useAlert();
    const { tariffs, refreshTariffs, createTariff, updateTariff, deleteTariff } = useContent();

    useEffect(() => {
        refreshTariffs();
    }, []);

    const resetForm = () =>
        setForm({ title: "", price: "", featuresText: "", buttonText: "Записатися", popular: false });

    const handleAdd = async () => {
        if (!form.title || !form.price) {
            showAlert("Заповніть назву та ціну", "Помилка", "error");
            return;
        }
        setLoading(true);
        try {
            await createTariff({
                title: form.title,
                price: form.price,
                features: form.featuresText.split("\n").map(s => s.trim()).filter(Boolean),
                buttonText: form.buttonText,
                popular: Boolean(form.popular),
            });
            showAlert("Тариф додано", "Успіх", "success");
            resetForm();
            setOpen(false);
            await refreshTariffs();
        } catch {
            showAlert("Не вдалося додати тариф", "Помилка", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleEditOpen = (t: Tariff) => {
        setSelected(t);
        setForm({
            title: t.title,
            price: t.price,
            featuresText: (t.features || []).join("\n"),
            buttonText: t.buttonText || "Записатися",
            popular: Boolean(t.popular),
        });
        setEditOpen(true);
    };

    const handleUpdate = async () => {
        if (!selected) return;
        setLoading(true);
        try {
            await updateTariff(selected._id, {
                title: form.title,
                price: form.price,
                features: form.featuresText.split("\n").map(s => s.trim()).filter(Boolean),
                buttonText: form.buttonText,
                popular: Boolean(form.popular),
            });
            showAlert("Тариф оновлено", "Успіх", "success");
            setEditOpen(false);
            setSelected(null);
            resetForm();
            await refreshTariffs();
        } catch {
            showAlert("Не вдалося оновити тариф", "Помилка", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selected) return;
        setLoading(true);
        try {
            await deleteTariff(selected._id);
            showAlert("Тариф видалено", "Успіх", "success");
            setEditOpen(false);
            setSelected(null);
            resetForm();
            await refreshTariffs();
        } catch {
            showAlert("Не вдалося видалити тариф", "Помилка", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.functionality}>
            <Divider title="Тарифи та плани" description="Керування тарифами/планами на сайті" />
            <ButtonUI color="tertiary" onClick={() => setOpen(true)}>
                Додати тариф
            </ButtonUI>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
                {(tariffs || []).map(t => (
                    <div key={t._id} className={styles.mediaPreviewItem} style={{ cursor: "pointer" }}>
                        <Typography level="body-md" sx={{ fontWeight: 600 }}>
                            {t.title}
                        </Typography>
                        <Typography level="body-md">{t.price}</Typography>
                        <ButtonUI color="secondary" onClick={() => handleEditOpen(t)}>Редагувати</ButtonUI>
                    </div>
                ))}
            </div>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Додати тариф</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Typography level="body-md">Назва</Typography>
                        <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                        <Typography level="body-md">Ціна</Typography>
                        <Input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                        <Typography level="body-md">Особливості (по одному в рядку)</Typography>
                        <Textarea value={form.featuresText} onChange={e => setForm({ ...form, featuresText: e.target.value })} minRows={4} />
                        <Typography level="body-md">Текст кнопки</Typography>
                        <Input value={form.buttonText} onChange={e => setForm({ ...form, buttonText: e.target.value })} />
                        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <input type="checkbox" checked={form.popular} onChange={e => setForm({ ...form, popular: e.target.checked })} />
                            <span>Популярний</span>
                        </label>
                        <ButtonUI color="primary" loading={loading} onClick={handleAdd}>
                            Додати тариф
                        </ButtonUI>
                    </Box>
                </DialogContent>
            </Dialog>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Редагувати тариф</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                        <Input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                        <Textarea value={form.featuresText} onChange={e => setForm({ ...form, featuresText: e.target.value })} minRows={4} />
                        <Input value={form.buttonText} onChange={e => setForm({ ...form, buttonText: e.target.value })} />
                        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <input type="checkbox" checked={form.popular} onChange={e => setForm({ ...form, popular: e.target.checked })} />
                            <span>Популярний</span>
                        </label>
                        <div style={{ display: "flex", gap: 12 }}>
                            <ButtonUI color="primary" loading={loading} onClick={handleUpdate}>Зберегти</ButtonUI>
                            <ButtonUI color="error" loading={loading} onClick={handleDelete}>Видалити</ButtonUI>
                        </div>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FeaturesFunctionallity;
