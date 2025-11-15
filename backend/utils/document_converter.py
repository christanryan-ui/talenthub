import io
import logging
from typing import Tuple, Optional
import subprocess
import tempfile
import os

logger = logging.getLogger(__name__)

def convert_doc_to_pdf(file_content: bytes, original_filename: str) -> Tuple[Optional[bytes], str]:
    """
    Convert DOC/DOCX to PDF using LibreOffice
    
    Args:
        file_content: Original file content as bytes
        original_filename: Original filename with extension
        
    Returns:
        Tuple of (PDF bytes, error message). PDF bytes is None if conversion failed.
    """
    try:
        # Get file extension
        file_ext = original_filename.lower().split('.')[-1]
        
        # If already PDF, return as is
        if file_ext == 'pdf':
            return file_content, ""
        
        # Only convert doc and docx
        if file_ext not in ['doc', 'docx']:
            return None, f"Unsupported file format: {file_ext}"
        
        # Create temporary directory for conversion
        with tempfile.TemporaryDirectory() as temp_dir:
            # Save input file
            input_path = os.path.join(temp_dir, original_filename)
            with open(input_path, 'wb') as f:
                f.write(file_content)
            
            # Convert using LibreOffice in headless mode
            try:
                result = subprocess.run(
                    [
                        'libreoffice',
                        '--headless',
                        '--convert-to',
                        'pdf',
                        '--outdir',
                        temp_dir,
                        input_path
                    ],
                    capture_output=True,
                    text=True,
                    timeout=60  # 60 second timeout
                )
                
                if result.returncode != 0:
                    logger.error(f"LibreOffice conversion failed: {result.stderr}")
                    return None, f"Conversion failed: {result.stderr}"
                
            except subprocess.TimeoutExpired:
                return None, "Conversion timeout - file too large or complex"
            except FileNotFoundError:
                logger.error("LibreOffice not found. Install with: apt-get install libreoffice")
                return None, "Document conversion service not available"
            
            # Read converted PDF
            pdf_filename = original_filename.rsplit('.', 1)[0] + '.pdf'
            pdf_path = os.path.join(temp_dir, pdf_filename)
            
            if not os.path.exists(pdf_path):
                return None, "PDF file not created - conversion may have failed"
            
            with open(pdf_path, 'rb') as f:
                pdf_content = f.read()
            
            logger.info(f"Successfully converted {original_filename} to PDF")
            return pdf_content, ""
            
    except Exception as e:
        logger.error(f"Error converting document: {str(e)}")
        return None, f"Conversion error: {str(e)}"

def validate_file_size(file_content: bytes, max_size_mb: int = 20) -> Tuple[bool, str]:
    """
    Validate file size
    
    Args:
        file_content: File content as bytes
        max_size_mb: Maximum allowed size in MB
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    file_size_mb = len(file_content) / (1024 * 1024)
    
    if file_size_mb > max_size_mb:
        return False, f"File size ({file_size_mb:.2f}MB) exceeds maximum allowed size ({max_size_mb}MB)"
    
    return True, ""

def validate_file_type(filename: str) -> Tuple[bool, str]:
    """
    Validate file type
    
    Args:
        filename: Original filename
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    allowed_extensions = ['pdf', 'doc', 'docx']
    file_ext = filename.lower().split('.')[-1]
    
    if file_ext not in allowed_extensions:
        return False, f"File type .{file_ext} not allowed. Allowed types: {', '.join(allowed_extensions)}"
    
    return True, ""
