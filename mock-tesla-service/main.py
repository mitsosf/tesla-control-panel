from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette import status
from starlette.responses import JSONResponse
import uvicorn

app = FastAPI()
origins = [
    "http://localhost",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"welcome": "Tesla mock service"}


@app.get("/name")
def name():
    return {"name": "Mock name"}


@app.get("/lock")
def lock():
    return JSONResponse(
        status_code=status.HTTP_200_OK, content={'msg': 'Locked'}
    )


@app.get("/unlock")
def unlock():
    return JSONResponse(
        status_code=status.HTTP_200_OK, content={'msg': 'Unlocked'}
    )


class Seat(BaseModel):
    heater: int
    level: int


@app.post("/climate/seat")
def seat_request(seat: Seat):
    if not seat.heater not in [0, 1, 2, 4, 5] \
            or seat.level not in [0, 1, 2, 3]:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={'msg': 'Wrong values'}
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={'msg': 'Seat heating changed'}
    )


class Temperature(BaseModel):
    driver: int
    passenger: int


@app.post("/climate/temperature")
def temperature_request(temperature: Temperature):
    if temperature.driver < 15 or temperature.driver > 28\
            or temperature.passenger< 15 or temperature.passenger > 28:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={'msg': 'Wrong value'}
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={'msg': 'Temperature changed'}
    )


class Media(BaseModel):
    step: int


@app.post("/media/playback")
def track_request():
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={'msg': 'Playback toggled'}
    )


@app.post("/media/track")
def track_request(media: Media):
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={'msg': 'Media changed'}
    )


@app.post("/media/volume")
def volume_request(media: Media):
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={'msg': 'Volume changed'}
    )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)