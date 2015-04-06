#!/bin/python
'''
Use this script if 'install -r requirements.txt' cammand fails

'''
import os

for i in  open('requirements.txt', 'r'):
	print "Installing ....",  i
	os.system("pip install "+ i)

