import resend
from jinja2 import Template
from config import settings

resend.api_key = settings.RESEND_API_KEY


async def SendContactResponseEmail(email: str, name: str):
    try:
        with open("v1/utils/mailConfig/verifyContactResponseTemplate.html") as f:
            html_template = Template(f.read())
            html_content = html_template.render(name=name)

        resend.Emails.send({
            "from": f"{settings.MAIL_FROM_NAME} <support@clarixai.in>",
            "to": [email],
            "subject": "Thank you for contacting us",
            "html": html_content,
        })

        return True
    except Exception as e:
        print(f"somethings went wrong whiling sending email {e}")
        return False