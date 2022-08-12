from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from requests import HTTPError
from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.service import Service
from starlette import status
from starlette.responses import JSONResponse
import teslapy
import uvicorn
from webdriver_manager.chrome import ChromeDriverManager

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


# Init tesla service
def custom_auth(url):
    options = webdriver.ChromeOptions()
    options.add_argument("--disable-blink-features=AutomationControlled")
    service = Service(executable_path=ChromeDriverManager().install())

    with webdriver.Chrome(options=options, service=service) as browser:
        browser.get(url)
        WebDriverWait(browser, 300).until(EC.url_contains("void/callback"))
        return browser.current_url


with teslapy.Tesla(
        "dimitris@frangiadakis.com", authenticator=custom_auth
) as tesla_service:
    tesla_service.fetch_token()
    vehicle = tesla_service.vehicle_list()[0]
    vehicle_id = vehicle["id"]


def get_auth():
    return teslapy.Tesla("dimitris@frangiadakis.com",
                         authenticator=custom_auth)


@app.get("/")
def root():
    return {"welcome": "Tesla service"}


@app.get("/name")
def name():
    return {"name": vehicle["display_name"]}


@app.post("/vehicle/wakeup")
def wake_up():
    with get_auth():
        try:
            vehicle.sync_wake_up()

            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    'msg': 'Wake up command sent'
                },
            )
        except HTTPError:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={'msg': 'Vehicle offline'}
            )


@app.post("/vehicle/climate/info")
def vehicle_climate_info():
    with get_auth() as tesla:
        try:
            response = tesla.api("VEHICLE_DATA", {"vehicle_id": vehicle_id})
            climate = response['response']['climate_state']

            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    'msg': {
                        'temps': {
                            'current_inside': climate['inside_temp'],
                            'current_outside': climate['outside_temp'],
                            'driver': climate['driver_temp_setting'],
                            'passenger': climate['passenger_temp_setting'],
                            'min': climate['min_avail_temp'],
                            'max': climate['max_avail_temp'],
                        },
                        'seat_heaters': {
                            'front_driver': climate['seat_heater_left'],
                            'front_passenger': climate['seat_heater_right'],
                            'back_driver': climate['seat_heater_rear_left'],
                            'back_passenger': climate[
                                'seat_heater_rear_right'],
                            'back_middle': climate['seat_heater_rear_center'],
                        },
                        'climate_keeper': climate['climate_keeper_mode']
                    }
                },
            )
        except HTTPError:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={'msg': 'Vehicle offline'}
            )


@app.post("/lock")
def lock():
    with get_auth() as tesla:
        try:
            response = tesla.api("LOCK", {"vehicle_id": vehicle_id})
        except HTTPError:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={'msg': 'Vehicle offline'}
            )

        if not response["response"]["result"]:
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={'msg': response["response"]["result"]},
            )

        return JSONResponse(
            status_code=status.HTTP_200_OK, content={'msg': 'Locked'}
        )


@app.post("/unlock")
def unlock():
    with get_auth() as tesla:
        try:
            response = tesla.api("UNLOCK", {"vehicle_id": vehicle_id})
        except HTTPError:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={'msg': 'Vehicle offline'}
            )

        if not response["response"]["result"]:
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={'msg': response["response"]["result"]},
            )

        return JSONResponse(
            status_code=status.HTTP_200_OK, content={'msg': 'Unlocked'}
        )


@app.post("/vehicle/start")
def remote_start():
    with get_auth() as tesla:
        try:
            response = tesla.api("REMOTE_START", {"vehicle_id": vehicle_id})
        except HTTPError:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={'msg': 'Vehicle offline'}
            )

        if not response["response"]["result"]:
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={'msg': response["response"]["result"]},
            )

        return JSONResponse(
            status_code=status.HTTP_200_OK, content={'msg': 'Vehicle started'}
        )


class Seat(BaseModel):
    heater: int
    level: int


@app.post("/climate/seat")
def seat_request(seat: Seat):
    with get_auth() as tesla:
        try:
            response = tesla.api("CLIMATE_ON", {"vehicle_id": vehicle_id})

            if not response["response"]["result"]:
                return JSONResponse(
                    status_code=status.HTTP_403_FORBIDDEN,
                    content={'msg': 'AC offline'}
                )
            response = tesla.api("REMOTE_SEAT_HEATER_REQUEST",
                                 {"vehicle_id": vehicle_id},
                                 heater=seat.heater, level=seat.level)

            if not response['response']['result']:
                return JSONResponse(
                    status_code=status.HTTP_403_FORBIDDEN,
                    content={'msg': 'Wrong values'}
                )

            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={'msg': 'Seat heating changed'}
            )

        except HTTPError:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={'msg': 'Vehicle offline'}
            )


class Temperature(BaseModel):
    driver: int
    passenger: int


@app.post("/climate/temperature")
def temperature_request(temperature: Temperature):
    with get_auth() as tesla:
        try:
            response = tesla.api("CLIMATE_ON", {"vehicle_id": vehicle_id})

            if not response["response"]["result"]:
                return JSONResponse(
                    status_code=status.HTTP_403_FORBIDDEN,
                    content={'msg': 'AC offline'}
                )
            response = tesla.api("CHANGE_CLIMATE_TEMPERATURE_SETTING",
                                 {"vehicle_id": vehicle_id},
                                 driver_temp=temperature.driver,
                                 passenger_temp=temperature.passenger)

            if not response['response']['result']:
                return JSONResponse(
                    status_code=status.HTTP_403_FORBIDDEN,
                    content={'msg': 'Wrong value'}
                )

            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={'msg': 'Temperature changed'}
            )

        except HTTPError:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={'msg': 'Vehicle offline'}
            )


class Media(BaseModel):
    step: int


@app.post("/media/playback")
def track_request():
    with get_auth() as tesla:
        try:
            response = tesla.api(
                "MEDIA_TOGGLE_PLAYBACK", {"vehicle_id": vehicle_id}
            )
            # TODO check if response successful and if step value is -1 or 1
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={'msg': 'Playback toggled'}
            )

        except HTTPError:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={'msg': 'Vehicle offline'}
            )


@app.post("/media/track")
def track_request(media: Media):
    with get_auth() as tesla:
        try:
            if media.step == 1:
                response = tesla.api(
                    "MEDIA_NEXT_TRACK", {"vehicle_id": vehicle_id}
                )
            else:
                response = tesla.api(
                    "MEDIA_PREVIOUS_TRACK", {"vehicle_id": vehicle_id}
                )

            # TODO check if response successful and if step value is -1 or 1
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={'msg': 'Media changed'}
            )

        except HTTPError:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={'msg': 'Vehicle offline'}
            )


@app.post("/media/volume")
def volume_request(media: Media):
    with get_auth() as tesla:
        try:
            if media.step == 1:
                response = tesla.api(
                    "MEDIA_VOLUME_UP", {"vehicle_id": vehicle_id}
                )
            else:
                response = tesla.api(
                    "MEDIA_VOLUME_DOWN", {"vehicle_id": vehicle_id}
                )

            # TODO check if response successful and if step value is -1 or 1
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={'msg': 'Volume changed'}
            )

        except HTTPError:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={'msg': 'Vehicle offline'}
            )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
