import lambdas_utils
import unittest
import os

base_dir = os.path.abspath(".")

class TestCodeSnippet(unittest.TestCase):
    def __init__(self, *args, **kwargs):
        self.file_name = os.path.join(base_dir, "lambdas/code_snippet/lambda")
        self.function_name = "code_snippet_lambda"
        super(TestCodeSnippet, self).__init__(*args, **kwargs)

    def test_a_setup_lambda(self):
        print(f'\r\nCreating {self.file_name}...')
        lambdas_utils.create_lambda(function_name=self.function_name, file_name=self.file_name)

    def test_b_lambda_functionality(self):
        print(f'\r\nInvoking {self.function_name} Lambda...')
        payload = lambdas_utils.invoke_function(function_name=self.function_name)
        print(payload)
        self.assertEqual(payload['message'], 'Hello User!')

    def test_c_delete_lambda(self):
        print(f'\r\nDeleting {self.function_name} Lambda...')
        lambdas_utils.delete_lambda(function_name=self.function_name)

