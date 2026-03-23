#!/usr/bin/env python3
"""
GatorBait Media Writer Submission → Automated Publishing System
Parses emails from submissions@gatorbaitmedia.com and automates:

- Blog post creation (Wix Blog API)
- Mobile app sync (webhook)
- Newsletter compilation (every 3rd article)
- Magazine queue (monthly)
"""

import os
import json
import re
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import base64
from google.auth.transport.requests import Request
from google.oauth2.service_account import Credentials
from google.api_core.gapic_v1 import client_info as grpc_client_info
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import requests

# ============================================================================
# CONFIGURATION
# ============================================================================

WIX_SITE_ID = "18fb3a4e-d7f6-414a-aeb9-3047db3ea115"
WIX_API_ENDPOINT = "https://www.wixapis.com/blog/v3/posts"
GMAIL_LABEL_PENDING = "Pending-Publication"
GMAIL_LABEL_PROCESSED = "Published-GatorBait"

# Category ID mapping (from your Wix blog)
CATEGORY_MAPPING = {
    "basketball": "60909101-f3bb-4691-8e65-5f16e0b7a7aa",
    "football": "a4577921-a2e9-41bb-8a5d-4a9c56f2eb5b",
    "recruiting": "1658bcf6-adb1-4c24-84db-9dc6781a5cae",
    "baseball": "e5f927a8-5d6a-412b-a144-f48c84003ab3",
    "softball": "2e2f8f49-4f46-4fa7-bf62-759deb5261ad",
    "breaking-news": "1feacd08-2894-47d1-a1f4-9b0c7a3a82a6",
    "feature": "d87d6b50-11d3-494d-97cd-aad63680bc49",
    "analysis": "60909101-f3bb-4691-8e65-5f16e0b7a7aa",
}

# ============================================================================
# GMAIL API SETUP
# ============================================================================

def get_gmail_service():
    """Authenticate with Gmail API using service account."""
    try:
        # Load credentials from environment or file
        credentials_json = os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON')
        if not credentials_json:
            with open('google-service-account.json', 'r') as f:
                creds_dict = json.load(f)
        else:
            creds_dict = json.loads(credentials_json)

        credentials = Credentials.from_service_account_info(
            creds_dict,
            scopes=['https://www.googleapis.com/auth/gmail.modify']
        )
        service = build('gmail', 'v1', credentials=credentials)
        return service
    except Exception as e:
        print(f"Gmail auth error: {e}")
        return None


# ============================================================================
# EMAIL PARSING
# ============================================================================

class SubmissionParser:
    """Parse incoming submission emails into structured article data."""

    MARKERS = {
        "title": "ARTICLE TITLE",
        "subtitle": "SUBTITLE",
        "featured_image": "FEATURED IMAGE URL",
        "category": "CATEGORY",
        "tags": "TAGS",
        "excerpt": "EXCERPT",
        "content_start": "---ARTICLE CONTENT STARTS BELOW---",
        "author_bio": "AUTHOR BIO",
        "author_social": "AUTHOR SOCIAL",
        "plus_exclusive": "GATORBAIT PLUS EXCLUSIVE?",
        "featured": "FEATURED?",
        "content_end": "---END ARTICLE---",
    }

    @staticmethod
    def parse_email_body(body: str) -> Dict:
        """
        Parse email body into structured article data.

        Expected format:
        ARTICLE TITLE
        ==============
        [Title here]

        CATEGORY
        ========
        [Category]

        ... etc
        """
        article = {
            "title": "",
            "subtitle": "",
            "featured_image_url": "",
            "category": "",
            "tags": [],
            "excerpt": "",
            "body": "",
            "author_bio": "",
            "author_social": {},
            "plus_exclusive": False,
            "featured": False,
        }

        lines = body.split('\n')
        current_section = None
        section_content = []
        in_content = False

        for line in lines:
            # Check for section markers
            found_marker = False
            for key, marker in SubmissionParser.MARKERS.items():
                if marker in line:
                    # Save previous section
                    if current_section and section_content:
                        SubmissionParser._save_section(article, current_section, section_content)

                    current_section = key
                    section_content = []
                    in_content = (key == "content_start")
                    found_marker = True
                    break

            if not found_marker:
                if current_section:
                    section_content.append(line)

        # Save final section
        if current_section and section_content:
            SubmissionParser._save_section(article, current_section, section_content)

        return article

    @staticmethod
    def _save_section(article: Dict, section: str, content: List[str]):
        """Save parsed section into article dict."""
        content_text = '\n'.join(content).strip()

        if section == "title":
            article["title"] = content_text
        elif section == "subtitle":
            article["subtitle"] = content_text
        elif section == "featured_image":
            article["featured_image_url"] = content_text
        elif section == "category":
            article["category"] = content_text.lower()
        elif section == "tags":
            article["tags"] = [t.strip() for t in content_text.split(',')]
        elif section == "excerpt":
            article["excerpt"] = content_text
        elif section == "content_start":
            article["body"] = content_text
        elif section == "author_bio":
            article["author_bio"] = content_text
        elif section == "plus_exclusive":
            article["plus_exclusive"] = "yes" in content_text.lower()
        elif section == "featured":
            article["featured"] = "yes" in content_text.lower()


