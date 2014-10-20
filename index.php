<!DOCTYPE html>
<?php
require "server/user.php";
$user = User::get_current();
?>
<html>
    <head>
        <title>Pepperkake Adventures</title>
        <link rel="stylesheet" href="stil.css" />
        <!--<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>-->
        <script src="jquery.min.js"></script>
        <?php require "brett.php"; ?>
        <script src="Lyd.js"></script>
        <script src="Kontroll.js"></script>
        <script src="Enhet.js"></script>
        <script src="fiender/kontroll/GelebolleKontroll.js"></script>
        <script src="fiender/Gelebolle.js"></script>
        <script src="fiender/kontroll/SeigeninjaKontroll.js"></script>
        <script src="fiender/Seigeninja.js"></script>
        <script src="fiender/kontroll/JulebruiserKontroll.js"></script>
        <script src="fiender/Julebruiser.js"></script>
        <script src="PepperkakeKontroll.js"></script>
        <script src="Pepperkake.js"></script>
        <script src="SpillerKontroll.js"></script>
        <script src="Plattform.js"></script>
        <script src="BlinkPlattform.js"></script>
        <script src="HeisPlattform.js"></script>
        <script src="Brett.js"></script>
        <script src="Spill.js"></script>
        <script src="script.js"></script>
    </head>
    <body>
        <audio id="bgm" src=""></audio>
        <?php define('ANTALL_LYD', 10);
        for ($i = 0; $i < ANTALL_LYD; ++$i) { ?>
        <audio id="lyd<?=$i?>" src=""></audio>
        <?php } ?>
        <script>
            var antall_lydelementer = <?=ANTALL_LYD?>;
        </script>
        <div id="spillvindu">
            <div id="testblokk"></div>
            <div id="hovedmeny" class="meny">
                <h1 id="spilloverskrift">Pepperkake Adventures</h1>
                <?php //if ($user) { ?>
                <span id="startknapp" class="knapp">Start spill</span>
                <?php //} else { ?>
<!--                <span id="loginknapp" class="knapp">Logg inn</span>
                <span id="registrerknapp" class="knapp">Registrer</span>-->
                <?php //} ?>
            </div>
            <div id="brettmeny" class="meny" style="display: none;">
                <h1 id="brettoverskrift">Velg et brett</h1>
                <div id="brettknapper">
                    <?php for ($i = 0; $i < ANTALL_BRETT; ++$i) { ?>
                    <span class="brettknapp knapp" brett="<?= $i; ?>"><?= $i+1; ?></span>
                    <?php } ?>
                </div>
            </div>
            <div id="tapmeny" class="meny" style="display: none;">
                <h1 id="tapoverskrift">Spillet er over</h1>
                <span class="knapp okknapp" id="tapokknapp">Tilbake</span>
            </div>
            <div id="loginmeny" class="meny" style="display: none;">
                
            </div>
        </div>
    </body>
</html>