import unittest
from unittest import mock 
import cv_document_parse
from mongo_config import db
from datetime import date

class TestCVDocumentParse(unittest.TestCase):
    def setUp(self):
        self.mock_path = mock.patch.object(
            cv_document_parse, 'path', 'utilities/cv_document_mock.docx'
        )

    def test_is_reading_correct_file(self):
        with self.mock_path:
            paragraphs, _ = cv_document_parse.import_doc(test=True)
            first_line = paragraphs[0]        
            self.assertEqual(first_line,'1999-2006 – Primary School')
    
    def test_is_getting_correct_titles(self):
        with self.mock_path:
            _, lifestages = cv_document_parse.import_doc(test=True)
            titles = []
            for each in lifestages:
                titles.append(each['title'])

            self.assertIn('2006-2013 – Lancaster Girls’ Grammar School',titles)
    
    def test_lifestages_list_is_populated(self):
        with self.mock_path:
            _, lifestages = cv_document_parse.import_doc(test=True)
            self.assertTrue(lifestages[1]['achievements'])
    
    def test_mongo_data_type_date(self):
        collection = db['lifestages']
        result = collection.find_one({'title': '2006-2013 – Lancaster Girls’ Grammar School'})
        self.assertIsInstance(result['date_start'],date)



if __name__ == '__main__':
    unittest.main()