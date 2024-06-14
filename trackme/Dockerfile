FROM python:3.11-slim
WORKDIR /app
COPY ./requirements.txt .
RUN python3 -m pip install -r requirements.txt

ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]
