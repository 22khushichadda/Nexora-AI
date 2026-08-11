import os
import smtplib

from email.message import EmailMessage

from dotenv import load_dotenv


load_dotenv()


SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")


def send_invitation_email(
    recipient_email: str,
    recipient_name: str,
    workspace_name: str,
    invitation_token: str
):

    if not SMTP_EMAIL or not SMTP_PASSWORD:

        raise ValueError(
            "SMTP_EMAIL or SMTP_PASSWORD is missing from .env"
        )


    # --------------------------------------------------
    # Invitation Link
    # --------------------------------------------------

    invitation_link = (
        f"http://localhost:5173/invite/{invitation_token}"
    )


    # --------------------------------------------------
    # Email
    # --------------------------------------------------

    message = EmailMessage()

    message["Subject"] = (
        "You're invited to join a Nexora AI workspace"
    )

    message["From"] = SMTP_EMAIL

    message["To"] = recipient_email


    message.set_content(

        f"""Hello {recipient_name},

You have been invited to join the workspace "{workspace_name}" on Nexora AI.

Click the link below to accept the invitation:

{invitation_link}

This invitation will expire in 7 days.

Regards,
Nexora AI
"""

    )


    # --------------------------------------------------
    # Send Email
    # --------------------------------------------------

    with smtplib.SMTP(
        "smtp.gmail.com",
        587
    ) as server:

        server.starttls()

        server.login(
            SMTP_EMAIL,
            SMTP_PASSWORD
        )

        server.send_message(message)


    return True