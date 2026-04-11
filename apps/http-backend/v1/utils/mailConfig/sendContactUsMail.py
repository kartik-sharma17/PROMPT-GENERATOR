from fastapi_mail import MessageSchema
from jinja2 import Template
from v1.utils.mailConfig.emailConfig import fastmail
from config import settings


async def SendContactResponseEmail(email: str, name: str):
    try:
        with open("v1/utils/mailConfig/verifyContactResponseTemplate.html") as f:
            html_template = Template(f.read())
            html_content = html_template.render(name=name)

        message = MessageSchema(
            subject="thank you contacting us",
            recipients=[email],
            body=html_content,
            subtype="html",
        )

        await fastmail.send_message(message)
        return True
    except Exception as e:
        print(f"somethings went wrong whiling sending email {e}")
        return False
