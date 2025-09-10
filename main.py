from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import io
import json

# Initialize app
app = FastAPI(title="String to Array App")

# Mount static files (CSS, JS, images, videos, etc.)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Jinja2 for rendering templates
templates = Jinja2Templates(directory="templates")


# -----------------------
# Routes
# -----------------------

# Home route -> serves index.html
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


# Convert string to array (API)
@app.post("/api/convert")
async def convert(data: dict) -> JSONResponse:
    text: str = data.get("input", "")

    if not text:
        return JSONResponse({"error": "Invalid string"}, status_code=400)

    chars = list(text)  # preserves spaces
    return JSONResponse({"chars": chars})


# Export string as JSON file (API)
@app.post("/api/export")
async def export(data: dict) -> StreamingResponse:
    text: str = data.get("input", "")
    chars = list(text)

    # Prepare JSON content
    content: str = json.dumps(chars, ensure_ascii=False, indent=2)

    return StreamingResponse(
        io.BytesIO(content.encode("utf-8")),
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=chars.json"}
    )


# -----------------------
# Run with uvicorn
# -----------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
