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
 */

$bruker = User::get_current();

if ($bruker) {
    $bruker->log_out();
}

die(json_encode($r));