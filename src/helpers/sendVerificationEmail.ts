import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> 
{
    try {
        // Check if Resend API key is configured
        if (!process.env.RESEND_API_KEY) {
            console.error("RESEND_API_KEY is not configured");
            return {
                success: false, 
                message: "Email service is not configured. Please contact support."
            };
        }

        // Add timeout handling
        const emailPromise = resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'AnonChat | Verification Code',
            react: VerificationEmail({username, otp: verifyCode}),
        });

        // Set a timeout for the email sending
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Email sending timeout')), 15000); // 15 second timeout
        });

        await Promise.race([emailPromise, timeoutPromise]);
        
        return {success: true, message: "Verification Email Sent Successfully"};

    } catch (emailError: any) {
        console.error("Error Sending Verification Email", emailError);
        
        let errorMessage = "Failed to send Verification Email";
        
        if (emailError.message === 'Email sending timeout') {
            errorMessage = "Email sending timed out. Please try again.";
        } else if (emailError.message?.includes('API key')) {
            errorMessage = "Email service configuration error. Please contact support.";
        }
        
        return {success: false, message: errorMessage};
    }    
}
