<?php
/**
 * =========================================================================
 * CONTACT FORM CONFIGURATION (TEMPLATE)
 * =========================================================================
 * Copy this file to config.php and fill in the real values.
 *
 *   cp config.example.php config.php
 *
 * config.php holds the SMTP password and must never be committed or
 * referenced from frontend code. The .htaccess in this folder blocks direct
 * HTTP access to both files.
 */

// Block direct browser access; this file is only ever included by contact.php
if (!defined('VS_CONTACT_HANDLER')) {
    http_response_code(403);
    exit('Forbidden');
}

return [
    // Where enquiries are delivered
    'recipient'      => 'hello@vistarsolution.com',
    'recipient_name' => 'Vistarsolution LLP',

    // Subject line of the notification email
    'subject'        => 'New Contact Form Enquiry',

    // Timezone used for the "Submitted On" row
    'timezone'       => 'Asia/Kolkata',

    // Domains allowed to post to this endpoint (empty = same-origin only)
    'allowed_origins' => [
        'https://vistarsolution.com',
        'https://www.vistarsolution.com',
    ],

    /**
     * Delivery transport.
     *   'mail' — PHP's built-in mail() function. Works on most shared hosting
     *            with no credentials. Try this first.
     *   'smtp' — Authenticated SMTP via PHPMailer. More reliable deliverability;
     *            requires composer require phpmailer/phpmailer
     */
    'transport' => 'smtp',

    // The From address must be on your own domain or mail will be rejected/spammed
    'from_email' => 'hello@vistarsolution.com',
    'from_name'  => 'Vistarsolution Website',

    // Only used when transport is 'smtp'
    'smtp' => [
        'host'       => 'smtp.hostinger.com',
        'port'       => 465,
        'encryption' => 'ssl',          // 'ssl' (port 465) or 'tls' (port 587)
        'username'   => 'hello@vistarsolution.com',
        'password'   => 'D+3T~f=s',
    ],
];
