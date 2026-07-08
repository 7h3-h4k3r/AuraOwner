from flask import Blueprint


dialog = Blueprint(
    'dialog',
    __name__,
    url_prefix='/api/v1/dialog'
)
badgeList = [
    {"text": "In Stock",        "icon": "🟢", "color": "text-success",   "outline": "btn-outline-success"},
    {"text": "Hot Deal",        "icon": "🔥", "color": "text-danger",    "outline": "btn-outline-danger"},
    {"text": "Best Seller",     "icon": "⭐", "color": "text-warning",   "outline": "btn-outline-warning"},
    {"text": "Featured",        "icon": "💎", "color": "text-primary",   "outline": "btn-outline-primary"},
    {"text": "New Arrival",     "icon": "🆕", "color": "text-info",      "outline": "btn-outline-info"},
    {"text": "Limited Stock",   "icon": "⚠️", "color": "text-dark",      "outline": "btn-outline-dark"},
    {"text": "On Sale",         "icon": "🏷️", "color": "text-danger",    "outline": "btn-outline-danger"},
    {"text": "Sold Out",        "icon": "❌", "color": "text-secondary", "outline": "btn-outline-secondary"},
    {"text": "Coming Soon",     "icon": "🚀", "color": "text-primary",   "outline": "btn-outline-primary"},
    {"text": "Trending",        "icon": "⚡", "color": "text-warning",   "outline": "btn-outline-warning"},
    {"text": "Special Offer",   "icon": "🎁", "color": "text-success",   "outline": "btn-outline-success"},
    {"text": "Clearance",       "icon": "💰", "color": "text-danger",    "outline": "btn-outline-danger"},
    {"text": "Flash Sale",      "icon": "⏰", "color": "text-danger",    "outline": "btn-outline-danger"},
    {"text": "Editor's Choice", "icon": "❤️", "color": "text-danger",    "outline": "btn-outline-danger"},
    {"text": "Premium",         "icon": "👑", "color": "text-warning",   "outline": "btn-outline-warning"},
]

discountBadgeList = [
    {"text": "5% OFF",          "icon": "🏷️", "color": "", "outline": "btn-outline-success"},
    {"text": "10% OFF",         "icon": "💸", "color": "", "outline": "btn-outline-success"},
    {"text": "15% OFF",         "icon": "🎉", "color": "",    "outline": "btn-outline-info"},
    {"text": "20% OFF",         "icon": "💰", "color": "", "outline": "btn-outline-primary"},
    {"text": "25% OFF",         "icon": "🔥", "color": "", "outline": "btn-outline-warning"},
    {"text": "30% OFF",         "icon": "⚡", "color": "", "outline": "btn-outline-warning"},
    {"text": "40% OFF",         "icon": "💥", "color": "",  "outline": "btn-outline-danger"},
    {"text": "50% OFF",         "icon": "🚨", "color": "",  "outline": "btn-outline-danger"},
    {"text": "60% OFF",         "icon": "🎊", "color": "",  "outline": "btn-outline-danger"},
    {"text": "70% OFF",         "icon": "💯", "color": "",  "outline": "btn-outline-danger"},
    {"text": "Buy 1 Get 1",     "icon": "🎁", "color": "", "outline": "btn-outline-primary"},
    {"text": "Flat ₹100 OFF",   "icon": "💵", "color": "", "outline": "btn-outline-success"},
    {"text": "Flat ₹500 OFF",   "icon": "💸", "color": "", "outline": "btn-outline-success"},
    {"text": "Free Gift",       "icon": "🎀", "color": "",    "outline": "btn-outline-info"},
    {"text": "Free Shipping",   "icon": "🚚", "color": "", "outline": "btn-outline-primary"},
]

from . import route