// ============================================
// GatorBait Media — masterPage.js (Velo Code)
// ESPN+/Athletic Dark Theme Global Code
// Paste this into masterPage.js in Wix Velo Dev Mode
// ============================================

import wixWindow from 'wix-window';

$w.onReady(function () {

    // --- STICKY HEADER BEHAVIOR ---
    // Makes header follow user on scroll (premium feel)
    // Note: For this to work, set Header → Settings →
    // "Freeze Header" = ON in the Wix Editor

    // --- DYNAMIC COPYRIGHT YEAR ---
    // If you have a text element with ID #copyrightText in footer:
    if ($w('#copyrightText')) {
        try {
            const year = new Date().getFullYear();
            $w('#copyrightText').text = `© ${year} GatorBait Media. All rights reserved.`;
        } catch (e) {
            // Element may not exist on all pages
        }
    }

    // --- SUBSCRIBE BUTTON GLOW EFFECT ---
    // If you add a button with ID #subscribeBtn:
    if ($w('#subscribeBtn')) {
        try {
            $w('#subscribeBtn').onMouseIn(() => {
                $w('#subscribeBtn').style.backgroundColor = '#ff6b35';
            });
            $w('#subscribeBtn').onMouseOut(() => {
                $w('#subscribeBtn').style.backgroundColor = '#f47521';
            });
        } catch (e) {
            // Element may not exist on all pages
        }
    }

});
