import os
import logging
import json
from zipfile import ZipFile

import boto3
from lambda_list import LAMBDA_LIST

AWS_REGION = 'us-west-2'
AWS_PROFILE = 'test'
ENDPOINT_URL = 'http://localhost:4566'
LAMBDA_ZIP = './function.zip'

boto3.setup_default_session(profile_name=AWS_PROFILE)

# logger config
logger = logging.getLogger()
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s: %(levelname)s: %(message)s')


def get_boto3_client(service):
    """
    Initialize Boto3 Lambda client.
    """
    try:
        lambda_client = boto3.client(
            service,
            region_name=AWS_REGION,
            endpoint_url=ENDPOINT_URL
        )
    except Exception as e:
        logger.exception('Error while connecting to LocalStack.')
        raise e
    else:
        return lambda_client


def create_lambda_zip(file_name):
    """
    Generate ZIP file for lambda function.
    """
    try:
        with ZipFile(LAMBDA_ZIP, 'w') as zip:
            zip.write(file_name + '.py')
    except Exception as e:
        logger.exception('Error while creating ZIP file.')
        raise e


def create_lambda(function_name, file_name):
    """
    Creates a Lambda function in LocalStack.
    """
    try:
        lambda_client = get_boto3_client('lambda')
        _ = create_lambda_zip(file_name)

        # create zip file for lambda function.
        with open(LAMBDA_ZIP, 'rb') as f:
            zipped_code = f.read()

        lambda_client.create_function(
            FunctionName=function_name,
            Runtime='python3.8',
            Role='role',
            Handler=file_name + '.handler',
            Code=dict(ZipFile=zipped_code)
        )
    except Exception as e:
        logger.exception('Error while creating function.')
        raise e


def delete_lambda(function_name):
    """
    Deletes the specified lambda function.
    """
    try:
        lambda_client = get_boto3_client('lambda')
        lambda_client.delete_function(
            FunctionName=function_name
        )
        # remove the lambda function zip file
        os.remove(LAMBDA_ZIP)
    except Exception as e:
        logger.exception('Error while deleting lambda function')
        raise e


def invoke_function(function_name):
    """
    Invokes the specified function and returns the result.
    """
    try:
        lambda_client = get_boto3_client('lambda')
        response = lambda_client.invoke(
            FunctionName=function_name)
        # print(response)    
        return json.loads(
            response['Payload']
            .read()
            .decode('utf-8')
        )
    except Exception as e:
        logger.exception('Error while invoking function')
        raise e

if __name__ == "__main__":
    for key, value in LAMBDA_LIST.items():
        create_lambda(function_name=value, file_name=key) # to create the lambda function
        #delete_lambda(function_name=value) # to delete the lambda function
        #resp = invoke_function(value) 
        #print(resp)