<?php

require "user.php";
session_start();

$r = array(
    'status' => 0,
    'error' => array()
);

/*
 * Status:
 * 0: Alt OK
 * 1: Ikke logget inn
 */

$bruker = User::get_current();

if (!$bruker) {
    $r['error'][] = "Ikke logget inn";
    $r['status'] = 1;
    die(json_encode($r));
}

$mappe = $_POST['mappenavn'];
$fil = $_POST['filnavn'];

if (!$bruker->har_mappe($mappe)) {
    $r['ny_mappe'] = true;
}

$bruker->apne_brett($mappe, $fil);

die(json_encode($r));