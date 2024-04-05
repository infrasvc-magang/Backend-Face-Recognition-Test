from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.template import loader
from django.http import HttpResponse
from django.http import StreamingHttpResponse
from django.views.decorators import gzip
import numpy as np
import cv2
import requests
import json
import time
from face_detector import grab as g
from face_detector import models as m
from face_detector import camera as camera

@csrf_exempt
def face(self):
    api_url = "http://127.0.0.1:8000/face_detection/detect/"
    count = 0
    des = 90  # 30 = 1 detik
    success = False

    vid = camera.VideoCamera()
    StreamingHttpResponse(camera.gen(vid), content_type="multipart/x-mixed-replace;boundary=frame")

    while (True):
        ret, frame = vid.read()
        count += 1

        if (des / count == 1):
            img = cv2.imencode('.jpg', frame)[1]

            data = detect(img)
            success = data['success']
            count = 0

        if success:
            count += 1
            for face in data['faces']:
                curr_age = face['age']
                curr_gen = face['gender']
                curr_emo = face['emotion']
                curr_name = face['name']

            for (top, right, bottom, left) in face['location']:
                top *= 4
                right *= 4
                bottom *= 4
                left *= 4
                cv2.rectangle(frame, (left, top),
                            (right, bottom), (0, 255, 0), 2)
                cv2.rectangle(frame, (left, bottom),
                            (right, bottom + 80), (0, 255, 0), -1)
                cv2.rectangle(frame, (left, top),
                            (right, top - 50), (0, 255, 0), -1)

                cv2.putText(frame, curr_name, (left + 20, top - 20),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 2)
                cv2.putText(frame, curr_age, (left + 20, bottom + 45),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2)
                cv2.putText(frame, curr_gen, (left + 20, bottom + 20),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2)
                cv2.putText(frame, curr_emo, (left + 20, bottom + 65),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2)

            if (des/count == 1):
                success = False
                count = 0

        # cv2.namedWindow("frame", cv2.WND_PROP_AUTOSIZE)
        # cv2.setWindowProperty("frame", cv2.WND_PROP_ASPECT_RATIO, cv2.WINDOW_FULLSCREEN)
        # cv2.imshow('frame', frame)
        # if cv2.waitKey(1) & 0xFF == ord('q'):
        #     break

    # vid.release()
    # cv2.destroyAllWindows()

@gzip.gzip_page
def livefe(came):
    while True:
        return StreamingHttpResponse(camera.gen(came), content_type="multipart/x-mixed-replace;boundary=frame")

@csrf_exempt
def index(request):
    template = loader.get_template("exp/frontend/public/html/index.ejs")
    context = {}
    return HttpResponse(template.render(context, request))

@csrf_exempt
def detect(gambar):
    data = {"success": False, "faces": []}

    image = cv2.imdecode(gambar, cv2.IMREAD_COLOR)
    small_image = cv2.resize(image, (0, 0), fx=0.25, fy=0.25)
    is_detected = m.face_locations(small_image)[0]

    if len(is_detected) == 0:
        data['success'] = False
    else:
        face_locations = m.face_locations(small_image)[0]
        for (top, right, bottom, left) in face_locations:
            roi = image[top:bottom, left:right]
            image_grey = cv2.cvtColor(roi, cv2.COLOR_RGB2GRAY)

            input_image = np.expand_dims(np.expand_dims(
                cv2.resize(roi, (224, 224)), -1), 0)
            emo_image = np.expand_dims(np.expand_dims(
                cv2.resize(image_grey, (48, 48)), -1), 0)
            ageg_image = np.expand_dims(np.expand_dims(
                cv2.resize(image_grey, (64, 64)), -1), 0)

            predict_name = m.model_name.predict(input_image)
            predict_emotion = m.model_emotion.predict(emo_image)
            predict_age = m.model_age.predict(ageg_image)

            # print(predict_age[0])

            # face_instance = m.FaceData(
            #     top=top,
            #     right=right,
            #     bottom=bottom,
            #     left=left,
            #     emotion=m.get_emotion(predict_emotion),
            #     age=m.get_age(predict_age[1]),
            #     gender=m.get_gender(predict_age[0]),
            # )
            # face_instance.save()

            data["faces"].append({"location": face_locations,
                                    "emotion": m.get_emotion(predict_emotion),
                                    "age": m.get_age(predict_age[0]),
                                    "gender": m.get_gender(predict_age[1]),
                                    "name": m.get_name(predict_name).capitalize(),
                                    })
        data["success"] = True

    return data

# def detect(request):
#     data = {"success": False, "faces": []}

#     if request.method == "POST":
#         if request.FILES.get("image", None) is not None:
#             image = g._grab_image(stream=request.FILES["image"])
#         else:
#             url = request.POST.get("url", None)
#             if url is None:
#                 data["error"] = "No URL provided."
#                 return JsonResponse(data)
#             image = g._grab_image(url=url)

#         small_image = cv2.resize(image, (0, 0), fx=0.25, fy=0.25)

#         is_detected = m.face_locations(small_image)[0]

#         if len(is_detected) == 0:
#             data['success'] = False
#         else:
#             face_locations = m.face_locations(small_image)[0]
#             for (top, right, bottom, left) in face_locations:
#                 roi = image[top:bottom, left:right]
#                 image_grey = cv2.cvtColor(roi, cv2.COLOR_RGB2GRAY)

#                 input_image = np.expand_dims(np.expand_dims(
#                     cv2.resize(roi, (224, 224)), -1), 0)
#                 emo_image = np.expand_dims(np.expand_dims(
#                     cv2.resize(image_grey, (48, 48)), -1), 0)
#                 ageg_image = np.expand_dims(np.expand_dims(
#                     cv2.resize(image_grey, (64, 64)), -1), 0)

#                 predict_name = m.model_name.predict(input_image)
#                 predict_emotion = m.model_emotion.predict(emo_image)
#                 predict_age = m.model_age.predict(ageg_image)

#                 print(predict_age[0])

#                 # face_instance = m.FaceData(
#                 #     top=top,
#                 #     right=right,
#                 #     bottom=bottom,
#                 #     left=left,
#                 #     emotion=m.get_emotion(predict_emotion),
#                 #     age=m.get_age(predict_age[1]),
#                 #     gender=m.get_gender(predict_age[0]),
#                 # )
#                 # face_instance.save()

#                 data["faces"].append({"location": face_locations,
#                                       "emotion": m.get_emotion(predict_emotion),
#                                       "age": m.get_age(predict_age[0]),
#                                       "gender": m.get_gender(predict_age[1]),
#                                       "name": m.get_name(predict_name).capitalize(),
#                                       })
#             data["success"] = True

#     return JsonResponse(data)
