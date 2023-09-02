import unittest
import portfolio_reading_document_parse
from unittest import mock 
from mongo_config import db
from datetime import date

class TestCVDocumentParse(unittest.TestCase):
    def setUp(self):
        self.mock_path = mock.patch.object(
            portfolio_reading_document_parse, 'path', 'utilities/portfolio_reading_mock.docx'
        )

    def test_is_reading_correct_file(self):
        with self.mock_path:
            lines, _ = portfolio_reading_document_parse.import_doc(test=True)
            self.assertEqual('hard_skills: ML|AI|AWS|SQL',lines[0])
    
    def test_is_getting_correct_titles(self):
        with self.mock_path:
            _, imports = portfolio_reading_document_parse.import_doc(test=True)
            titles = []
            for each in imports:
                titles.append(each['title'])

            self.assertIn('Retail Sales Project',titles)
    
    def test_imports_list_is_populated(self):
        with self.mock_path:
            _, imports = portfolio_reading_document_parse.import_doc(test=True)
        self.assertTrue(imports[0]['link'])

    
    def test_mongo_data_type_date(self):
        collection = db['lifestages']
        result = collection.find_one({'title': 'Retail Sales Project'})
        self.assertIsInstance(result['date_start'],date)



if __name__ == '__main__':
    unittest.main()