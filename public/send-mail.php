<?php
/**
 * Contact form handler for Hostinger hosting.
 * Upload this file to public_html/ (Vite copies public/ to dist/ automatically).
 * Uses PHP mail() — Hostinger routes it via your domain mailbox (hello@vistarsolution.com).
 */

declare(strict_types=1);

const RECIPIENT   = 'hello@vistarsolution.com';
const FROM_EMAIL  = 'hello@vistarsolution.com';
const FROM_NAME   = 'Vistarsolution Website';
const MAX_PER_HOUR = 5;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_WARNING);

function respond(bool $ok, string $message, int $code = 200): void {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'message' => $message]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(false, 'Method not allowed.', 405);
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw ?: '', true);
if (!is_array($data)) {
    $data = $_POST;
}

/* --- Honeypot: bots fill this hidden field, humans never see it --- */
if (!empty($data['website'])) {
    respond(true, 'Thanks! Your message has been sent.');
}

/* --- Simple per-IP rate limit --- */
$ip     = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$window = time() - 3600;
$store  = sys_get_temp_dir() . '/form_rl_' . hash('sha256', $ip) . '.json';

$hits = [];
if (is_file($store)) {
    $hits = json_decode((string) file_get_contents($store), true) ?: [];
    $hits = array_values(array_filter($hits, static fn($t) => is_int($t) && $t > $window));
}
$hits[] = time();
file_put_contents($store, json_encode($hits), LOCK_EX);
if (count($hits) > MAX_PER_HOUR) {
    respond(false, 'Too many requests. Please try again later.', 429);
}

/* --- Field validation (mirrors the client-side rules) --- */
$clean = static function ($v, int $max = 2000): string {
    return mb_substr(trim((string) ($v ?? '')), 0, $max);
};

$name    = $clean($data['name'] ?? '', 60);
$company = $clean($data['company'] ?? '', 80);
$email   = $clean($data['email'] ?? '', 120);
$phone   = $clean($data['phone'] ?? '', 20);
$scope   = $clean($data['scope'] ?? '', 80);
$timeline = $clean($data['timeline'] ?? '', 60);
$details = $clean($data['details'] ?? '', 2000);
$source  = $clean($data['source'] ?? 'contact', 40);

$errors = [];
if (mb_strlen(preg_replace('/[^\p{L}]/u', '', $name)) < 2)      $errors[] = 'name';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))                  $errors[] = 'email';
if (mb_strlen(preg_replace('/\D/', '', $phone)) < 7)             $errors[] = 'phone';
if ($company === '')                                             $errors[] = 'company';
if (mb_strlen($details) < 20)                                    $errors[] = 'details';
if ($errors) {
    respond(false, 'Invalid fields: ' . implode(', ', $errors) . '.', 422);
}

/* --- Header injection guard --- */
$strip = static fn(string $v): string => str_replace(["\r", "\n", '%0a', '%0d'], '', $v);
$name  = $strip($name);
$email = $strip($email);

$subject = sprintf(
    '[%s] Consultation Request: %s (%s)',
    $source === 'homepage-inquiry' ? 'Homepage' : 'Contact Page',
    $company,
    $name
);

$body = "Name: {$name}\n"
      . "Company: {$company}\n"
      . "Work Email: {$email}\n"
      . "Mobile: {$phone}\n"
      . "Engagement Scope: {$scope}\n"
      . "Target Timeline: {$timeline}\n"
      . "Submitted From: {$source} — " . ($_SERVER['HTTP_REFERER'] ?? 'unknown') . "\n"
      . "IP: {$ip}\n\n"
      . "Project Brief & Requirements:\n{$details}\n";

$host = parse_url($_SERVER['HTTP_HOST'] ?? 'vistarsolution.com', PHP_URL_HOST)
      ?: ($_SERVER['HTTP_HOST'] ?? 'vistarsolution.com');

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$encodedName    = '=?UTF-8?B?' . base64_encode(FROM_NAME) . '?=';

$headers  = "From: {$encodedName} <" . FROM_EMAIL . ">\r\n"
          . "Reply-To: {$name} <{$email}>\r\n"
          . "MIME-Version: 1.0\r\n"
          . "Content-Type: text/plain; charset=UTF-8\r\n"
          . "X-Mailer: PHP/" . phpversion() . "\r\n";

$sent = @mail(RECIPIENT, $encodedSubject, $body, $headers);

if (!$sent) {
    respond(false, 'Message could not be sent. Please email us directly at ' . RECIPIENT . '.', 500);
}

respond(true, "Thanks {$name}! Your message has been received — we'll reply within 24 business hours.");
