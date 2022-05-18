import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import teslapy
from requests import HTTPError
from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from starlette import status
from starlette.responses import JSONResponse
from pydantic import BaseModel

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
    with get_auth() as tesla:
        vehicles = tesla.api("VEHICLE_LIST")
        return {"name": vehicles["response"][0]["display_name"]}


@app.get("/name")
def name():
    with get_auth() as tesla:
        vehicles = tesla.vehicle_list()
        return {"name": vehicles[0]["display_name"]}


@app.get("/lock")
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


@app.get("/unlock")
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
            response = tesla.api("MEDIA_TOGGLE_PLAYBACK", {"vehicle_id": vehicle_id})

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
                response = tesla.api("MEDIA_NEXT_TRACK", {"vehicle_id": vehicle_id})
            else:
                response = tesla.api("MEDIA_PREVIOUS_TRACK", {"vehicle_id": vehicle_id})

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
                response = tesla.api("MEDIA_VOLUME_UP", {"vehicle_id": vehicle_id})
            else:
                response = tesla.api("MEDIA_VOLUME_DOWN", {"vehicle_id": vehicle_id})

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
