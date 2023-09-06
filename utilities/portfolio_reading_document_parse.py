from decouple import config
import docx2txt
import re
from mongo_config import db
from datetime import datetime

path = config('PORTFOLIO_READING_FILE_PATH')

def import_doc(test=False):
    doc_content = docx2txt.process(path)
    lines = doc_content.split('\n')

    keys = ['hard_skills','type','link','title','description','date']
    imports = []
    curr_import = {}

    for line in lines:
        key = line.split(':')[0]
        val = line.split(': ')[-1]
        if key in keys:
            if key == 'date':
                date = datetime.strptime(fr"{val}T10:53:53.000Z", "%Y-%m-%dT%H:%M:%S.000Z")
                curr_import['date_start'] = date
                curr_import['date_end'] = date
            elif key == 'hard_skills':
                curr_import[key] = val.split('|')
            else:
                curr_import[key] = val
        if len(curr_import.keys()) == 7:
            imports.append(curr_import)
            curr_import = {}

    if not test:
        collection = db['lifestages']
        for each in imports:
            collection.update_one({'title': each['title']}, {'$set': each}, upsert=True)

    # for testing
    return lines, imports


if __name__ == '__main__':
    import_doc()