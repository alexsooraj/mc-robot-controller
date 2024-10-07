from gpiozero import Motor
from time import sleep

# Define enable pins for each motor
left_enable_pin = 22
right_enable_pin = 23

# Create motors with their respective enable pins
left_motor = Motor(forward=4, backward=14, enable=left_enable_pin)
right_motor = Motor(forward=17, backward=18, enable=right_enable_pin)

# Function to move forward with a slight right turn
def move_forward_slightly_right(duration):
    # Adjust the speeds for a slight turn
    left_motor.forward(0.4)  # Full speed
    right_motor.forward(0.4)  # Slightly reduced speed
    sleep(duration)
    # Stop the motors
    left_motor.stop()
    right_motor.stop()

for i in range(1):
    move_forward_slightly_right(4)
    # Optionally add a turn or other actions here
    sleep(1)
