import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "firebase/auth";

import { auth } from "@/firebase/config";

export const sendFirebaseOtp = async (
    phone,
    recaptchaId
) => {

    try {

        if (!window.recaptchaVerifier) {

            window.recaptchaVerifier =
                new RecaptchaVerifier(
                    auth,
                    recaptchaId,
                    {
                        size: "invisible",
                    }
                );

            await window.recaptchaVerifier.render();
        }

        const appVerifier =
            window.recaptchaVerifier;

        const confirmationResult =
            await signInWithPhoneNumber(
                auth,
                phone,
                appVerifier
            );

        window.confirmationResult =
            confirmationResult;

        return {
            success: true,
        };

    } catch (error) {

        console.log(error);

        return {
            success: false,
            error,
        };
    }
};

export const verifyFirebaseOtp = async (
    otp
) => {

    try {

        const result =
            await window.confirmationResult.confirm(
                otp
            );

        return {
            success: true,
            user: result.user,
        };

    } catch (error) {

        console.log(error);

        return {
            success: false,
            error,
        };
    }
};