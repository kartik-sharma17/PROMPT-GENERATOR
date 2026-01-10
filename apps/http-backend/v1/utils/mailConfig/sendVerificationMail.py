from fastapi_mail import MessageSchema
from jinja2 import Template
from v1.utils.mailConfig.emailConfig import fastmail
from config import settings


async def SendVerificationEmail(email: str, name: str, token: str):
    try:
        verify_link = f"{settings.BASE_URL}/verify-account/{token}"

        with open("v1/utils/mailConfig/verifyMailTemplate.html") as f:
            html_template = Template(f.read())
            html_content = html_template.render(name=name, verify_link=verify_link)

        message = MessageSchema(
            subject="Verify Your Ai Prompt Generator Account",
            recipients=[email],
            body=html_content,
            subtype="html",
        )

        await fastmail.send_message(message)
        return True
    except Exception as e:
        print(f"somethings went wrong whiling sending email {e}")
        return False
