#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# ZOMBIE - First Quick Response Game             by MikePetovick
#
# In this zombie game based on QR codes, players delve into a post-apocalyptic world infested with zombies.
# Using their mobile devices, players scan QR codes scattered throughout the environment to unlock weapons,
# supplies, and the last survivor wins!

import segno
from PIL import Image
import os
import tempfile
import shutil

# Function to generate QR codes and save them as temporary images
def generate_qr(data, temp_dir):
    qr = segno.make_qr(data, error='h')
    filename = os.path.join(temp_dir, f'{data}.png')  # Use data as part of the filename
    qr.save(filename, scale=2, border=1, light='white')
    return filename

# Function to create QR code cards (SURVIVAL-KIT QRs)
def kit_card():
    # Define the data for the QR codes and their filenames
    qr_data = [
        ('❤', 'wd1.png'), ('+2⛏', 'wd2.png'), ('✘', 'wd3.png'), ('+1⛏', 'wd4.png'), 
        ('2❤', 'wd5.png'), ('+1⛏', 'wd6.png'), ('⚡', 'wd7.png'), ('✘', 'wd8.png'), 
        ('3❤', 'wd9.png'), ('❤', 'wd10.png'), ('❤', 'wd11.png'), ('+2⛏', 'wd12.png'),
        ('+1⛏', 'wd13.png'), ('⚡', 'wd14.png'), ('❤', 'wd15.png'), ('2❤', 'wd16.png'),
        ('✘', 'wd17.png'), ('+1⛏', 'wd18.png'), ('❤', 'wd19.png'), ('+1⛏', 'wd20.png'),
        ('+3⛏', 'wd21.png'), ('⚡', 'wd22.png'), ('+1⛏', 'wd23.png'), ('✘', 'wd24.png'),
        ('❤', 'wd25.png')
    ]

    # Create a temporary directory for the QR images
    with tempfile.TemporaryDirectory() as temp_dir:
        # Generate the QR codes and save them as temporary images
        qr_files = [generate_qr(data, temp_dir) for data, _ in qr_data]

        card = Image.new('RGB', (274, 357))  # create layout
        background = Image.open('background.png')

        # Load all QR images dynamically
        qr_images = [Image.open(filename) for filename in qr_files]
        
        # Position of the QR codes on the card (calculated automatically)
        positions = [(x * 50 + 16, y * 48 + 16) for y in range(5) for x in range(5)]

        card.paste(background, (0, 0))  # Position background

        # Paste each QR code in the corresponding position
        for qr_img, position in zip(qr_images, positions):
            card.paste(qr_img, position)

        # Save the final image
        card.save('SURVIVAL_KIT-sideB.png')

        # No need to manually delete the temporary files, as they are cleaned up when the context ends

# Function to create ZOMBIE cards (ZOMBIE QRs)
def zombie_card():
    # Define the data for the QR codes and their filenames
    qr_data = [
        ('1', 'wd1.png'), ('1', 'wd2.png'), ('3', 'wd3.png'), ('2', 'wd4.png'),
        ('✔', 'wd5.png'), ('1', 'wd6.png'), ('☠', 'wd7.png'), ('2', 'wd8.png'),
        ('✔', 'wd9.png'), ('1', 'wd10.png'), ('3', 'wd11.png'), ('2', 'wd12.png'),
        ('✔', 'wd13.png'), ('1', 'wd14.png'), ('1', 'wd15.png'), ('2', 'wd16.png'),
        ('✔', 'wd17.png'), ('1', 'wd18.png'), ('1', 'wd19.png'), ('✔', 'wd20.png'),
        ('1', 'wd21.png'), ('1', 'wd22.png'), ('☠', 'wd23.png'), ('3', 'wd24.png'),
        ('2', 'wd25.png')
    ]

    # Create a temporary directory for the QR images
    with tempfile.TemporaryDirectory() as temp_dir:
        # Generate the QR codes and save them as temporary images
        qr_files = [generate_qr(data, temp_dir) for data, _ in qr_data]

        card = Image.new('RGB', (274, 357))  # create layout
        background = Image.open('background.png')

        # Load all QR images dynamically
        qr_images = [Image.open(filename) for filename in qr_files]
        
        # Position of the QR codes on the card (calculated automatically)
        positions = [(x * 50 + 16, y * 48 + 16) for y in range(5) for x in range(5)]

        card.paste(background, (0, 0))  # Position background

        # Paste each QR code in the corresponding position
        for qr_img, position in zip(qr_images, positions):
            card.paste(qr_img, position)

        # Save the final image
        card.save('ZOMBIE-sideB.png')

        # Temporary files are deleted automatically when the context ends

# Run both functions to generate the cards
kit_card()
zombie_card()
