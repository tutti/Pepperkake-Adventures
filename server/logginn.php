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
 * 2: Feil brukernavn eller passord
 */

if (!User::user_exists($_POST['brukernavn'])) {
    $r['error'][] = "Feil brukernavn eller passord";
    $r['status'] = 2;
    die(json_encode($r));
}

$bruker = new User($_POST['brukernavn']);
if (!$bruker->authenticate($_POST['passord'])) {
    $r['error'][] = "Feil brukernavn eller passord";
    $r['status'] = 2;
    die(json_encode($r));
}

die(json_encode($r));