"use client"

import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import styles from "./BookingDialog.module.scss";
import TextField from "@mui/material/TextField";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { newRequest } from "@/utils/newRequest";
import { useAlert } from "@/context/AlertContext";
import ButtonUI from "@/ui/button/ButtonUI";
import IconButton from "@mui/material/IconButton";
import { LiaTimesSolid } from "react-icons/lia";
import { FcGoogle } from "react-icons/fc";
import { getUserInfo } from "@/utils/getUserInfo";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

interface BookingDialogProps {
    open: boolean;
    onClose: () => void;
}

const validationSchema = Yup.object({
    name: Yup.string().min(2, "Мінімум 2 символи").required("Вкажіть ім'я"),
    phone: Yup.string().min(10, "Вкажіть коректний номер").required("Вкажіть телефон"),
    comment: Yup.string().max(300, "Максимум 300 символів"),
});

const BookingDialog: React.FC<BookingDialogProps> = ({ open, onClose }) => {
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(false);
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    const handleSubmit = async (
        values: { name: string; phone: string; comment: string },
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        setLoading(true);
        try {
            const userInfo = await getUserInfo();
            await newRequest.post("/content/telegram/send", { ...values, ...userInfo });
            showAlert("Заявка успішно надіслана!", "Дякуємо!", "success");
            onClose();
            handleNavigateToThanksPage();
        } catch (err) {
            showAlert("Не вдалося надіслати заявку. Спробуйте ще раз.", "Помилка", "error");
        } finally {
            setSubmitting(false);
            setLoading(false);
        }
    };

    const handleNavigateToThanksPage = () => {
        window.location.href = "/thanks-page";
    };

    const googleLogin = useGoogleLogin({
        scope: "openid email profile",
        onSuccess: async ({ access_token }) => {
            try {
                const { data } = await axios.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    { headers: { Authorization: `Bearer ${access_token}` } }
                );

                const name = data.name || data.given_name || "";
                const email = data.email || "";          // <- головне
                const phoneFromGoogle =
                    data.phone_number || data.phone || ""; // зазвичай порожньо
                const userInfo = await getUserInfo();

                if (!email) {
                    showAlert(
                        "Google не повернув email. Спробуйте ще раз або заповніть форму вручну.",
                        "Помилка",
                        "error"
                    );
                    return;
                }

                const contactForPhoneField =
                    phoneFromGoogle && String(phoneFromGoogle).trim().length > 0
                        ? String(phoneFromGoogle)
                        : `${email}`;

                await newRequest.post("/content/telegram/send", {
                    name,
                    phone: contactForPhoneField,
                    email,
                    ...userInfo,
                    comment: phoneFromGoogle
                        ? "Авторизований через Google (телефон із профілю)"
                        : "Авторизований через Google (телефону немає, використано email)",
                });
                handleNavigateToThanksPage();
                showAlert("Заявка успішно надіслана!", "Дякуємо!", "success");
                onClose();
            } catch {
                showAlert("Не вдалося авторизуватись через Google.", "Помилка", "error");
            }
        },
        onError: () => showAlert("Помилка авторизації Google", "Помилка", "error"),
    });

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Записатись</DialogTitle>
            <DialogContent sx={{ padding: "0 24px" }}>
                Щоб записатись, введіть будь ласка свої дані
            </DialogContent>
            <div className={styles.times}>
                <IconButton color={"error"} onClick={onClose}>
                    <LiaTimesSolid size={24} />
                </IconButton>
            </div>
            <Formik
                initialValues={{ name: "", phone: "", comment: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      setFieldValue,
                      isSubmitting,
                      submitForm,
                  }) => (
                    <Form>
                        <DialogContent sx={{ margin: 0 }}>
                            <TextField
                                label="Ім'я"
                                name="name"
                                fullWidth
                                margin="normal"
                                value={values.name}
                                onChange={handleChange}
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                                autoFocus
                                sx={{ mb: 2 }}
                            />
                            <PhoneInput
                                country={"ua"}
                                value={values.phone}
                                onChange={phone => setFieldValue("phone", phone)}
                                inputStyle={{ width: "100%", fontWeight: 300 }}
                                inputProps={{
                                    name: "phone",
                                    required: true,
                                    autoFocus: false,
                                }}
                                specialLabel="Телефон"
                            />
                            {touched.phone && errors.phone && (
                                <div style={{ color: "#d32f2f", marginBottom: 8, fontSize: 13 }}>
                                    {errors.phone}
                                </div>
                            )}
                            <TextField
                                label="Коментар"
                                name="comment"
                                fullWidth
                                margin="normal"
                                multiline
                                rows={3}
                                value={values.comment}
                                onChange={handleChange}
                                error={touched.comment && Boolean(errors.comment)}
                                helperText={touched.comment && errors.comment}
                            />
                            {Object.values(errors).length > 0 && (
                                <div className={styles.formErrors}>
                                    {Object.entries(errors).map(([key, error]) => (
                                        <div key={key} style={{ color: "#d32f2f", fontSize: 13, marginBottom: 4 }}>
                                            {error as string}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </DialogContent>
                        <div className={styles.actions}>
                            <ButtonUI
                                color="secondary"
                                loading={loading}
                                onClick={submitForm}
                            >
                                Надіслати
                            </ButtonUI>
                            <div className={styles.separator}>
                                <hr />
                                Або
                                <hr />
                            </div>
                            <p>
                                Записатись через Google
                            </p>
                                <IconButton
                                    sx={{ width: "fit-content", margin: "0 auto" }}
                                    onClick={() => googleLogin()}
                                >
                                    <FcGoogle size={45} />
                                </IconButton>
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default BookingDialog;