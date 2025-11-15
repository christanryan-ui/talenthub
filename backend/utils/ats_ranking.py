"""
ATS (Applicant Tracking System) Ranking Algorithm
Matches job requirements with candidate profiles and provides scoring
"""

from typing import List, Dict, Optional
import re

def calculate_skills_match(job_skills: List[str], candidate_skills: List[str]) -> float:
    """
    Calculate skills match percentage
    Returns: Score between 0-100
    """
    if not job_skills:
        return 100.0
    
    if not candidate_skills:
        return 0.0
    
    # Normalize skills to lowercase for comparison
    job_skills_lower = [skill.lower().strip() for skill in job_skills]
    candidate_skills_lower = [skill.lower().strip() for skill in candidate_skills]
    
    # Find matching skills
    matched_skills = set(job_skills_lower) & set(candidate_skills_lower)
    
    # Calculate percentage
    match_percentage = (len(matched_skills) / len(job_skills_lower)) * 100
    
    return round(match_percentage, 2)

def calculate_experience_match(required_experience: int, candidate_experience: int) -> float:
    """
    Calculate experience match score
    Returns: Score between 0-100
    """
    if required_experience == 0:
        return 100.0
    
    if candidate_experience == 0:
        return 0.0
    
    # Perfect match or overqualified
    if candidate_experience >= required_experience:
        # Slight bonus for overqualified, capped at 100
        overqualified_bonus = min((candidate_experience - required_experience) * 2, 10)
        return min(100.0, 100.0 + overqualified_bonus)
    
    # Underqualified - proportional score
    score = (candidate_experience / required_experience) * 100
    
    return round(score, 2)

def calculate_location_match(job_location: str, candidate_locations: List[str], candidate_willing_to_relocate: bool = False) -> float:
    """
    Calculate location match score
    Returns: Score between 0-100
    """
    if not job_location:
        return 100.0
    
    if not candidate_locations and not candidate_willing_to_relocate:
        return 50.0  # Neutral score if no location data
    
    # Willing to relocate gives bonus
    if candidate_willing_to_relocate:
        return 100.0
    
    if not candidate_locations:
        return 50.0
    
    # Normalize locations
    job_location_lower = job_location.lower().strip()
    candidate_locations_lower = [loc.lower().strip() for loc in candidate_locations]
    
    # Check for exact match
    if job_location_lower in candidate_locations_lower:
        return 100.0
    
    # Check for partial match (e.g., "New York" in "New York, NY")
    for candidate_loc in candidate_locations_lower:
        if job_location_lower in candidate_loc or candidate_loc in job_location_lower:
            return 85.0
    
    # No match but has location preferences
    return 30.0

def calculate_education_match(required_education: Optional[str], candidate_education: Optional[List[Dict]]) -> float:
    """
    Calculate education match score
    Returns: Score between 0-100
    """
    if not required_education:
        return 100.0
    
    if not candidate_education:
        return 60.0  # Neutral if no education data
    
    education_levels = {
        'high school': 1,
        'diploma': 2,
        'associate': 3,
        'bachelor': 4,
        'master': 5,
        'phd': 6,
        'doctorate': 6
    }
    
    required_level = 0
    required_lower = required_education.lower()
    for level_name, level_value in education_levels.items():
        if level_name in required_lower:
            required_level = level_value
            break
    
    if required_level == 0:
        return 80.0  # Can't determine required level
    
    # Check candidate's highest education
    highest_candidate_level = 0
    for edu in candidate_education:
        degree = edu.get('degree', '').lower()
        for level_name, level_value in education_levels.items():
            if level_name in degree:
                highest_candidate_level = max(highest_candidate_level, level_value)
    
    if highest_candidate_level >= required_level:
        return 100.0
    elif highest_candidate_level == required_level - 1:
        return 85.0  # Close match
    else:
        return max(50.0, (highest_candidate_level / required_level) * 100)

def calculate_ats_ranking(
    job_data: Dict,
    candidate_profile: Dict,
    weights: Optional[Dict[str, float]] = None
) -> Dict:
    """
    Calculate comprehensive ATS ranking score
    
    Args:
        job_data: Dictionary containing job requirements
        candidate_profile: Dictionary containing candidate profile data
        weights: Optional custom weights for different factors
    
    Returns:
        Dictionary with scores and overall ranking
    """
    # Default weights (must sum to 1.0)
    if weights is None:
        weights = {
            'skills': 0.40,      # 40% weight on skills
            'experience': 0.30,  # 30% weight on experience
            'location': 0.15,    # 15% weight on location
            'education': 0.15    # 15% weight on education
        }
    
    # Calculate individual scores
    skills_score = calculate_skills_match(
        job_data.get('required_skills', []),
        candidate_profile.get('primary_skills', [])
    )
    
    experience_score = calculate_experience_match(
        job_data.get('min_experience', 0),
        candidate_profile.get('experience_years', 0)
    )
    
    location_score = calculate_location_match(
        job_data.get('location', ''),
        candidate_profile.get('preferred_locations', []),
        candidate_profile.get('willing_to_relocate', False)
    )
    
    education_score = calculate_education_match(
        job_data.get('education_required', None),
        candidate_profile.get('education', None)
    )
    
    # Calculate weighted overall score
    overall_score = (
        (skills_score * weights['skills']) +
        (experience_score * weights['experience']) +
        (location_score * weights['location']) +
        (education_score * weights['education'])
    )
    
    # Determine ranking category
    if overall_score >= 85:
        ranking = "Excellent Match"
        category = "highly_recommended"
    elif overall_score >= 70:
        ranking = "Good Match"
        category = "recommended"
    elif overall_score >= 55:
        ranking = "Moderate Match"
        category = "consider"
    else:
        ranking = "Low Match"
        category = "not_recommended"
    
    return {
        'overall_score': round(overall_score, 2),
        'ranking': ranking,
        'category': category,
        'breakdown': {
            'skills': {
                'score': skills_score,
                'weight': weights['skills'],
                'weighted_score': round(skills_score * weights['skills'], 2)
            },
            'experience': {
                'score': experience_score,
                'weight': weights['experience'],
                'weighted_score': round(experience_score * weights['experience'], 2)
            },
            'location': {
                'score': location_score,
                'weight': weights['location'],
                'weighted_score': round(location_score * weights['location'], 2)
            },
            'education': {
                'score': education_score,
                'weight': weights['education'],
                'weighted_score': round(education_score * weights['education'], 2)
            }
        }
    }
