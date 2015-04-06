__author__ = 'arshad'

from PIL import Image
from base64 import decodestring
from StringIO import StringIO

data = open('test.html', 'r').read()

data = data[data.index(','):]
s = StringIO(decodestring(data))
u = Image.open(s)
u.save('test.png')


