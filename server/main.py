import uvicorn
from fastapi import FastAPI
import teslapy
from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

app = FastAPI()


# Init tesla service
def custom_auth(url):
    options = webdriver.ChromeOptions()
    options.add_argument("--disable-blink-features=AutomationControlled")
    service = Service(executable_path=ChromeDriverManager().install())

    with webdriver.Chrome(options=options, service=service) \
            as browser:
        browser.get(url)
        WebDriverWait(browser, 300).until(EC.url_contains('void/callback'))
        return browser.current_url


with teslapy.Tesla('dimitris@frangiadakis.com',
                   authenticator=custom_auth) as tesla_service:
    tesla_service.fetch_token()


@app.get("/")
async def root():
    with teslapy.Tesla('dimitris@frangiadakis.com',
                       authenticator=custom_auth) as tesla:
        vehicles = tesla.vehicle_list()
        return {"name": vehicles[0]['display_name']}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
