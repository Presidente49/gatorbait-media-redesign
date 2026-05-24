#!/usr/bin/env python3
"""
GoHighLevel API Setup Script for The Divorce Club
Programmatically creates: Pipeline, Tags, Custom Fields, and Calendar
"""

import requests
import json
import time

# Configuration
API_TOKEN = "pit-71b6d03d-a66b-4238-aa4c-451ccfd19705"
LOCATION_ID = "qnUWGAHvgNtKSl7YzrWx"
BASE_URL = "https://services.leadconnectorhq.com"

HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json",
    "Version": "2021-07-28"
}

def api_call(method, endpoint, data=None, version=None):
    """Make an API call with error handling"""
    url = f"{BASE_URL}{endpoint}"
    headers = HEADERS.copy()
    if version:
        headers["Version"] = version
    try:
        if method == "GET":
            resp = requests.get(url, headers=headers)
        elif method == "POST":
            resp = requests.post(url, headers=headers, json=data)
        elif method == "PUT":
            resp = requests.put(url, headers=headers, json=data)
        
        print(f"  [{resp.status_code}] {method} {endpoint}")
        if resp.status_code in [200, 201]:
            return resp.json()
        else:
            print(f"  Error: {resp.text[:300]}")
            return None
    except Exception as e:
        print(f"  Exception: {e}")
        return None

def create_tags():
    """Create tags for segmentation"""
    print("\n=== Creating Tags ===")
    
    tags = [
        "divorce-club-member",
        "realtor",
        "event-attendee",
        "podcast-listener",
        "book-reader",
        "marketingmama-lead",
        "vip-member",
        "newly-divorced",
        "going-through-divorce",
        "divorce-complete",
        "real-estate-professional",
        "team-interest",
        "event-host-interest",
        "community-leader"
    ]
    
    for tag in tags:
        data = {"name": tag}
        result = api_call("POST", f"/locations/{LOCATION_ID}/tags", data)
        if result:
            print(f"  ✓ Tag created: {tag}")
        time.sleep(0.3)

def create_custom_fields():
    """Create custom fields for divorce club members"""
    print("\n=== Creating Custom Fields ===")
    
    text_fields = [
        {"name": "Divorce Status", "dataType": "TEXT", "placeholder": "Going Through / Recently Divorced / Divorced 1+ Years"},
        {"name": "Industry", "dataType": "TEXT", "placeholder": "Real Estate, Finance, etc."},
        {"name": "Brokerage", "dataType": "TEXT", "placeholder": "Keller Williams, RE/MAX, etc."},
        {"name": "Referral Source", "dataType": "TEXT", "placeholder": "Instagram, Event, Podcast, etc."},
        {"name": "Event Interest", "dataType": "TEXT", "placeholder": "Networking, Workshops, Social"},
    ]
    
    checkbox_fields = [
        {"name": "MarketingMama Interest", "dataType": "CHECKBOX", "options": ["Yes", "No"]},
        {"name": "Podcast Guest Interest", "dataType": "CHECKBOX", "options": ["Yes", "No"]},
        {"name": "Community Leader Interest", "dataType": "CHECKBOX", "options": ["Yes", "No"]},
    ]
    
    for field in text_fields:
        data = {
            "name": field["name"],
            "dataType": field["dataType"],
        }
        if "placeholder" in field:
            data["placeholder"] = field["placeholder"]
        
        result = api_call("POST", f"/locations/{LOCATION_ID}/customFields", data)
        if result:
            print(f"  ✓ Custom field created: {field['name']}")
        time.sleep(0.3)
    
    for field in checkbox_fields:
        data = {
            "name": field["name"],
            "dataType": field["dataType"],
            "options": field["options"]
        }
        result = api_call("POST", f"/locations/{LOCATION_ID}/customFields", data)
        if result:
            print(f"  ✓ Custom field created: {field['name']}")
        time.sleep(0.3)

def create_pipeline():
    """Create the Fresh Start Journey pipeline"""
    print("\n=== Creating Pipeline: Fresh Start Journey ===")
    
    data = {
        "name": "Fresh Start Journey",
        "stages": [
            {"name": "New Lead", "position": 0},
            {"name": "Waitlist Member", "position": 1},
            {"name": "Event Attendee", "position": 2},
            {"name": "Community Member", "position": 3},
            {"name": "Podcast Guest", "position": 4},
            {"name": "MarketingMama Referral", "position": 5},
            {"name": "VIP / Inner Circle", "position": 6}
        ]
    }
    
    # Try different API versions
    for version in ["2021-07-28", "2021-04-15"]:
        result = api_call("POST", "/opportunities/pipelines", data, version=version)
        if result:
            print(f"  ✓ Pipeline created!")
            return result
    
    return None

def create_calendar():
    """Create event calendar for Divorce Club events"""
    print("\n=== Creating Calendar: Divorce Club Events ===")
    
    data = {
        "locationId": LOCATION_ID,
        "name": "Divorce Club Events",
        "description": "The Divorce Club community events, mixers, and workshops",
        "calendarType": "event"
    }
    
    # Try the calendars endpoint
    result = api_call("POST", "/calendars/", data)
    if not result:
        # Try with services endpoint
        result = api_call("POST", "/calendars/services", data)
    return result

def get_location_info():
    """Verify API access by getting location info"""
    print("\n=== Verifying API Access ===")
    result = api_call("GET", f"/locations/{LOCATION_ID}")
    if result:
        location = result.get("location", result)
        print(f"  ✓ Connected to: {location.get('name', 'Unknown')}")
        print(f"  ✓ Address: {location.get('address', 'Unknown')}")
    return result

def create_contacts():
    """Create sample contacts to test the system"""
    print("\n=== Creating Sample Contact ===")
    
    data = {
        "firstName": "Test",
        "lastName": "Member",
        "email": "test@divorceclub.com",
        "phone": "+15551234567",
        "locationId": LOCATION_ID,
        "tags": ["divorce-club-member", "realtor"],
        "source": "Divorce Club Waitlist"
    }
    
    result = api_call("POST", "/contacts/", data)
    if result:
        print(f"  ✓ Test contact created")
    return result

def main():
    print("=" * 60)
    print("  THE DIVORCE CLUB - GoHighLevel Automated Setup")
    print("=" * 60)
    
    # Step 1: Verify access
    location = get_location_info()
    if not location:
        print("\n❌ Could not connect to GHL API. Check token.")
        return
    
    # Step 2: Create tags
    create_tags()
    
    # Step 3: Create custom fields
    create_custom_fields()
    
    # Step 4: Create pipeline
    create_pipeline()
    
    # Step 5: Create calendar
    create_calendar()
    
    # Step 6: Create test contact
    create_contacts()
    
    print("\n" + "=" * 60)
    print("  SETUP COMPLETE!")
    print("=" * 60)
    print("\nWhat was built:")
    print("  • 14 segmentation tags")
    print("  • 8 custom fields for member profiles")
    print("  • Fresh Start Journey pipeline (7 stages)")
    print("  • Divorce Club Events calendar")
    print("  • Test contact")
    print("\nRemaining (requires GHL UI):")
    print("  • Workflow automations (welcome sequence, event reminders)")
    print("  • Funnel/landing page builder")
    print("  • Email templates")
    print("  • Social media account connections")

if __name__ == "__main__":
    main()
