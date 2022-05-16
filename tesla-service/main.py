import uvicorn
from fastapi import FastAPI
import teslapy
from requests import HTTPError
from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from starlette import status
from starlette.responses import JSONResponse

app = FastAPI()


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
    print(vehicle)
    vehicle_id = vehicle["id"]


def get_auth():
    return teslapy.Tesla("dimitris@frangiadakis.com", authenticator=custom_auth)


@app.get("/")
def root():
    with get_auth() as tesla:
        vehicles = tesla.api("VEHICLE_LIST")
        return {"name": vehicles["response"][0]["display_name"]}


@app.get("/lock")
def lock():
    with get_auth() as tesla:
        try:
            response = tesla.api("LOCK", {"vehicle_id": vehicle_id})
        except HTTPError:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN, content={'msg': 'Vehicle offline'}
            )

        if not response["response"]["result"]:
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={'msg': response["response"]["result"]},
            )

        return JSONResponse(
            status_code=status.HTTP_200_OK, content={'msg': 'Locked'}
        )


@app.post("/climate")
def climate():
    with get_auth() as tesla:
        try:
            response = tesla.api("CLIMATE_ON", {"vehicle_id": vehicle_id})
            if not response["response"]["result"]:
                return JSONResponse(
                    status_code=status.HTTP_403_FORBIDDEN, content={'msg': 'AC offline'}
                )
            response = tesla.api("REMOTE_SEAT_HEATER_REQUEST", {"vehicle_id": vehicle_id}, heater=2, level=1)
            # response = tesla.api("REMOTE_STEERING_WHEEL_HEATER_REQUEST", {"vehicle_id": vehicle_id}, on=True)
            return response
            # response = vehicle.command("REMOTE_STEERING_WHEEL_HEATER_REQUEST", on=1)
        except HTTPError:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN, content={'msg': 'Vehicle offline'}
            )

# Climate controls: heat selected seats, temperature up/down, climate mode

# Music: volume, next, previous, play/pause

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
