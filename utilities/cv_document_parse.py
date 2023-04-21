from decouple import config
import docx2txt
import re

path = config('CV_FILE_PATH')
doc_content = docx2txt.process(path)
paragraphs = doc_content.split('\n')

lifestages = []
keys = ['Description','Soft skills','Hard skills','Achievements']
latest_key = ''

for paragraph in paragraphs:
    latest_lifestage_index = len(lifestages) - 1
    if re.match('(19|20)\d{2}',paragraph[0:4]):
        lifestages.append({
            'title': paragraph,
            'description': [],
            'soft_skills': [],
            'hard_skills': [],
            'achievements': []
        })
    elif paragraph in keys:
        key = paragraph.lower().replace(' ','_')
        latest_key = key
    else:
        if latest_key and paragraph:
            lifestages[latest_lifestage_index][latest_key].append(paragraph)
