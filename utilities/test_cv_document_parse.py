import unittest
import cv_document_parse
import docx2txt

class TestCVDocumentParse(unittest.TestCase):
    def test_is_reading_correct_file(self):
        first_line = cv_document_parse.paragraphs[0]        
        self.assertEqual(first_line,'1999-2006 Primary School')
    
    def test_is_getting_correct_titles(self):
        titles = []
        for each in cv_document_parse.lifestages:
            titles.append(each['title'])

        self.assertIn('2018-2019 – Home renovation',titles)
    
    def test_lifestages_dict_is_populated(self):
        lifestages = cv_document_parse.lifestages
        self.assertTrue(lifestages[1]['achievements'])


if __name__ == '__main__':
    unittest.main()