# ============================================================================
# WIX BLOG API
# ============================================================================

class WixBlogAPI:
    """Interface with Wix Blog API."""

    def __init__(self, wix_auth_token: str):
        """Initialize with Wix API token."""
        self.auth_token = wix_auth_token
        self.headers = {
            "Authorization": wix_auth_token,
            "Content-Type": "application/json",
        }

    def create_draft_post(self, article: Dict) -> Optional[str]:
        """
        Create a draft blog post in Wix.
        Returns post ID if successful, None otherwise.
        """
        try:
            # Convert article body to richContent format (simplified)
            rich_content = self._create_rich_content(article["body"])

            # Get category ID
            category_id = CATEGORY_MAPPING.get(article["category"], "")

            payload = {
                "post": {
                    "title": article["title"],
                    "excerpt": article["excerpt"],
                    "richContent": rich_content,
                    "categoryIds": [category_id] if category_id else [],
                    "featured": article["featured"],
                    "commentingEnabled": True,
                    "hashtags": article["tags"],
                    "language": "en",
                }
            }

            response = requests.post(
                WIX_API_ENDPOINT,
                headers=self.headers,
                json=payload
            )

            if response.status_code in [200, 201]:
                post_data = response.json()
                post_id = post_data.get("post", {}).get("id")
                print(f"Blog post created: {post_id}")
                return post_id
            else:
                print(f"Wix API error: {response.status_code}")
                print(f"   Response: {response.text}")
                return None

        except Exception as e:
            print(f"Error creating blog post: {e}")
            return None

    @staticmethod
    def _create_rich_content(body: str) -> Dict:
        """
        Convert plain text article body to Wix richContent format.

        Simplified version - converts paragraphs to PARAGRAPH nodes.
        For production, would need more sophisticated parsing.
        """
        nodes = []
        node_id_counter = 0

        for paragraph in body.split('\n\n'):
            if not paragraph.strip():
                continue

            node = {
                "type": "PARAGRAPH",
                "id": f"p{node_id_counter}",
                "nodes": [
                    {
                        "type": "TEXT",
                        "id": "",
                        "nodes": [],
                        "textData": {
                            "text": paragraph.strip(),
                            "decorations": []
                        }
                    }
                ],
                "paragraphData": {}
            }
            nodes.append(node)
            node_id_counter += 1

        return {"nodes": nodes}


# ============================================================================
# ARTICLE COUNTER & NEWSLETTER
# ============================================================================

class ArticleCounter:
    """Track article count for newsletter triggering."""

    COUNTER_FILE = "article_counter.json"

    @classmethod
    def get_count(cls) -> int:
        """Get current article count."""
        if os.path.exists(cls.COUNTER_FILE):
            with open(cls.COUNTER_FILE, 'r') as f:
                data = json.load(f)
                return data.get("count", 0)
        return 0

    @classmethod
    def increment(cls) -> int:
        """Increment counter and return new count."""
        count = cls.get_count() + 1
        with open(cls.COUNTER_FILE, 'w') as f:
            json.dump({"count": count, "last_updated": datetime.now().isoformat()}, f)
        return count

    @classmethod
    def reset(cls):
        """Reset counter after newsletter sent."""
        with open(cls.COUNTER_FILE, 'w') as f:
            json.dump({"count": 0, "last_updated": datetime.now().isoformat()}, f)


# ============================================================================
# NEWSLETTER COMPILATION
# ============================================================================

