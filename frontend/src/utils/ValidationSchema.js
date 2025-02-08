import * as yup from "yup";

const baseSchema = {
    email: yup
        .string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
    password: yup
        .string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .required("Vui lòng nhập mật khẩu"),
};

export const loginSchema = yup.object().shape(baseSchema);

export const signupSchema = yup.object().shape({
    username: yup.string().required("Tên người dùng không được để trống"),
    ...baseSchema,
});
