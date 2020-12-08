FROM python:3.7

ENV PYTHONUNBUFFERED 1

RUN mkdir /HF

COPY requirements.txt /HF/

WORKDIR /HF

RUN python -m pip install --upgrade pip

RUN pip install -r requirements.txt

COPY . /HF/