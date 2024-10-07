from gpiozero import Robot, Motor
from time import sleep
import sys

robot = Robot(left=Motor(4, 14), right=Motor(17, 18))

for i in range(2):
    robot.forward()
    sleep(0.4)
    robot.backward(0.3)
    sleep(0.4)
sys.exit('Stopped');
