@echo off
cd backend
echo Installing dependencies...
pip install -r requirements.txt
echo Starting ULEAM IoT Backend...
uvicorn app.main:app --reload
pause
