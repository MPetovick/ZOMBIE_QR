#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# ZOMBIE - First Quick Response Game             by MikePetovick
#
# In this zombie game based on QR codes, players delve into a post-apocalyptic world infested with zombies.
# Using their mobile devices, players scan QR codes scattered throughout the environment to unlock weapons,
# supplies, and the last survivor wins!
#
# For now, it is only compatible with Android mobile devices.
# To use the QR code reader on Android devices, it only works with the open-source Binary Eye app.
#
# The code focuses on the layout of the cards and the value of the QR codes on each one.
#
# Dependencies Segno and Pillow: <pip install segno pillow>
#
# To use code just: <python ZOMBIE.py>

import segno
from PIL import Image

"""
SURVIVAL KIT CARD ˢᵗᵃⁿᵈᵃʳᵈ

❤️ Health  = x6❤️ x2❤️❤️ x1❤️❤️❤️
⛏ Weapon  = x6⛏ x2⛏ ⛏  x1⛏ ⛏ ⛏ 
⚡️ Skip move  = x3⚡️
✘ Empty  = x4✘
"""


def kit_card():  # Create SURVIVAL-KIT QRs
    wd1 = segno.make_qr('❤', error='h')
    wd1.save('wd1.png', scale=2, border=1, light='white')
    wd2 = segno.make_qr('+2⛏', error='h')
    wd2.save('wd2.png', scale=2, border=1, light='white')
    wd3 = segno.make_qr('✘', error='h')
    wd3.save('wd3.png', scale=2, border=1, light='white')
    wd4 = segno.make_qr('+1⛏', error='h')
    wd4.save('wd4.png', scale=2, border=1, light='white')
    wd5 = segno.make_qr('2❤', error='h')
    wd5.save('wd5.png', scale=2, border=1, light='white')
    wd6 = segno.make_qr('+1⛏', error='h')
    wd6.save('wd6.png', scale=2, border=1, light='white')
    wd7 = segno.make_qr('⚡', error='h')
    wd7.save('wd7.png', scale=2, border=1, light='white')
    wd8 = segno.make_qr('✘', error='h')
    wd8.save('wd8.png', scale=2, border=1, light='white')
    wd9 = segno.make_qr('3❤', error='h')
    wd9.save('wd9.png', scale=2, border=1, light='white')
    wd10 = segno.make_qr('❤', error='h')
    wd10.save('wd10.png', scale=2, border=1, light='white')
    wd11 = segno.make_qr('❤', error='h')
    wd11.save('wd11.png', scale=2, border=1, light='white')
    wd12 = segno.make_qr('+2⛏', error='h')
    wd12.save('wd12.png', scale=2, border=1, light='white')
    wd13 = segno.make_qr('+1⛏', error='h')
    wd13.save('wd13.png', scale=2, border=1, light='white')
    wd14 = segno.make_qr('⚡', error='h')
    wd14.save('wd14.png', scale=2, border=1, light='white')
    wd15 = segno.make_qr('❤', error='h')
    wd15.save('wd15.png', scale=2, border=1, light='white')
    wd16 = segno.make_qr('2❤', error='h')
    wd16.save('wd16.png', scale=2, border=1, light='white')
    wd17 = segno.make_qr('✘', error='h')
    wd17.save('wd17.png', scale=2, border=1, light='white')
    wd18 = segno.make_qr('+1⛏', error='h')
    wd18.save('wd18.png', scale=2, border=1, light='white')
    wd19 = segno.make_qr('❤', error='h')
    wd19.save('wd19.png', scale=2, border=1, light='white')
    wd20 = segno.make_qr('+1⛏', error='h')
    wd20.save('wd20.png', scale=2, border=1, light='white')
    wd21 = segno.make_qr('+3⛏', error='h')
    wd21.save('wd21.png', scale=2, border=1, light='white')
    wd22 = segno.make_qr('⚡', error='h')
    wd22.save('wd22.png', scale=2, border=1, light='white')
    wd23 = segno.make_qr('+1⛏', error='h')
    wd23.save('wd23.png', scale=2, border=1, light='white')
    wd24 = segno.make_qr('✘', error='h')
    wd24.save('wd24.png', scale=2, border=1, light='white')
    wd25 = segno.make_qr('❤', error='h')
    wd25.save('wd25.png', scale=2, border=1, light='white')

    card = Image.new('RGB', (274, 357))  # create layout
    background = Image.open('background.png')
    qr1 = Image.open('wd1.png')
    qr2 = Image.open('wd2.png')
    qr3 = Image.open('wd3.png')
    qr4 = Image.open('wd4.png')
    qr5 = Image.open('wd5.png')
    qr6 = Image.open('wd6.png')
    qr7 = Image.open('wd7.png')
    qr8 = Image.open('wd8.png')
    qr9 = Image.open('wd9.png')
    qr10 = Image.open('wd10.png')
    qr11 = Image.open('wd11.png')
    qr12 = Image.open('wd12.png')
    qr13 = Image.open('wd13.png')
    qr14 = Image.open('wd14.png')
    qr15 = Image.open('wd15.png')
    qr16 = Image.open('wd16.png')
    qr17 = Image.open('wd17.png')
    qr18 = Image.open('wd18.png')
    qr19 = Image.open('wd19.png')
    qr20 = Image.open('wd20.png')
    qr21 = Image.open('wd20.png')
    qr22 = Image.open('wd20.png')
    qr23 = Image.open('wd20.png')
    qr24 = Image.open('wd20.png')
    qr25 = Image.open('wd20.png')
    card.paste(background, (0, 0))  # Position background
    card.paste(qr1, (16, 16))  # Row 1
    card.paste(qr2, (66, 16))
    card.paste(qr3, (114, 16))
    card.paste(qr4, (162, 16))
    card.paste(qr5, (212, 16))
    card.paste(qr6, (16, 64))  # Row 2
    card.paste(qr7, (66, 64))
    card.paste(qr8, (114, 64))
    card.paste(qr9, (162, 64))
    card.paste(qr10, (212, 64))
    card.paste(qr11, (16, 112))  # Row 3
    card.paste(qr12, (66, 112))
    card.paste(qr13, (114, 112))
    card.paste(qr14, (162, 112))
    card.paste(qr15, (212, 112))
    card.paste(qr16, (16, 160))  # Row 4
    card.paste(qr17, (65, 160))
    card.paste(qr18, (114, 160))
    card.paste(qr19, (162, 160))
    card.paste(qr20, (212, 160))
    card.paste(qr21, (16, 208))  # Row 5
    card.paste(qr22, (65, 208))
    card.paste(qr23, (114, 208))
    card.paste(qr24, (162, 208))
    card.paste(qr25, (212, 208))
    card.save('SURVIVAL_KIT-sideB.png')


