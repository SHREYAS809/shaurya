def send_otp_email(email: str, otp: str):
    """
    OTP email stub — prints OTP to server console.
    Replace with a real email provider (SendGrid, Resend, etc.) when needed.
    """
    print(f"\n--- OTP EMAIL ---")
    print(f"To: {email}")
    print(f"OTP Code: {otp}")
    print(f"-----------------\n")
    return True
