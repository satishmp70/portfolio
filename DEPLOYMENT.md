# Deployment Guide

This project is deployed as a static website with a PHP SMTP mail endpoint.
Node.js, Vite, npm, and `node_modules` are not required on the server.

## Local Setup

Node.js, Vite, npm, and `node_modules` are not required.

PHP 8.1 or newer and Composer are required for local SMTP mail testing.

From the project directory, install PHPMailer:

```bash
composer install --working-dir=public --no-dev
```

Make the mail dependency and configuration available to the static build:

```bash
mkdir -p dist/vendor
cp -a public/vendor/. dist/vendor/
cp public/api/config.php dist/api/config.php
```

Start the static website and PHP mail endpoint:

```bash
php -S 127.0.0.1:8000 -t dist
```

Open:

```text
http://127.0.0.1:8000/contact/
```

Keep the PHP server running while testing the form. The form submits to
`/api/contact.php` on the same server.

## Server Setup

The server does not need Node.js, Vite, npm, or `node_modules`.

1. Open Hostinger File Manager or connect through SFTP.
2. Open the domain's `public_html/` directory.
3. Upload the contents of `dist/` directly into `public_html/`.
4. Upload `dist/vendor/` separately because `vendor/` is ignored by Git.
5. Upload `dist/api/config.php` separately because it contains the SMTP password and is ignored by Git.
6. Do not upload the `dist` directory as an extra nested folder.

If Composer is available on the server instead of uploading `vendor/`, run:

```bash
cd public_html
composer install --no-dev
```

The server must use PHP 8.1 or newer.

The following paths must exist after upload:

```text
public_html/index.html
public_html/contact/index.html
public_html/assets/
public_html/images/
public_html/api/contact.php
public_html/api/config.php
public_html/vendor/autoload.php
```

## SMTP Configuration

In `public_html/api/config.php`, confirm these values:

```php
'transport' => 'smtp',
'host' => 'smtp.hostinger.com',
'username' => 'hello@vistarsolution.com',
'password' => 'YOUR_MAILBOX_PASSWORD',
```

Keep the password private. Do not place it in frontend JavaScript or public documentation.

## Verification

Open the contact page:

```text
https://your-domain.com/contact/
```

Submit a valid form. The message should be delivered to `hello@vistarsolution.com`.

To verify that the PHP endpoint exists, open:

```text
https://your-domain.com/api/contact.php
```

An existing endpoint returns a JSON `Method not allowed` response for a normal browser `GET`. A `404` means the `api/` directory was not uploaded correctly.

## Troubleshooting

- `404` for `/api/contact.php`: upload `api/` directly inside `public_html/`.
- `PHPMailer is not installed`: upload `vendor/` and confirm `vendor/autoload.php` exists.
- `Origin not allowed`: confirm the domain is listed in `allowed_origins` in `api/config.php`.
- SMTP authentication failure: verify the Hostinger mailbox password and SMTP hostname.
- No message in Inbox: check Spam/Junk and Hostinger mail delivery logs.
