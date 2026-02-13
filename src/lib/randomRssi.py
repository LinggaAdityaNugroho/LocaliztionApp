import urllib.request
import json
import random
import time

URL = "http://127.0.0.1:8000/api/device/update-rssi"

def random_rssi():
    return random.randint(-100, -20)

while True:
    data = {
        "devices": [
            {
                "mac_devices": "FF",
                "rssi1": random_rssi(),
                "rssi2": random_rssi(),
                "rssi3": random_rssi()
            }
        ]
    }

    json_data = json.dumps(data).encode("utf-8")

    req = urllib.request.Request(
        URL,
        data=json_data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as response:
            print("Status:", response.status)
            print("Response:", response.read().decode())
    except Exception as e:
        print("Error:", e)

    time.sleep(10)
