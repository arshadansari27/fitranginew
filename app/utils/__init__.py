from rake import extract_keywords
import re

TAG_RE = re.compile(r'<[^>]+>') 

def tag_remove(text):
    return TAG_RE.sub('', text)
