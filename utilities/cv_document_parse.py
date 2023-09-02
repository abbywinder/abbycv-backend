from decouple import config
import docx2txt
import re
from mongo_config import db
from datetime import datetime


path = config('CV_FILE_PATH')

def import_doc(test=False):
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
                'date_start': datetime.strptime(fr"{paragraph[0:4]}-1-1T10:53:53.000Z", "%Y-%m-%dT%H:%M:%S.000Z"),
                'date_end': datetime.strptime(fr"{paragraph[5:9]}-1-1T10:53:53.000Z", "%Y-%m-%dT%H:%M:%S.000Z"),
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

    if not test:
        collection = db['lifestages']
        for lifestage in lifestages:
            collection.update_one({'title': lifestage['title']}, {'$set': lifestage}, upsert=True)        

    # for testing
    return paragraphs, lifestages


if __name__ == '__main__':
    import_doc()