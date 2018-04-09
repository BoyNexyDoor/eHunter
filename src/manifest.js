let config = require('./config');

module.exports = {
    "manifest_version": 2,
    "name": "eHunter - more powerful e-hentai/exhentai!",
    "short_name": "eHunter",
    "description": "more powerful e-hentai/eHentai/exhentai! scroll view and notification",
    "version": config.version,
    "content_security_policy": "script-src 'self'; object-src 'self'",
    "browser_action": {
        "default_popup": "popup.html",
        "default_title": "eHunter",
        "default_icon": {
            "16": "./img/ehunter_icon.png",
            "32": "./img/ehunter_icon.png"
        }
    },
    "icons": {
        "16": "./img/ehunter_icon.png",
        "24": "./img/ehunter_icon.png",
        "48": "./img/ehunter_icon.png",
        "96": "./img/ehunter_icon.png",
        "128": "./img/ehunter_icon.png"
    },
    "author": "Alex Chen",
    "incognito": "spanning",
    "permissions": [
        "activeTab",
        "http://*/",
        "https://*/",
        "storage",
        "background",
        "notifications",
        "cookies"
    ],
    "content_scripts": [
        {
            "matches": [
                "*://alexskye.org/*",
                "*://alexskye.info/*",
                "*://anime-sales.com/*",
                "*://exhentai.org/*",
                "*://hanfengsan.org/*",
                "*://e-hentai.org/*",
                "*://mingzuozhibiba.cn/*"
            ],
            "js": [
                "inject.js"
            ],
            "run_at": "document_end"
        }
    ],
    "web_accessible_resources": [
        "img/*"
    ],
    "background": {
        "scripts": ["background.js"]
    }
};