"""
ZOMBIE CARD ˢᵗᵃⁿᵈᵃʳᵈ

Z️ 1-3  = x10Z x5Z x3Z
☠️ Horde = x2☠️
✔ Clean = x5✔
"""


def zombie_card():  # Create ZOMBIE QRs
    wd1 = segno.make_qr('1', error='h')
    wd1.save('wd1.png', scale=2, border=1, light='white')
    wd2 = segno.make_qr('1', error='h')
    wd2.save('wd2.png', scale=2, border=1, light='white')
    wd3 = segno.make_qr('3', error='h')
    wd3.save('wd3.png', scale=2, border=1, light='white')
    wd4 = segno.make_qr('2', error='h')
    wd4.save('wd4.png', scale=2, border=1, light='white')
    wd5 = segno.make_qr('✔', error='h')
    wd5.save('wd5.png', scale=2, border=1, light='white')
    wd6 = segno.make_qr('1', error='h')
    wd6.save('wd6.png', scale=2, border=1, light='white')
    wd7 = segno.make_qr('☠', error='h')
    wd7.save('wd7.png', scale=2, border=1, light='white')
    wd8 = segno.make_qr('2', error='h')
    wd8.save('wd8.png', scale=2, border=1, light='white')
    wd9 = segno.make_qr('✔', error='h')
    wd9.save('wd9.png', scale=2, border=1, light='white')
    wd10 = segno.make_qr('1', error='h')
    wd10.save('wd10.png', scale=2, border=1, light='white')
    wd11 = segno.make_qr('3', error='h')
    wd11.save('wd11.png', scale=2, border=1, light='white')
    wd12 = segno.make_qr('2', error='h')
    wd12.save('wd12.png', scale=2, border=1, light='white')
    wd13 = segno.make_qr('✔', error='h')
    wd13.save('wd13.png', scale=2, border=1, light='white')
    wd14 = segno.make_qr('1', error='h')
    wd14.save('wd14.png', scale=2, border=1, light='white')
    wd15 = segno.make_qr('1', error='h')
    wd15.save('wd15.png', scale=2, border=1, light='white')
    wd16 = segno.make_qr('2', error='h')
    wd16.save('wd16.png', scale=2, border=1, light='white')
    wd17 = segno.make_qr('✔', error='h')
    wd17.save('wd17.png', scale=2, border=1, light='white')
    wd18 = segno.make_qr('1', error='h')
    wd18.save('wd18.png', scale=2, border=1, light='white')
    wd19 = segno.make_qr('1', error='h')
    wd19.save('wd19.png', scale=2, border=1, light='white')
    wd20 = segno.make_qr('✔', error='h')
    wd20.save('wd20.png', scale=2, border=1, light='white')
    wd21 = segno.make_qr('1', error='h')
    wd21.save('wd21.png', scale=2, border=1, light='white')
    wd22 = segno.make_qr('1', error='h')
    wd22.save('wd22.png', scale=2, border=1, light='white')
    wd23 = segno.make_qr('☠', error='h')
    wd23.save('wd23.png', scale=2, border=1, light='white')
    wd24 = segno.make_qr('3', error='h')
    wd24.save('wd24.png', scale=2, border=1, light='white')
    wd25 = segno.make_qr('2', error='h')
    wd25.save('wd25.png', scale=2, border=1, light='white')

    card = Image.new('RGB', (274, 357))  # create layout
    background = Image.open('background.png')
    qr1 = Image.open('wd1.png')
    qr2 = Image.open('wd2.png')
    qr3 = Image.open('wd3.png')
    qr4 = Image.open('wd4.png')
    qr5 = Image.open('wd5.png')
    qr6 = Image.open('wd6.png')
    qr7 = Image.open('wd7.png')
    qr8 = Image.open('wd8.png')
    qr9 = Image.open('wd9.png')
    qr10 = Image.open('wd10.png')
    qr11 = Image.open('wd11.png')
    qr12 = Image.open('wd12.png')
    qr13 = Image.open('wd13.png')
    qr14 = Image.open('wd14.png')
    qr15 = Image.open('wd15.png')
    qr16 = Image.open('wd16.png')
    qr17 = Image.open('wd17.png')
    qr18 = Image.open('wd18.png')
    qr19 = Image.open('wd19.png')
    qr20 = Image.open('wd20.png')
    qr21 = Image.open('wd20.png')
    qr22 = Image.open('wd20.png')
    qr23 = Image.open('wd20.png')
    qr24 = Image.open('wd20.png')
    qr25 = Image.open('wd20.png')
    card.paste(background, (0, 0))  # Position background
    card.paste(qr1, (16, 16))  # Row 1
    card.paste(qr2, (66, 16))
    card.paste(qr3, (114, 16))
    card.paste(qr4, (162, 16))
    card.paste(qr5, (212, 16))
    card.paste(qr6, (16, 64))  # Row 2
    card.paste(qr7, (66, 64))
    card.paste(qr8, (114, 64))
    card.paste(qr9, (162, 64))
    card.paste(qr10, (212, 64))
    card.paste(qr11, (16, 112))  # Row 3
    card.paste(qr12, (66, 112))
    card.paste(qr13, (114, 112))
    card.paste(qr14, (162, 112))
    card.paste(qr15, (212, 112))
    card.paste(qr16, (16, 160))  # Row 4
    card.paste(qr17, (65, 160))
    card.paste(qr18, (114, 160))
    card.paste(qr19, (162, 160))
    card.paste(qr20, (212, 160))
    card.paste(qr21, (16, 208))  # Row 5
    card.paste(qr22, (65, 208))
    card.paste(qr23, (114, 208))
    card.paste(qr24, (162, 208))
    card.paste(qr25, (212, 208))
    card.save('ZOMBIE-sideB.png')


kit_card()
zombie_card()
