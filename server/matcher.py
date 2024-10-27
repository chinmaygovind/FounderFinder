import sqlite3
import json
from openai import OpenAI
from typing import List, Dict
import os 
from dotenv import load_dotenv 

load_dotenv()

# Set your OpenAI API key
client = OpenAI()
client.api_key = os.getenv('OPENAI_API_KEY')

def get_all_profiles() -> List[Dict]:
    conn = sqlite3.connect('./users.db')
    c = conn.cursor()
    c.execute("SELECT profile_data, user_email FROM profiles")
    profiles = c.fetchall()
    conn.close()
    
    return [[json.loads(profile[0]), profile[1]] for profile in profiles]

def add_sample_profiles():
    sample_profiles = [
        {
            "School": "Wharton",
            "Skills": ["Business Knowledge"],
            "Technical": False,
            "LookingForSchool": "Wharton",
            "LookingForTechnical": True,
            "LookingForSkills": ["Marketing"],
            "Idea": "Feet Finder"
        },
        {
            "School": "MIT",
            "Skills": ["Machine Learning", "Data Science"],
            "Technical": True,
            "LookingForSchool": "Any",
            "LookingForTechnical": False,
            "LookingForSkills": ["Business Development"],
            "Idea": "AI-powered Personal Assistant"
        },
        {
            "School": "Stanford",
            "Skills": ["UX Design", "Product Management"],
            "Technical": False,
            "LookingForSchool": "Any",
            "LookingForTechnical": True,
            "LookingForSkills": ["Software Development"],
            "Idea": "Social Network for Pet Owners"
        }
    ]
    emails = ["sample1@sample.com","sample2@sample.com","sample3@sample.com","sample4@sample.com"]
    conn = sqlite3.connect('users.db')
    c = conn.cursor()

    for i in range(len(sample_profiles)):
        c.execute("INSERT INTO profiles (profile_data, user_email, user_id) VALUES (?,?,?)", (json.dumps(sample_profiles[i]),emails[i],i))
    conn.commit()
    conn.close()
    print(f"Added {len(sample_profiles)} sample profiles to the database.")


def create_prompt(profiles: List[Dict]) -> str:
    prompt = "Based on the following founder profiles, suggest potential matches for co-founders. Consider their skills, technical abilities, schools, and ideas.Here are the profiles:\n\n"
    
    for profile_data in profiles:
        profile = [profile_data[0]]
        email = profile_data[1]
        prompt += f"Founder {email}:\n"
        prompt += f"School: {profile[0]['School']}\n"
        prompt += f"Skills: {', '.join(profile[0]['Skills'])}\n"
        prompt += f"Technical: {'Yes' if profile[0]['Technical'] else 'No'}\n"
        prompt += f"Looking for School: {profile[0]['LookingForSchool']}\n"
        prompt += f"Looking for Technical: {'Yes' if profile[0]['LookingForTechnical'] else 'No'}\n"
        prompt += f"Looking for Skills: {', '.join(profile[0]['LookingForSkills'])}\n"
        prompt += f"Idea: {profile[0]['Idea']}\n\n"
    
    prompt += "Please suggest potential matches among these founders, explaining why they might be good co-founders for each other."
    #print(prompt)
    return prompt

def get_chatgpt_response(prompt: str) -> str:
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that matches potential co-founders based on their profiles."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message

def main():
    profiles = get_all_profiles()
    prompt = create_prompt(profiles)
    
    print("Sending request to ChatGPT...")
    response = get_chatgpt_response(prompt)
    
    print("\nChatGPT's Founder Matching Suggestions:")
    print(response.content)

if __name__ == "__main__":
    main()