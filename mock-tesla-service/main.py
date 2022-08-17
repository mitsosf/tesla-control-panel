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


@app.post("/wakeup")
def wake_up():
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            'msg': 'Wake up command sent'
        },
    )


@app.post("/vehicle/climate")
def vehicle_climate():
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            'msg': {
                'temps': {
                    'current_inside': 20,
                    'current_outside': 22,
                    'driver': 19,
                    'passenger': 23,
                    'min': 15,
                    'max': 28,
                },
                'seat_heaters': {
                    'front_driver': 0,
                    'front_passenger': 1,
                    'back_driver': 0,
                    'back_passenger': 2,
                    'back_middle': 0,
                },
                'climate_keeper': "off"
            }
        },
    )


@app.post("/lock")
def lock():
    return JSONResponse(
        status_code=status.HTTP_200_OK, content={'msg': 'Locked'}
    )


@app.post("/unlock")
def unlock():
    return JSONResponse(
        status_code=status.HTTP_200_OK, content={'msg': 'Unlocked'}
    )


@app.post("/start")
def remote_start():
    return JSONResponse(
        status_code=status.HTTP_200_OK, content={'msg': 'Vehicle started'}
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


@app.post("/climate/on")
def climate_on():
    return JSONResponse(
        status_code=status.HTTP_200_OK, content={'msg': 'Climate on sent'}
    )


@app.post("/climate/off")
def climate_off():
    return JSONResponse(
        status_code=status.HTTP_200_OK, content={'msg': 'Climate off sent'}
    )


class Media(BaseModel):
    step: int


@app.post("/media/playback")
def track_request():
    return JSONResponse(
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
