<script>
    var brettdata = [
<?php

define('ANTALL_BRETT', 1);

for ($i = 1; $i <= ANTALL_BRETT; ++$i) {
    $contents = file_get_contents("brett/$i.json");
    echo '"';
    echo base64_encode(str_replace(array("    ", "\n"), "", $contents));
    echo "\",\n";
}

?>
    ]
</script>