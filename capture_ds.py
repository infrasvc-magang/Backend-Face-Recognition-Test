import cv2
import os
import time

frames = 0
desired = 90
process = False

vid = cv2.VideoCapture(0)
home = os.getcwd()

train_dir = home + '/train/'
name = 'ridho/'  # edit ganti nama sama nama yang lain

path = os.path.join(train_dir, name)

try:
    os.mkdir(path)
    process = True
except:
    print("Class of " + name +
          " already existed, do you want to overwrite everything?.")
    yn = input("[Y] = Yes [n] = No : ")
    if (yn == 'Y'):
        process = True
    else:
        print("Make sure you have changed the 'name' variable if you want to create a new class.")
        os._exit(0)

while (process):
    ret, frame = vid.read()
    time.sleep(2)

    while (process):
        ret, frame = vid.read()
        if (process):
            frames += 1
            file_name = path + str(frames) + ".jpg"
            print("Saved under filename:", file_name)

            cv2.imwrite(file_name, frame)
            time.sleep(0.2)

            if (desired/frames == 1):
                process = False
                break

    break

print("Face capture finished!")
