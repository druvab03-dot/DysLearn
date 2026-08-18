import api from "./api";


// SIGNUP
export const signup = async (data) => {

    const response = await api.post(
        "/auth/signup",
        data
    );

    return response.data;
};


// SEND SIGNUP OTP
export const sendSignupOTP = async (
    identifier,
    type
) => {

    const response = await api.post(
        "/auth/signup/send-otp",
        {
            identifier,
            type
        }
    );

    return response.data;
};


// VERIFY SIGNUP OTP
export const verifySignupOTP = async (
    identifier,
    otp,
    type
) => {

    const response = await api.post(
        "/auth/signup/verify-otp",
        {
            identifier,
            otp,
            type
        }
    );

    return response.data;
};


// PASSWORD LOGIN
export const login = async (data) => {

    const response = await api.post(
        "/auth/login",
        data
    );

    return response.data;
};


// SEND LOGIN OTP
export const sendLoginOTP = async (identifier) => {

    const response = await api.post(
        "/auth/send-login-otp",
        {
            identifier
        }
    );

    return response.data;
};


// VERIFY LOGIN OTP
export const verifyLoginOTP = async (data) => {

    const response = await api.post(
        "/auth/verify-login-otp",
        data
    );

    return response.data;
};


// SEND FORGOT PASSWORD OTP
export const sendForgotPasswordOTP = async (
    identifier
) => {

    const response = await api.post(
        "/auth/forgot-password/send-otp",
        {
            identifier
        }
    );

    return response.data;
};


// RESET PASSWORD
export const resetPassword = async (data) => {

    const response = await api.post(
        "/auth/forgot-password/reset",
        data
    );

    return response.data;
};