<?php
require_once "user.php";
$bruker = User::get_current();

?>

<script>
    var brettdata = {
<?php

if ($bruker) {
    $brettliste = $bruker->brettliste();
    //print_r($brettliste);
    
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
                echo ", '{$brett[0]}'],\n";
                ++$i;
            }
        }
        echo "},\n";
    }
    //define('ANTALL_BRETT', 10);
    
    //for ($i = 1; is_file("brett/standard/$i.json"); ++$i) {
    //    
    //    $contents = file_get_contents("brett/standard/$i.json");
    //    echo "'";
    //    echo str_replace(array("    ", "\n", "\r"), "", $contents);
    //    echo "',\n";
    //}
    
    define('ANTALL_BRETT', $i);
}



?>
    }
</script>