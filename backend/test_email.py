from app.services.email_service import send_invitation_email


send_invitation_email(

    recipient_email="khushichadda2004@gmail.com",

    recipient_name="Test User",

    workspace_name="Nexora AI",

    invitation_token="test-token-123"

)

print("Email sent successfully!")