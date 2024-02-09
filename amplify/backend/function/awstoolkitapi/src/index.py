import awsgi
import boto3
import os

from flask_cors import CORS
from flask import Flask, request, jsonify
from uuid import uuid4

BASE_ROUTE = '/encrypted-data'
TABLE = os.environ['STORAGE_AWSTOOLKITDB_NAME']

client = boto3.client('dynamodb')

app = Flask(__name__)
CORS(app)

@app.route(BASE_ROUTE, methods=['GET'])
def home():
    msg = "Welcome to the Encrypted Data API!"
    return jsonify(message=msg)

@app.route(BASE_ROUTE + '/<id>', methods=['GET'])
def get_encrypted_data(id):
    data = client.get_item(TableName=TABLE, Key={'id': {'S': id}})
    return jsonify(data=data)

@app.route(BASE_ROUTE + '/<id>', methods=['PUT'])
def put_encrypted_data(id):
    data = request.get_json()
    client.update_item(TableName=TABLE, Key={'id': {'S': id}}, 
        UpdateExpression='SET encrypted-data = :encrypted-data, expiration-date = :expiration-date', 
        ExpressionAttributeValues={
            ':encrypted-data': {'S': data['encrypted-data']},
            ':expiration-date': {'N': data['expiration-date']}
        }
    )
    return jsonify(message='updated')

@app.route(BASE_ROUTE, methods=['POST'])
def post_encrypted_data():
    _id = str(uuid4())
    data = request.get_json()
    client.put_item(TableName=TABLE, Item={
        'id': {'S': _id},
        'encrypted-data': {'S': data['encrypted-data']},
        'encryption-key-hash': {'S': data['encryption-key-hash']}, 
        'expiration-date': {'N': data['expiration-date']},
    }) 
    return jsonify(message=_id)

@app.route(BASE_ROUTE + '/<id>', methods=['DELETE'])
def delete_encrypted_data(id):
    client.delete_item(TableName=TABLE, Key={'id': {'S': id}})
    return jsonify(message='deleted encrypted data')


def handler(event, context):
    return awsgi.response(app, event, context)

