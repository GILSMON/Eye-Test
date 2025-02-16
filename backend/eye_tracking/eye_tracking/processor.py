import cv2
import mediapipe as mp
import numpy as np

mp_face_mesh = mp.solutions.face_mesh.FaceMesh(refine_landmarks=True)

def process_frame(image):
    """Detects if the user closed an eye using MediaPipe FaceMesh."""
    img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = mp_face_mesh.process(img_rgb)

    if not results.multi_face_landmarks:
        return "No face detected", image

    for face_landmarks in results.multi_face_landmarks:
        # Eye landmarks based on MediaPipe FaceMesh index
        left_eye = [33, 160, 158, 133, 153, 144]
        right_eye = [362, 385, 387, 263, 373, 380]

        def eye_aspect_ratio(eye_indices):
            """Calculate the Eye Aspect Ratio (EAR) to detect eye closure."""
            p1 = np.array([face_landmarks.landmark[eye_indices[1]].x, face_landmarks.landmark[eye_indices[1]].y])
            p2 = np.array([face_landmarks.landmark[eye_indices[2]].x, face_landmarks.landmark[eye_indices[2]].y])
            p3 = np.array([face_landmarks.landmark[eye_indices[4]].x, face_landmarks.landmark[eye_indices[4]].y])
            p4 = np.array([face_landmarks.landmark[eye_indices[5]].x, face_landmarks.landmark[eye_indices[5]].y])

            vertical_dist = np.linalg.norm(p2 - p4) + np.linalg.norm(p1 - p3)
            horizontal_dist = np.linalg.norm(
                np.array([face_landmarks.landmark[eye_indices[0]].x, face_landmarks.landmark[eye_indices[0]].y]) - 
                np.array([face_landmarks.landmark[eye_indices[3]].x, face_landmarks.landmark[eye_indices[3]].y])
            )

            return vertical_dist / (2.0 * horizontal_dist)

        left_ear = eye_aspect_ratio(left_eye)
        right_ear = eye_aspect_ratio(right_eye)

        EAR_THRESHOLD = 0.2  # Threshold for eye closure detection

        if left_ear < EAR_THRESHOLD and right_ear >= EAR_THRESHOLD:
            return "Left Eye Closed", image
        elif right_ear < EAR_THRESHOLD and left_ear >= EAR_THRESHOLD:
            return "Right Eye Closed", image
        elif left_ear < EAR_THRESHOLD and right_ear < EAR_THRESHOLD:
            return "Both Eyes Closed", image
        else:
            return "Eyes Open", image

    return "Eyes Open", image