class NewsletterCompiler:
    """Compile every 3rd article into newsletter."""

    ARTICLE_QUEUE_FILE = "article_queue.json"

    @classmethod
    def queue_article(cls, article: Dict, post_id: str):
        """Add article to queue for newsletter compilation."""
        queue = cls._load_queue()
        queue.append({
            "post_id": post_id,
            "title": article["title"],
            "excerpt": article["excerpt"],
            "featured_image": article["featured_image_url"],
            "timestamp": datetime.now().isoformat(),
        })
        cls._save_queue(queue)

    @classmethod
    def should_send_newsletter(cls) -> bool:
        """Check if newsletter should be sent (every 3rd article)."""
        return ArticleCounter.get_count() % 3 == 0

    @classmethod
    def compile_newsletter(cls, articles: List[Dict]) -> str:
        """
        Compile 3 articles into HTML newsletter.
        Returns HTML content.
        """
        html = """<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {{ font-family: Georgia, serif; background: #f5f5f5; }}
        .container {{ max-width: 600px; margin: 0 auto; background: white; }}
        .header {{ background: #0a0a0a; color: #FA4616; padding: 20px; text-align: center; }}
        .story {{ padding: 20px; border-bottom: 1px solid #eee; }}
        .headline {{ font-size: 18px; font-weight: bold; margin: 10px 0; }}
        .excerpt {{ color: #666; margin: 10px 0; }}
        .cta {{ color: #FA4616; text-decoration: none; font-weight: bold; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>GatorBait Friday Briefing</h2>
            <p>Week of {date}</p>
        </div>
""".format(date=datetime.now().strftime("%B %d, %Y"))

        for i, article in enumerate(articles[:3], 1):
            html += """
        <div class="story">
            <div class="headline">{title}</div>
            <div class="excerpt">{excerpt}</div>
            <a href="https://gatorbaitmedia.com/blog/{post_id}" class="cta">Read Full Story &rarr;</a>
        </div>
""".format(
                title=article.get('title', 'No Title'),
                excerpt=article.get('excerpt', 'No excerpt'),
                post_id=article.get('post_id')
            )

        html += """
        <div style="padding: 20px; background: #f0f0f0; text-align: center;">
            <p>Want exclusive premium coverage?</p>
            <a href="https://gatorbaitmedia.com/gatorbait-plus" style="background: #FA4616; color: white; padding: 10px 20px; text-decoration: none; display: inline-block;">Subscribe to GatorBait Plus</a>
        </div>
    </div>
</body>
</html>
"""
        return html

    @classmethod
    def _load_queue(cls) -> List[Dict]:
        """Load article queue from file."""
        if os.path.exists(cls.ARTICLE_QUEUE_FILE):
            with open(cls.ARTICLE_QUEUE_FILE, 'r') as f:
                return json.load(f)
        return []

    @classmethod
    def _save_queue(cls, queue: List[Dict]):
        """Save article queue to file."""
        with open(cls.ARTICLE_QUEUE_FILE, 'w') as f:
            json.dump(queue, f, indent=2)


# ============================================================================
# MAIN WORKFLOW
# ============================================================================

def process_submission_email(email_data: Dict) -> bool:
    """
    Process a single submission email.
    Returns True if successful, False otherwise.
    """
    print(f"\nProcessing email: {email_data.get('subject')}")

    # Parse email body
    body = email_data.get("body", "")
    article = SubmissionParser.parse_email_body(body)

    print(f"  Title: {article['title']}")
    print(f"  Category: {article['category']}")
    print(f"  Tags: {', '.join(article['tags'])}")

    # Create Wix blog post
    wix_api = WixBlogAPI(os.getenv('WIX_AUTH_TOKEN', ''))
    post_id = wix_api.create_draft_post(article)

    if not post_id:
        print("Failed to create blog post")
        return False

    # Queue article for newsletter/magazine
    NewsletterCompiler.queue_article(article, post_id)

    # Increment counter
    new_count = ArticleCounter.increment()
    print(f"  Article count: {new_count}")

    # Check if newsletter should be sent
    if NewsletterCompiler.should_send_newsletter():
        print("  Sending newsletter (every 3rd article)")
        queue = NewsletterCompiler._load_queue()
        newsletter_html = NewsletterCompiler.compile_newsletter(queue)

        # TODO: Send newsletter via Gmail API
        # send_newsletter(newsletter_html)

        # Reset queue
        NewsletterCompiler._save_queue([])
        ArticleCounter.reset()

    return True


# ============================================================================
# ENTRY POINT
# ============================================================================

def main():
    """Main workflow: check for pending emails, process submissions."""
    print("GatorBait Media Writer Submission System")
    print(f"   Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Example test email data (in production, would come from Gmail API)
    test_email = {
        "subject": "[GAME RECAP] | Iowa Stuns Florida 73-72 | GatorBait Media",
        "body": """ARTICLE TITLE
==============
The One That Got Away

SUBTITLE
========
Iowa's Cinderella Run Ends Florida's Back-to-Back Championship Dream

FEATURED IMAGE URL
==================
https://storage.googleapis.com/images/iowa-florida.jpg

CATEGORY
========
Basketball

TAGS
====
tournament, ncaa, florida, iowa, march-madness

EXCERPT
=======
Ninth-seeded Iowa stuns defending champion Florida 73-72 in NCAA Tournament second round.

---ARTICLE CONTENT STARTS BELOW---

TAMPA, Fla. -- In the annals of NCAA Tournament heartbreak, Sunday night's loss will occupy a unique place in Gators history.

When Alvaro Folgueiras nailed a 3-pointer with 4.5 seconds remaining, ninth-seeded Iowa delivered a stunning blow to top-seeded Florida, defeating the defending national champions 73-72.

---END ARTICLE---"""
    }

    # Process test email
    success = process_submission_email(test_email)

    if success:
        print("\nEmail processed successfully")
    else:
        print("\nEmail processing failed")


if __name__ == "__main__":
    main()
