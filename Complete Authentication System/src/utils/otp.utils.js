export const generateOtpCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export const generateOtpHtml = (otp) => {
    return `
    <!DOCTYPE html>
    <html>
    <body style="margin:0; background:#f5f5f5; font-family:Arial, sans-serif;">
        <div style="max-width:500px; margin:40px auto; padding:32px; background:#ffffff; border-radius:12px;">
            <h2 style="margin-top:0; color:#222;">
                Authentication System - <i>One Time Pass for Email Verification</i>
            </h2>

            <p style="color:#555; line-height:1.6;">
                Use the code below to verify your account.
            </p>

            <div style="
                margin:24px 0;
                padding:16px;
                background:#f8f9fa;
                border-radius:8px;
                text-align:center;
                font-size:32px;
                font-weight:bold;
                letter-spacing:6px;
                color:#111;
            ">
                ${otp}
            </div>

            <p style="color:#666; line-height:1.6;">
                If you didn't request this code, you can safely ignore this email.
            </p>

            <p style="margin-top:32px; color:#999; font-size:12px;">
                This is an automated email. Please do not reply.
            </p>
        </div>
    </body>
    </html>
    `;
};