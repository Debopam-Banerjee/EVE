import cv2
import os
import time

# Capture image from webcam
cam = cv2.VideoCapture(0)
cam.set(cv2.CAP_PROP_AUTO_EXPOSURE, 0.75)
cam.set(cv2.CAP_PROP_BRIGHTNESS, 40)

for _ in range(3):  # 2–3 warm-up frames is often enough
    ret, frame = cam.read()
    time.sleep(0.2)

ret, frame = cam.read()
cam.release()

if not ret:
    print("Failed to capture image")
    exit(1)

# Save the captured image
img_path = "your_path_to_image"
cv2.imwrite(img_path, frame, [int(cv2.IMWRITE_JPEG_QUALITY), 70])

# Output the image path
print(img_path)
