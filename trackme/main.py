import uuid
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import re
from datetime import datetime
from peewee import CharField, DateTimeField, SqliteDatabase, Model, UUIDField
import requests


db = SqliteDatabase('sqlite/data.db')

class BaseDbModel(Model):
    class Meta:
        database = db


class LiveTrackSession(BaseDbModel):
    id = UUIDField(unique=True)
    link = CharField(null=True)
    updated_at = DateTimeField()


def notify(session_uuid: str):
    print(f"Notifying trackme-test-{session_uuid}")
    requests.post(
        url=f"https://ntfy.lucbert.dev/trackme-test-{session_uuid}",
        data=f"Nouveau départ!".encode('utf-8'),
        headers={ 'Click': f"https://trackme.lucbert.dev/{session_uuid}" }
    )


app = FastAPI()


@app.on_event("startup")
async def startup_event():
    db.connect()
    db.create_tables([LiveTrackSession])


@app.post("/new")
def create_new_livetrack_session():
    session_uuid = uuid.uuid4()
    LiveTrackSession.create(
        id=session_uuid,
        updated_at=datetime.now(),
    )
    return {"id": session_uuid}

@app.get("/{session_uuid}/json")
def get_session(session_uuid: str):
    try:
        return (LiveTrackSession
            .select()
            .where(LiveTrackSession.id == session_uuid)
            .dicts().get())
    except Exception as e:
        raise HTTPException(status_code=404) from e


class UpdateBody(BaseModel):
    link: str


@app.post("/{session_uuid}/update")
def start_livetrack_session(session_uuid: str, body: UpdateBody) -> None:
    try:
        (LiveTrackSession
         .update(link=body.link, updated_at=datetime.now())
         .where(LiveTrackSession.id == session_uuid)
         .execute())
        #notify(session_uuid)
    except Exception as e:
        raise HTTPException(status_code=404) from e
    return


@app.get("/{session_uuid}", response_class=HTMLResponse)
def render_livetrack_iframe(session_uuid: str):
    try:
        session = LiveTrackSession.get(LiveTrackSession.id == session_uuid)
        if session.link is None:
            raise HTTPException(status_code=404)
        return f"""
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Garmin Live Track</title>
        <style type="text/css">
            body, html
            {{
                margin: 0; padding: 0; height: 100%; overflow: hidden;
            }}

            #content
            {{
                position:absolute; left: 0; right: 0; bottom: 0; top: 0px; 
            }}
        </style>
    </head>
    <body>
        <div id="content">
            <iframe width="100%" height="100%" frameborder="0" src="{session.link}"></iframe>
        </div>
    </body>
</html>
"""
    except Exception as e:
        raise HTTPException(status_code=404) from e
