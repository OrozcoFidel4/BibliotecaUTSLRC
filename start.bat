@echo off
title Iniciando Proyecto Biblioteca

REM Iniciar backend
cd backend
start cmd /k "echo Iniciando Backend... && npm install && npm run devStart"

REM Volver a la raíz del proyecto (antes de ir al frontend)
cd ..

REM Iniciar frontend
cd frontend
start cmd /k "echo Iniciando Frontend... && npm install && npm run dev"

REM Abrir navegador en frontend (espera 5 segundos para que el frontend arranque)
timeout /t 5 /nobreak >nul
start http://localhost:5173

REM Volver a la raíz
cd ..

echo Proyecto lanzado correctamente.
pause
