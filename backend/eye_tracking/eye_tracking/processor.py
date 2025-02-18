import cv2

import mediapipe as mp

import numpy as np

import time  # for time tracking
 
mp_face_mesh = mp.solutions.face_mesh.FaceMesh(refine_landmarks=True)

mp_hands = mp.solutions.hands.Hands()  # Add hand tracking
 
# **Global variable to keep track of blink count and eye closure start time**

blink_count = 0

last_blink_time = None
 
def count_blinks(left_ear, right_ear):

    """Function to count the number of blinks based on eye closure."""

    global blink_count, last_blink_time

    EAR_THRESHOLD = 0.4  # Threshold for eye closure detection
 
    if left_ear is None or right_ear is None:

        return blink_count  # No blink detection if EAR is None
 
    # **Check if both eyes are closed**

    if left_ear < EAR_THRESHOLD and right_ear < EAR_THRESHOLD:

        current_time = time.time()

        # **If eyes are closed for the first time, start the timer**

        if last_blink_time is None:

            last_blink_time = current_time

        elif current_time - last_blink_time >= 1:  # **If eyes are closed for 1 second or more**

            blink_count += 1  # **Increment blink count**

            last_blink_time = None  # **Reset blink timer after registering a blink**

    # **If eyes are not closed, reset the last blink time**

    else:

        last_blink_time = None
 
    return blink_count
 
def process_frame(image):

    """Detects if the user closed an eye using MediaPipe FaceMesh."""

    global blink_count  # Using global blink_count to keep track of blinks
 
    img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    results = mp_face_mesh.process(img_rgb)
 
    # Process hand landmarks

    hand_results = mp_hands.process(img_rgb)
 
    if not results.multi_face_landmarks and hand_results.multi_hand_landmarks:

        return "Hand cover both eyes", image

    elif not results.multi_face_landmarks:

        return "No face detected", image
 
    for face_landmarks in results.multi_face_landmarks:

        # Draw all landmarks on the image

        for idx, landmark in enumerate(face_landmarks.landmark):

            x = int(landmark.x * image.shape[1])

            y = int(landmark.y * image.shape[0])

            cv2.circle(image, (x, y), 1, (0, 255, 0), -1)
 
        # Eye landmarks based on MediaPipe FaceMesh index

        left_eye = [33, 160, 158, 133, 153, 144]

        right_eye = [362, 385, 387, 263, 373, 380]
 
        for idx in left_eye + right_eye:

            x = int(face_landmarks.landmark[idx].x * image.shape[1])

            y = int(face_landmarks.landmark[idx].y * image.shape[0])

            cv2.circle(image, (x, y), 2, (0, 0, 255), -1)
 
        # Get face bounding box

        face_landmarks_array = np.array([(lm.x, lm.y) for lm in face_landmarks.landmark])

        face_min_x, face_min_y = face_landmarks_array.min(axis=0)

        face_max_x, face_max_y = face_landmarks_array.max(axis=0)
 
        # Face center and midpoints

        face_center_x = (face_min_x + face_max_x) / 2

        face_left_x = face_min_x

        face_right_x = face_max_x
 
        # Check if hand is present

        if hand_results.multi_hand_landmarks:

            for hand_landmarks in hand_results.multi_hand_landmarks:

                # Get hand bounding box

                hand_landmarks_array = np.array([(lm.x, lm.y) for lm in hand_landmarks.landmark])

                hand_min_x, hand_min_y = hand_landmarks_array.min(axis=0)

                hand_max_x, hand_max_y = hand_landmarks_array.max(axis=0)
 
                # Hand center

                hand_center_x = (hand_min_x + hand_max_x) / 2
 
                # Determine if hand is covering left or right half of face

                if hand_center_x < face_center_x:

                    return "Hand covering left half", image

                else:

                    return "Hand covering right half", image
 
        def eye_aspect_ratio(eye_indices):

            """Calculate the Eye Aspect Ratio (EAR) to detect eye closure."""

            try:

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

            except IndexError:

                return None  # If landmarks are missing
 
        left_ear = eye_aspect_ratio(left_eye)

        right_ear = eye_aspect_ratio(right_eye)
 
        EAR_THRESHOLD = 0.4  # Threshold for eye closure detection

        left_eye_missing = left_ear is None

        right_eye_missing = right_ear is None
 
        if left_ear is None or right_ear is None:

            return "Eyes are not recognized", image
 
        # **Count blinks using the separate function**

        blink_count = count_blinks(left_ear, right_ear)
 
        # Check if the left or right eye is closed

        if left_ear < EAR_THRESHOLD and right_ear >= EAR_THRESHOLD:

            return f"Left Eye Closed. Blinks: {blink_count}", image

        elif right_ear < EAR_THRESHOLD and left_ear >= EAR_THRESHOLD:

            return f"Right Eye Closed. Blinks: {blink_count}", image

        elif left_ear < EAR_THRESHOLD and right_ear < EAR_THRESHOLD:

            return f"Both Eyes Closed. Blinks: {blink_count}", image

        else:

            return f"Eyes Open. Blinks: {blink_count}", image
 
    return f"Eyes Open. Blinks: {blink_count}", image
 