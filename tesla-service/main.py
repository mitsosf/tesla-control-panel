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


def get_auth():
    return teslapy.Tesla("dimitris@frangiadakis.com", authenticator=custom_auth)


@app.get("/")
async def root():
    with get_auth() as tesla:
        vehicles = tesla.api("VEHICLE_LIST")
        return {"name": vehicles["response"][0]["display_name"]}


@app.get("/lock")
async def lock():
    with get_auth() as tesla:
        vehicles = tesla.api("VEHICLE_LIST")
        vehicle_id = vehicles["response"][0]["id"]
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
            status_code=status.HTTP_200_OK, content={'msg': 'Unlocked'}
        )


# Climate controls: heat selected seats, temperature up/down, climate mode

# Music: volume, next, previous, play/pause

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
