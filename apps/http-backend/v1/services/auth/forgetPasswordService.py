from v1.db.ConnectDB import getDB
from v1.utils.response import response
from v1.utils.passwordHashing.passwordHashing import HashPassword
from v1.utils.emailVerifyToken.emailVerifyToken import GenerateEmailVerifyToken
from v1.utils.mailConfig.sendResetPasswordMail import SendResetPasswordEmail
from v1.schema import changePasswordSchema
from v1.utils.jwt.jwt import VerifyToken
from fastapi import HTTPException


async def forgetPasswordSendLink(email: str):
    try:
        db = getDB()
        existUser = await db["users"].find_one({"email": email})
        if existUser is None:
            raise HTTPException(
                status_code=404,
                detail={
                    "status": False,
                    "message": "Email is not associated with any account, please enter a correct email id",
                    "data": None,
                },
            )

        verificationToken = await GenerateEmailVerifyToken(existUser.get("email"))
        hashed_token = HashPassword(verificationToken)

        await db["users"].update_one(
            {"email": existUser.get("email")},
            {"$set": {"change_password_token": hashed_token}},
        )

        sendMail = await SendResetPasswordEmail(
            email=existUser.get("email"),
            name=existUser.get("full_name"),
            token=verificationToken,
        )

        if sendMail:
            return response(
                message="change password link is successfully sended to your email ID"
            )
        else:
            return response(
                status=False,
                code=500,
                message="Something went wrong while sending email, please try again",
            )

    except Exception as e:
        print(f"this is a issue {str(e)}")
        return response(
            status=False,
            code=500,
            message="Something went wrong while creating a new account, please try again",
        )

async def forgetPassword(data: changePasswordSchema):
    try:
        db = getDB()

        userEmail = VerifyToken(data.token).data.sub

        if userEmail is None:
            raise HTTPException(
                status_code=401,
                detail={
                    "status": False,
                    "message": "Invalid Token, please try again",
                    "data": None,
                },
            )

        existUser = await db["users"].find_one({"email": userEmail})

        if existUser is None:
            raise HTTPException(
                status_code=404,
                detail={
                    "status": False,
                    "message": "Email is not associated with any account, please enter a correct email id",
                    "data": None,
                },
            )

        hashed_password = HashPassword(data.newPassword)

        existUser = await db["users"].update_one(
            {"email": userEmail}, {"$set": {"password": hashed_password}}
        )

        return response(
            message=f"hey {existUser}, your password is successfully changed"
        )

    except Exception as e:
        print(f"this is a issue {str(e)}")
        return response(
            status=False,
            code=500,
            message="Something went wrong while creating a new account, please try again",
        )
