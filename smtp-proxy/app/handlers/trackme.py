from salmon.routing import route, stateless
import re
import sys
import requests


def extract_livetrack_session(content: str) -> str:
    match = re.search('https://livetrack.garmin.com/session/[^/]+/[^"]+', content.replace("=\r\n", ""))
    if match is None:
        raise Exception()
    session_link = match.group()
    return session_link


@route("trackme-(session_uuid)@(host)", session_uuid=".+")
@stateless
def NEW_ACTIVITY(message, session_uuid: str, host: str) -> None:
    try:
        session_link = extract_livetrack_session(message.body())
        requests.put(
                url=f"https://trackme.lucbert.dev/api/sessions/{session_uuid}",
                json={ "link": session_link }
            )
    except Exception as e:
        print(e, file=sys.stderr)
