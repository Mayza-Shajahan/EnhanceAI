from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response, FileResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from PIL import Image
import tensorflow as tf
from tensorflow.keras import Model, Input
from tensorflow.keras.layers import Conv2D, Concatenate
import io
import cv2
import os
import time

# ---------------- APP ---------------- #
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- MODEL ---------------- #
def build_model():
    input_img = Input(shape=(512, 512, 3))
    conv1 = Conv2D(32, (3, 3), activation='relu', padding='same')(input_img)
    conv2 = Conv2D(32, (3, 3), activation='relu', padding='same')(conv1)
    conv3 = Conv2D(32, (3, 3), activation='relu', padding='same')(conv2)
    conv4 = Conv2D(32, (3, 3), activation='relu', padding='same')(conv3)

    int_con1 = Concatenate()([conv4, conv3])
    conv5 = Conv2D(32, (3, 3), activation='relu', padding='same')(int_con1)
    int_con2 = Concatenate()([conv5, conv2])
    conv6 = Conv2D(32, (3, 3), activation='relu', padding='same')(int_con2)
    int_con3 = Concatenate()([conv6, conv1])
    x_r = Conv2D(24, (3, 3), activation='tanh', padding='same')(int_con3)

    model = Model(inputs=input_img, outputs=x_r)
    model.load_weights("weights/best.h5")
    return model

model = build_model()

# ---------------- VIDEO PROCESS ---------------- #
def process_video(video_path):
    cap = cv2.VideoCapture(video_path)

    fps = cap.get(cv2.CAP_PROP_FPS) or 24
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    os.makedirs("temp", exist_ok=True)
    output_path = "temp/output.mp4"

    # ✅ Browser-compatible codec
    fourcc = cv2.VideoWriter_fourcc(*'avc1')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Convert BGR → RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Resize for model
        frame_resized = cv2.resize(frame_rgb, (512, 512))
        img_array = frame_resized / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Model prediction
        A = model.predict(img_array, verbose=0)
        r = [A[:, :, :, (i*3):(i*3+3)] for i in range(8)]

        x = img_array[0]
        for i in range(8):
            x = x + r[i][0] * (np.power(x, 2) - x)

        enhanced = np.clip(x * 255, 0, 255).astype(np.uint8)

        # Resize back
        enhanced = cv2.resize(enhanced, (width, height))

        # RGB → BGR (IMPORTANT)
        enhanced_bgr = cv2.cvtColor(enhanced, cv2.COLOR_RGB2BGR)

        # Write frame
        out.write(enhanced_bgr)

        count += 1
        if count % 30 == 0:
            print(f"Processed {count} frames...")

    cap.release()
    out.release()

    print("✅ Video processing complete:", output_path)
    return output_path

# ---------------- ROUTE ---------------- #
@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    os.makedirs("temp", exist_ok=True)

    filename = file.filename.lower()
    input_path = f"temp/input_{filename}"

    with open(input_path, "wb") as f:
        f.write(await file.read())

    # ---------------- VIDEO ---------------- #
    if filename.endswith((".mp4", ".avi", ".mov")):
        output_path = process_video(input_path)

        # Small delay to ensure file is fully written
        time.sleep(1)

        return FileResponse(
            output_path,
            media_type="video/mp4",
            filename="enhanced.mp4"
        )

    # ---------------- IMAGE ---------------- #
    img = Image.open(input_path).convert("RGB")

    original_size = img.size
    img_resized = img.resize((512, 512))

    img_array = np.asarray(img_resized) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    A = model.predict(img_array)
    r = [A[:, :, :, (i*3):(i*3+3)] for i in range(8)]

    x = img_array[0]
    for i in range(8):
        x = x + r[i][0] * (np.power(x, 2) - x)

    enhanced = np.clip(x * 255, 0, 255).astype(np.uint8)
    enhanced_img = Image.fromarray(enhanced)
    enhanced_img = enhanced_img.resize(original_size)

    img_io = io.BytesIO()
    enhanced_img.save(img_io, format="PNG")
    img_io.seek(0)

    return Response(img_io.read(), media_type="image/png")

# ---------------- RUN ---------------- #
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)