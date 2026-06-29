Start-Process -FilePath "powershell" -ArgumentList "-NoExit -Command `"cd backend_fastAPI; uvicorn main:app --reload`""
Start-Process -FilePath "powershell" -ArgumentList "-NoExit -Command `"cd frontend_reactJs; npm run dev`""
