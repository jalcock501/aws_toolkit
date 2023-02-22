import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    logging.info("Hands-on-cloud")
    return {
        "message": "Hello User!"
    }