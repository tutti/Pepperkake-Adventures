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
 * 1: Brukernavnet er allerede i bruk
 */

if (User::user_exists($_POST['brukernavn'])) {
    $r['error'][] = "Brukernavnet er allerede i bruk";
    $r['status'] = 1;
    die(json_encode($r));
}

$bruker = User::create($_POST['brukernavn'], $_POST['passord']);

die(json_encode($r));