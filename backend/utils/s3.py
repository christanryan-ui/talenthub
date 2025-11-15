import boto3
from botocore.exceptions import ClientError
import os
import logging
from typing import Optional
import uuid

logger = logging.getLogger(__name__)

# AWS S3 Configuration
AWS_ACCESS_KEY_ID = "AKIAVS2IRIWNSVURIZID"
AWS_SECRET_ACCESS_KEY = "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"
S3_BUCKET_NAME = "zixer-aha-files"
AWS_REGION = "ap-south-1"

# Initialize S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

def upload_file_to_s3(file_content: bytes, file_name: str, content_type: str = 'application/octet-stream') -> Optional[str]:
    """
    Upload a file to S3 and return the URL
    
    Args:
        file_content: File content as bytes
        file_name: Name of the file
        content_type: MIME type of the file
        
    Returns:
        URL of uploaded file or None if failed
    """
    try:
        # Generate unique filename
        file_extension = file_name.split('.')[-1] if '.' in file_name else ''
        unique_filename = f"{uuid.uuid4()}.{file_extension}" if file_extension else str(uuid.uuid4())
        s3_key = f"resumes/{unique_filename}"
        
        # Upload to S3
        s3_client.put_object(
            Bucket=S3_BUCKET_NAME,
            Key=s3_key,
            Body=file_content,
            ContentType=content_type,
            ACL='private'  # Files are private by default
        )
        
        # Generate URL
        file_url = f"https://{S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{s3_key}"
        
        logger.info(f"File uploaded successfully to S3: {file_url}")
        return file_url
        
    except ClientError as e:
        logger.error(f"Failed to upload file to S3: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error uploading to S3: {str(e)}")
        return None

def delete_file_from_s3(file_url: str) -> bool:
    """
    Delete a file from S3
    
    Args:
        file_url: Full URL of the file in S3
        
    Returns:
        True if deleted, False otherwise
    """
    try:
        # Extract key from URL
        s3_key = file_url.split(f"{S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/")[-1]
        
        s3_client.delete_object(
            Bucket=S3_BUCKET_NAME,
            Key=s3_key
        )
        
        logger.info(f"File deleted from S3: {s3_key}")
        return True
        
    except ClientError as e:
        logger.error(f"Failed to delete file from S3: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error deleting from S3: {str(e)}")
        return False

def generate_presigned_url(file_url: str, expiration: int = 3600) -> Optional[str]:
    """
    Generate a presigned URL for private file access
    
    Args:
        file_url: Full URL of the file in S3
        expiration: Time in seconds for the URL to remain valid
        
    Returns:
        Presigned URL or None if failed
    """
    try:
        # Extract key from URL
        s3_key = file_url.split(f"{S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/")[-1]
        
        presigned_url = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': S3_BUCKET_NAME,
                'Key': s3_key
            },
            ExpiresIn=expiration
        )
        
        return presigned_url
        
    except ClientError as e:
        logger.error(f"Failed to generate presigned URL: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error generating presigned URL: {str(e)}")
        return None
