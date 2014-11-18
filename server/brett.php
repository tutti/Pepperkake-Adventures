<?php
require_once "user.php";
$bruker = User::get_current();

?>

<script>
    var brettdata = {
<?php

if ($bruker) {
    $brettliste = $bruker->brettliste();
    
    $i = 0;
    
    foreach ($brettliste as $mappenavn => $mappe) {
        echo "'".$mappenavn."': {\n";
        foreach ($mappe as $num => $brett) {
            if (is_file("brett/$mappenavn/{$brett[0]}")) {
                $contents = file_get_contents("brett/$mappenavn/{$brett[0]}");
                echo "'";
                echo str_replace(array("    ", "\n", "\r"), "", $contents);
                echo "': ";
                if ($brett[1]) echo "[true";
                else echo "[false";
                echo ", '{$brett[0]}'";
                if ($brett[2]) echo ", {$brett[2]}";
                else echo ", -1";
                if ($brett[3]) echo ", {$brett[3]}";
                else echo ", 0";
                echo "],\n";
                ++$i;
            }
        }
        echo "},\n";
    }
    
    define('ANTALL_BRETT', $i);
}



?>
    }
</script>