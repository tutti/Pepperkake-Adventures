<?php

require_once "user.php";
session_start();

$r = array(
    'status' => 0,
    'error' => array()
);

/*
 * Status:
 * 0: Alt OK
 * 1: Ikke logget inn
 * 2: Feil brukernavn eller passord
 * 4: Nytt passord ble ikke skrevet inn likt
 */

$bruker = User::get_current();

if (!$bruker) {
    $r['error'][] = "Ikke logget inn";
    $r['status'] = 1;
    die(json_encode($r));
}

if (!$bruker->authenticate($_POST['gammeltpassord'])) {
    $r['error'][] = "Feil brukernavn eller passord";
    $r['status'] = 2;
}

if ($_POST['nyttpassord1'] != $_POST['nyttpassord2']) {
    $r['error'][] = "Nytt passord ble ikke skrevet inn likt";
    $r['status'] = 4;
}

if ($r['status'] != 0) {
    die(json_encode($r));
}

$bruker->change_password($_POST['nyttpassord1']);
die(json_encode($r));