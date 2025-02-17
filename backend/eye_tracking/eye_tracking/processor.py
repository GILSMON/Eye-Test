import cv2
import mediapipe as mp
import numpy as np

mp_face_mesh = mp.solutions.face_mesh.FaceMesh(refine_landmarks=True)
mp_hands = mp.solutions.hands.Hands()  # Add hand tracking

def process_frame(image):
    """Detects if the user closed an eye using MediaPipe FaceMesh."""
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
                # Get visibility scores
                # visibilities = [face_landmarks.landmark[i].visibility for i in eye_indices]
                # print(f"Visibilities: {visibilities}")  # Debug log

                # # If visibility is low for most key points, return None
                # if np.mean(visibilities) < 0.9:
                #     print(f"Average visibility is {np.mean(visibilities)}")  # Debug log
                #     return None

                # Compute EAR as usual
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

        print(f"Left EAR: {left_ear}, Right EAR: {right_ear}") # Debug log

        EAR_THRESHOLD = 0.4  # Threshold for eye closure detection

        left_eye_missing = left_ear is None
        right_eye_missing = right_ear is None

        # Add this function to check which hand is present
        def which_hand(hand_landmarks, image_width):
            """Determine if the hand is left or right based on landmark positions."""
            if hand_landmarks:
                # Use the x-coordinate of the wrist (landmark 0) to determine left/right hand
                wrist_x = hand_landmarks.landmark[0].x * image_width
                if wrist_x < image_width / 2:  # Left hand is on the left side of the image
                    return "Left Hand"
                else:  # Right hand is on the right side of the image
                    return "Right Hand"
            return None

        hand_present = hand_results.multi_hand_landmarks is not None  # True if hand detected

        if hand_present:
            for hand_landmarks in hand_results.multi_hand_landmarks:
                hand_type = which_hand(hand_landmarks, image.shape[1])
                if hand_type == "Left Hand" and left_eye_missing:
                    return "Left Palm", image
                elif hand_type == "Right Hand" and right_eye_missing:
                    return "Right Palm", image


        if left_ear is None or right_ear is None:
            return "Eyes are not recognized", image

        if left_ear < EAR_THRESHOLD and right_ear >= EAR_THRESHOLD:
            return "Left Eye Closed", image
        elif right_ear < EAR_THRESHOLD and left_ear >= EAR_THRESHOLD:
            return "Right Eye Closed", image
        elif left_ear < EAR_THRESHOLD and right_ear < EAR_THRESHOLD:
            return "Both Eyes Closed", image
        else:
            return "Eyes Open", image

    return "Eyes Open", image