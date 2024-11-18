import json
import boto3
from decimal import Decimal

# Initialize the DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('VisitorCounter')  # Correct table name

# Custom JSON encoder for handling Decimal types
class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return int(o)  # Convert Decimal to int
        return super(DecimalEncoder, self).default(o)

def lambda_handler(event, context):
    # CORS headers
    headers = {
        'Access-Control-Allow-Origin': '*',  # Replace with your domain in production
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,DELETE'
    }
    
    try:
        # Handle OPTIONS request for CORS
        if event.get('httpMethod') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps('OK')
            }

        # Get the HTTP method from the event
        method = event['httpMethod']  # GET, POST, or DELETE

        if method == 'GET':
            # Handle GET request (Retrieve visitor count)
            response = table.get_item(Key={'Id': 'visitor_count'})
            if 'Item' in response:
                current_count = response['Item']['visitor_count']
            else:
                current_count = 0

            # Return the current visitor count
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'Views': current_count}, cls=DecimalEncoder)
            }
        
        elif method == 'POST':
            # Handle POST request (Increment visitor count)
            response = table.get_item(Key={'Id': 'visitor_count'})
            if 'Item' in response:
                current_count = response['Item']['visitor_count']
                new_count = current_count + 1
            else:
                new_count = 1

            # Update the visitor count in DynamoDB
            table.update_item(
                Key={'Id': 'visitor_count'},
                UpdateExpression='SET visitor_count = :val',
                ExpressionAttributeValues={':val': new_count},
                ReturnValues="UPDATED_NEW"
            )

            # Return the updated count
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'Views': new_count}, cls=DecimalEncoder)
            }
        
        elif method == 'DELETE':
            # Handle DELETE request (Reset visitor count)
            table.put_item(
                Item={
                    'Id': 'visitor_count',
                    'visitor_count': 500  # Reset count to 0
                }
            )

            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'message': 'Visitor count Reset '})
            }

        else:
            return {
                'statusCode': 405,  # Method Not Allowed
                'headers': headers,
                'body': json.dumps({'error': 'Method Not Allowed'})
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }
