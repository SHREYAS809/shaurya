import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv

load_dotenv()

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY", "YOUR_SENDGRID_API_KEY")
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "your-verified-sender@example.com")

def send_otp_email(email: str, otp: str):
    """
    Sends a premium-branded OTP email using SendGrid.
    """
    if SENDGRID_API_KEY == "YOUR_SENDGRID_API_KEY":
        print(f"DEBUG: OTP for {email} is {otp} (SendGrid not configured)")
        return True

    message = Mail(
        from_email=SENDER_EMAIL,
        to_emails=email,
        subject='Sri Shaurya Medicals - Your Verification Code',
        html_content=f'''
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #ff4d4f; margin: 0;">Sri Shaurya Medicals</h1>
                <p style="color: #666; margin-top: 5px;">Your trusted online pharmacy</p>
            </div>
            
            <div style="background-color: #f9f9f9; padding: 30px; border-radius: 8px; text-align: center;">
                <h2 style="color: #333; margin-top: 0;">Verify Your Email</h2>
                <p style="color: #555; font-size: 16px;">Please use the following code to complete your registration:</p>
                <div style="background-color: #fff; border: 2px dashed #ff4d4f; padding: 15px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ff4d4f; display: inline-block; margin: 20px 0; border-radius: 5px;">
                    {otp}
                </div>
                <p style="color: #999; font-size: 14px;">This code will expire in 10 minutes.</p>
            </div>
            
            <div style="margin-top: 30px; text-align: center; color: #999; font-size: 12px;">
                <p>© 2026 Sri Shaurya Medicals. All rights reserved.</p>
                <p>If you didn't request this code, please ignore this email.</p>
            </div>
        </div>
        '''
    )
    
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"Email sent with status code: {response.status_code}")
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        # In development, we return True so flow doesn't break, but log error
        return False
