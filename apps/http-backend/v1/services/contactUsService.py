from fastapi import HTTPException
from v1.db.ConnectDB import getDB
from v1.schema import contactUsSchema
from v1.utils.response import response
from v1.model import contactUsModel
from v1.utils.mailConfig.sendContactUsMail import SendContactResponseEmail


class constactService:

    async def contactUsService(data: contactUsSchema):
        try:
            db = getDB()

            details = contactUsModel(
                full_name=data.full_name,
                email=data.email,
                have_account=data.have_account,
                description=data.description,
            )

            await db["contactUsModel"].insert_one(details.dict())

            sendMail = await SendContactResponseEmail(
                email=data.email,
                name=data.full_name
            )
            if sendMail:
                return response(
                    message="thank you for contacting us, our team will contact you soon",
                    code=200,
                )
            else:
                raise HTTPException(
                    status_code=500,
                    detail={
                        "status": False,
                        "message": "Something went wrong, please try again",
                        "data": None,
                    },
                )
        except HTTPException:
            raise
        except Exception as e:
            print(f"something went wrong while retriving plans: {e}")
            raise HTTPException(
                status_code=500,
                detail={
                    "status": False,
                    "message": "Something went wrong, please try again",
                    "data": None,
                },
            )
