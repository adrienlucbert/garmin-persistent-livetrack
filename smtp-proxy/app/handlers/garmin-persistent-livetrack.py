import os
import re
import sys

import requests
from salmon.routing import route, stateless

API_HOST = os.environ.get("API_HOST")
if API_HOST is None:
    raise Exception("API_HOST is not defined")


def extract_livetrack_session(content: str) -> str:
    match = re.search(
        'https://livetrack.garmin.com/session/[^/]+/[^"]+', content.replace("=\r\n", "")
    )
    if match is None:
        raise Exception()
    session_link = match.group()
    return session_link


@route("garmin-persistent-livetrack-(session_uuid)@(host)", session_uuid=".+")
@stateless
def NEW_ACTIVITY(message, session_uuid: str, host: str) -> None:
    try:
        session_link = extract_livetrack_session(message.body())
        requests.put(
            url=f"{API_HOST}/api/sessions/{session_uuid}",
            json={"link": session_link},
        )
    except Exception as e:
        print(e, file=sys.stderr)
