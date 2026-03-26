

const getVerificationEmailTemplate = (BASE_URL,verificationToken) => {
  const verifyUrl = `${BASE_URL}/api/users/verify/${verificationToken}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f9f9f9; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center; }
    .button { display: inline-block; background-color: #007bff; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; margin-top: 20px; }
    .footer { margin-top: 30px; font-size: 12px; color: #888888; }
    .link-text { color: #007bff; word-break: break-all; font-size: 14px; }
  </style>
</head>
<body>

  <div class="container">
    <h2 style="color: #333; margin-bottom: 10px;">Verify your email address</h2>
    <p style="color: #555; font-size: 16px; margin-bottom: 20px;">
      Thanks for starting the new account creation process. We want to make sure it's really you.
    </p>

    <a href="${verifyUrl}" class="button" style="color: #ffffff;">Verify email</a>

    <p style="margin-top: 30px; color: #555;">
      Or paste this link into your browser:
    </p>
    <a href="${verifyUrl}" class="link-text">${verifyUrl}</a>

    <div class="footer">
      <p>If you didn't ask to verify this address, you can ignore this email.</p>
    </div>
  </div>

</body>
</html>
  `;
};

const getResetPasswordEmailTemplate = (BASE_URL,resetPasswordToken)=>{
  const resetURL = `${BASE_URL}/api/users/reset-password/${resetPasswordToken}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f9f9f9; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center; }
    .button { display: inline-block; background-color: #007bff; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; margin-top: 20px; }
    .footer { margin-top: 30px; font-size: 12px; color: #888888; }
    .link-text { color: #007bff; word-break: break-all; font-size: 14px; }
  </style>
</head>
<body>

  <div class="container">
    <h2 style="color: #333; margin-bottom: 10px;">Verify your email address for resetting password: </h2>
    <p style="color: #555; font-size: 16px; margin-bottom: 20px;">
      You requested for reseting password of the account registered with this email. We want to make sure it's really you.
    </p>

    <a href="${resetURL}" class="button" style="color: #ffffff;">Verify email</a>

    <p style="margin-top: 30px; color: #555;">
      Or paste this link into your browser:
    </p>
    <a href="${resetURL}" class="link-text">${resetURL}</a>

    <div class="footer">
      <p>If you didn't ask to reset the password for this account, you can ignore this email.</p>
    </div>
  </div>

</body>
</html>
  `;
};

export { getVerificationEmailTemplate,getResetPasswordEmailTemplate };