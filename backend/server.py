from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, BeforeValidator, field_validator
from typing import Annotated, Optional
from datetime import datetime, timezone, date

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

client = AsyncIOMotorClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]
PROMO_CODE = os.environ['PROMO_CODE']
PROMO_DISCOUNT = int(os.environ['PROMO_DISCOUNT'])

app = FastAPI()
api_router = APIRouter(prefix="/api")

PyObjectId = Annotated[str, BeforeValidator(lambda v: str(v) if isinstance(v, ObjectId) else v)]
FORMATS = ["День рождения", "Вечеринка", "Корпоратив", "Свадьба", "Фотосъёмка", "Мастер-класс", "Другое"]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    @classmethod
    def from_mongo(cls, doc):
        return cls.model_validate(doc)

    def to_mongo(self):
        d = self.model_dump(by_alias=True, exclude={"id"})
        return d


class BookingIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    phone: str = Field(min_length=6, max_length=30)
    date: date
    format: str
    guests: Optional[int] = Field(default=None, ge=1, le=500)
    comment: Optional[str] = Field(default=None, max_length=1000)
    promo_code: Optional[str] = Field(default=None, max_length=40)

    @field_validator("format")
    @classmethod
    def check_format(cls, v):
        if v not in FORMATS:
            raise ValueError("Неизвестный формат праздника")
        return v

    @field_validator("date")
    @classmethod
    def check_date(cls, v):
        if v < datetime.now(timezone.utc).date():
            raise ValueError("Дата не может быть в прошлом")
        return v


class Booking(BaseDocument):
    name: str
    phone: str
    date: str
    format: str
    guests: Optional[int] = None
    comment: Optional[str] = None
    promo_code: Optional[str] = None
    discount: int = 0
    created_at: str


@api_router.get("/")
async def root():
    return {"message": "Кроличья Нора API"}


@api_router.get("/promo/cheshire")
async def cheshire_promo():
    return {"code": PROMO_CODE, "discount": PROMO_DISCOUNT}


@api_router.get("/promo/check/{code}")
async def check_promo(code: str):
    ok = code.strip().upper() == PROMO_CODE.upper()
    return {"valid": ok, "discount": PROMO_DISCOUNT if ok else 0}


@api_router.post("/bookings", response_model=Booking, response_model_by_alias=False)
async def create_booking(data: BookingIn):
    promo = (data.promo_code or "").strip()
    if promo and promo.upper() != PROMO_CODE.upper():
        raise HTTPException(status_code=400, detail="Такого промокода нет — кот бы знал")
    booking = Booking(
        name=data.name.strip(), phone=data.phone.strip(), date=data.date.isoformat(), format=data.format,
        guests=data.guests, comment=(data.comment or "").strip() or None,
        promo_code=promo.upper() or None, discount=PROMO_DISCOUNT if promo else 0,
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    res = await db.bookings.insert_one(booking.to_mongo())
    booking.id = str(res.inserted_id)
    return booking


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
