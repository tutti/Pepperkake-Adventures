<script>
    var brettdata = [
<?php

//define('ANTALL_BRETT', 10);

for ($i = 1; is_file("brett/$i.json"); ++$i) {
    $contents = file_get_contents("brett/$i.json");
    echo '"';
    echo base64_encode(str_replace(array("    ", "\n"), "", $contents));
    echo "\",\n";
}

define('ANTALL_BRETT', $i-1);

?>
    ]
</script>