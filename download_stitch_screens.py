#!/usr/bin/env python3
"""
Download all Stitch screens from SepsisGuard project
Project ID: 4680220219121158629
"""

import requests
import os
from pathlib import Path

# Define all screen URLs from the Stitch project
SCREENS = {
    "01_login.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2U3NmIxZDg2ZDcyNjQxMjBhZmQzMDRmYzMwMjMxMWZmEgsSBxDE0YOquA4YAZIBIwoKcHJvamVjdF9pZBIVQhM0NjgwMjIwMjE5MTIxMTU4NjI5&filename=&opi=89354086",
    "02_doctor_dashboard.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzVjNTAyNDYzOGY5ODRjMDVhMzlmZjFhNjUyODljYWVkEgsSBxDE0YOquA4YAZIBIwoKcHJvamVjdF9pZBIVQhM0NjgwMjIwMjE5MTIxMTU4NjI5&filename=&opi=89354086",
    "03_doctor_detail.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzY5M2IwYWE2YWJiYzQ3Y2ViZmJiZTQyMzY0MDNhZjEyEgsSBxDE0YOquA4YAZIBIwoKcHJvamVjdF9pZBIVQhM0NjgwMjIwMjE5MTIxMTU4NjI5&filename=&opi=89354086",
    "04_patient_dashboard.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2ZhNjg4MDBlMDkyYTQxNmM4NjE5MTE0NjNkMGYxNjY3EgsSBxDE0YOquA4YAZIBIwoKcHJvamVjdF9pZBIVQhM0NjgwMjIwMjE5MTIxMTU4NjI5&filename=&opi=89354086",
    "05_family_dashboard.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2I4ZmE4NDMyZGRiYzQzMzU5MmIwMGMzMTY1M2QzYjA0EgsSBxDE0YOquA4YAZIBIwoKcHJvamVjdF9pZBIVQhM0NjgwMjIwMjE5MTIxMTU4NjI5&filename=&opi=89354086",
    "06_clinical_reports.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzRkYmYzOThiYTQ4MzRhODE4ZjIyOWRlZDkxMTA1ZGJiEgsSBxDE0YOquA4YAZIBIwoKcHJvamVjdF9pZBIVQhM0NjgwMjIwMjE5MTIxMTU4NjI5&filename=&opi=89354086",
    "07_educational_resources.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2Q4ZjRlZDQzZmQ2YjRlZjA4Mjg2NjUyM2E2YTZjN2U2EgsSBxDE0YOquA4YAZIBIwoKcHJvamVjdF9pZBIVQhM0NjgwMjIwMjE5MTIxMTU4NjI5&filename=&opi=89354086",
    "08_support_help_desk.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzYzODVlNTA0YWQwNzQ2MDc4MDkwZDhlYTZlOThiYTAzEgsSBxDE0YOquA4YAZIBIwoKcHJvamVjdF9pZBIVQhM0NjgwMjIwMjE5MTIxMTU4NjI5&filename=&opi=89354086",
}

OUTPUT_DIR = Path("stitch-exports")
OUTPUT_DIR.mkdir(exist_ok=True)

def download_screen(filename, url):
    """Download a single screen from Stitch"""
    try:
        print(f"⏳ Downloading {filename}...", end=" ")
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        filepath = OUTPUT_DIR / filename
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(response.text)
        
        size_kb = len(response.text) / 1024
        print(f"✅ ({size_kb:.1f} KB)")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("=" * 60)
    print("🎯 Downloading SepsisGuard Stitch Screens")
    print("=" * 60)
    
    success_count = 0
    for filename, url in SCREENS.items():
        if download_screen(filename, url):
            success_count += 1
    
    print("\n" + "=" * 60)
    print(f"✅ Downloaded {success_count}/{len(SCREENS)} screens")
    print(f"📁 Location: {OUTPUT_DIR.absolute()}")
    print("=" * 60)
    
    # List files
    print("\n📋 Files downloaded:")
    for file in sorted(OUTPUT_DIR.glob("*.html")):
        print(f"  ✓ {file.name}")

if __name__ == "__main__":
    main()
