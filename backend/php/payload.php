<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, API-Key, Authorization');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header("Content-Type: application/json");

// Handle OPTIONS request (CORS preflight) - just return 200 and exit
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Function to load existing events from JSON file
function loadEvents() {
    if (!file_exists('payload.json') || filesize('payload.json') == 0) {
        return [];
    }
    
    $handle = fopen('payload.json', 'r');
    if ($handle && flock($handle, LOCK_SH)) {
        $content = fread($handle, filesize('payload.json'));
        flock($handle, LOCK_UN);
        fclose($handle);
        
        $events = json_decode($content, true);
        return is_array($events) ? $events : [];
    }
    
    if ($handle) {
        fclose($handle);
    }
    
    return [];
}

// Function to save events to JSON file
function saveEvents($events) {
    $json = json_encode($events, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    
    $handle = fopen('payload.json', 'w');
    if ($handle && flock($handle, LOCK_EX)) {
        fwrite($handle, $json);
        flock($handle, LOCK_UN);
        fclose($handle);
        return true;
    }
    
    if ($handle) {
        fclose($handle);
    }
    
    return false;
}

// Handle GET requests only
if (isset($_GET['type'])) {
    $events = loadEvents();
    
    // Create new event entry from GET parameter
    $newEvent = [
        'type' => (int)$_GET['type'],
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    // If type is 5 (new game request), clear all previous events and keep only this one
    if ((int)$_GET['type'] === 5) {
        $events = [$newEvent];
    } else {
        $events[] = $newEvent;
    }
    
    if (saveEvents($events)) {
        echo json_encode(['status' => 'success', 'message' => 'Event added']);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to save event']);
    }
} else {
    // Return all events
    $events = loadEvents();
    
    // Clear the payload.json file after reading
    if (!empty($events)) {
        $handle = fopen('payload.json', 'w');
        if ($handle) {
            fclose($handle); // This creates an empty file
        }
    }
    
    echo json_encode($events, JSON_PRETTY_PRINT);
}