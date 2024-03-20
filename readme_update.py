import requests
import re

def fetch_readme(url):
    response = requests.get(url)
    if response.status_code == 200:
        content = response.text    
        return content
    return None

def extract_sections(content):
    # Regular expression to find comments and the text following them
    pattern = re.compile(r"<!--\s*(.*?)\s*-->\s*(.*?)(?=$|<!--)", re.DOTALL)

    matches = pattern.findall(content)
    section_dict = {match[0].strip(): match[1] for match in matches}
    return section_dict

def update_readme(readme_content, org_section_dict):
    pattern = re.compile(r"(<!--\s*(.*?)\s*-->\s*)(.*?)(?=$|<!--)", re.DOTALL)
    
    def replace_with_original(match):
        section = match.group(2).strip()  # Extract the section key
        if section in org_section_dict:
            # Replace with original content if section is found
            return match.group(1) + org_section_dict[section]
        else:
            # If section not found, return the match unchanged
            return match.group(0)
        
    updated_content = pattern.sub(replace_with_original, readme_content)
    return updated_content

def main():
    org_readme_url = 'https://raw.githubusercontent.com/voice-over-vision/.github/main/profile/README.md'
    org_readme = fetch_readme(org_readme_url)
    org_section_dict = extract_sections(org_readme)

    readme_path = './README.md'

    with open(readme_path, 'r+', encoding='utf-8') as file:
        readme = file.read()
        updated_readme = update_readme(readme, org_section_dict)
        file.seek(0)
        file.write(updated_readme)
        file.truncate()

if __name__ == '__main__':
    main()