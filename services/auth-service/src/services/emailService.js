const transporter = require("../config/mailer-config");
require("dotenv").config();

const sendPasswordResetEmail = async (toEmail,password, rawToken) => {
  const resetURL = `${process.env.BASE_URLFRONTEND}/Parametres?token=${rawToken}&pass=${password}`;
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: "DXC-Password Reset Request",
    html: `
<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f8f9fa; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(120, 88, 166, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7858A6 0%, #9b7bc7 100%); padding: 40px 30px; text-align: center;">
            <div style="background-color: rgba(255, 255, 255, 0.15); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.1 7 14 7.9 14 9S13.1 11 12 11 10 10.1 10 9 10.9 7 12 7ZM12 17C10.9 17 10 16.1 10 15S10.9 13 12 13 14 13.9 14 15 13.1 17 12 17Z" fill="white"/>
              </svg>
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Password Reset</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px;">Secure your account with a new password</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #2d3748; margin: 0 0 15px; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
              <p style="color: #718096; margin: 0; font-size: 16px;">We received a request to reset your password. Click the button below to create a new one.</p>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 35px 0;">
              <a href="${resetURL}" 
                 style="display: inline-block; background: linear-gradient(135deg, #7858A6 0%, #9b7bc7 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(120, 88, 166, 0.3); transition: all 0.3s ease; text-align: center; min-width: 200px;"
                 target="_blank">
                Reset Password
              </a>
            </div>
            
            <!-- Alternative Link -->
            <div style="background-color: #f7fafc; border-radius: 8px; padding: 20px; margin: 30px 0; border-left: 4px solid #7858A6;">
              <p style="color: #4a5568; margin: 0 0 10px; font-size: 14px; font-weight: 600;">Can't click the button?</p>
              <p style="color: #718096; margin: 0; font-size: 14px; word-break: break-all;">Copy and paste this link into your browser:</p>
              <p style="color: #7858A6; margin: 5px 0 0; font-size: 14px; word-break: break-all;">${resetURL}</p>
            </div>
            
            <!-- Security Info -->
            <div style="text-align: center; margin-top: 30px;">
              <div style="display: inline-flex; align-items: center; background-color: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px; padding: 12px 16px; color: #c53030; font-size: 14px; margin-bottom: 20px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px; flex-shrink: 0;">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17L13.5 7.84L15.83 10.17L18.5 7.5L21 9ZM1 9L3.5 7.5L6.17 10.17L8.5 7.84L5.83 5.17L8.5 2.5L7 1L1 7V9ZM12 13C14.67 13 20 14.33 20 17V20H4V17C4 14.33 9.33 13 12 13Z" fill="currentColor"/>
                </svg>
                <strong>This link expires in 1 hour</strong>
              </div>
              <p style="color: #718096; margin: 0; font-size: 14px;">If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #a0aec0; margin: 0; font-size: 13px;">This is an automated message from DXC. Please do not reply to this email.</p>
            <div style="margin-top: 15px;">
              <span style="color: #7858A6; font-size: 18px; font-weight: 700;">DXC</span>
            </div>
          </div>
          
        </div>
        
        <!-- Spacer for mobile -->
        <div style="height: 20px;"></div>
      </body>
      </html>
`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendPasswordResetEmail,
};
