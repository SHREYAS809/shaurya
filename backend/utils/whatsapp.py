def send_whatsapp_notification(phone: str, message: str):
    """
    Placeholder for WhatsApp API integration (e.g., Twilio, Meta WhatsApp Business API).
    Currently just logs the notification to the console.
    """
    print(f"\n--- WHATSAPP NOTIFICATION ---")
    print(f"To: {phone}")
    print(f"Message: {message}")
    print(f"------------------------------\n")
    return True

def get_status_message(name: str, order_id: str, status: str):
    messages = {
        "New": f"Hello {name},\nYour order #{order_id} has been received by Sri Shaurya Medicals and is being processed.",
        "Accepted": f"Hello {name},\nYour order #{order_id} has been accepted by Sri Shaurya Medicals.",
        "Ready": f"Your order #{order_id} is ready for pickup at Sri Shaurya Medicals.",
        "Dispatched": f"Your order #{order_id} has been dispatched and will reach you shortly.",
        "Completed": f"Thank you for choosing Sri Shaurya Medicals. Your order is completed."
    }
    return messages.get(status, f"Your order #{order_id} status has been updated to {status}.")
