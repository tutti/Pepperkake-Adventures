<!DOCTYPE html>
<?php
require_once "server/user.php";
session_start();
$bruker = User::get_current();
?>
<html>
    <head>
        <title>Pepperkake Adventures</title>
        <meta charset="UTF-8" />
        <link rel="stylesheet" href="stil.css" />
        <!--<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>-->
        <script src="jquery.min.js"></script>
        <?php require "server/brett.php"; ?>
        <script src="Server.js"></script>
        <script src="Lyd.js"></script>
        <script src="Kontroll.js"></script>
        <script src="Enhet.js"></script>
        <script src="fiender/kontroll/GelebolleKontroll.js"></script>
        <script src="fiender/kontroll/SeigeninjaKontroll.js"></script>
        <script src="fiender/kontroll/JulebruiserKontroll.js"></script>
        <script src="fiender/kontroll/SnomannKontroll.js"></script>
        <script src="fiender/kontroll/RoborudolfKontroll.js"></script>
        <script src="fiender/kontroll/JulenisseKontroll.js"></script>
        <script src="fiender/Gelebolle.js"></script>
        <script src="fiender/Seigeninja.js"></script>
        <script src="fiender/Julebruiser.js"></script>
        <script src="fiender/Snomann.js"></script>
        <script src="fiender/Roborudolf.js"></script>
        <script src="fiender/Julenisse.js"></script>
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
        <audio id="bgm" src="" loop="loop"></audio>
        <?php define('ANTALL_LYD', 10);
        for ($i = 0; $i < ANTALL_LYD; ++$i) { ?>
        <audio id="lyd<?=$i?>" src=""></audio>
        <?php } ?>
        <script>
            var antall_lydelementer = <?=ANTALL_LYD?>;
        </script>
        <div id="ui">
            <div id="spillerhp" style="display: none;">
                <img id="spillerhp-1" src="bilder/hjerte1.png" />
                <img id="spillerhp-2" src="bilder/hjerte1.png" />
                <img id="spillerhp-3" src="bilder/hjerte1.png" />
            </div>
            <div id="bosshp" style="display: none;">
                <div id="bosshp-indre"></div>
            </div>
            <img id="laster" src="bilder/laster.gif" style="display: none;" />
        </div>
        <div id="spillvindu">
            <div id="testblokk"></div>
            <div id="hovedmeny" class="meny">
                <h1 id="spilloverskrift" class="menyoverskrift">Pepperkake Adventures</h1>
                <?php if ($bruker) { ?>
                <span id="startknapp" class="knapp">Start spill</span>
                <span id="loggutknapp" class="knapp">Logg ut</span>
                <span id="endrepassordknapp" class="knapp">Endre passord</span>
                <?php } else { ?>
                <table id="brukermeny">
                    <tr>
                        <th>Brukernavn</th>
                        <th>Passord</th>
                    </tr>
                    <tr>
                        <td><input type="text" id="brukernavn" /></td>
                        <td><input type="password" id="passord" /></td>
                    </tr>
                    <tr>
                        <td><span id="logginnknapp" class="knapp">Logg inn</span></td>
                        <td><span id="registrerknapp" class="knapp">Registrer</span></td>
                    </tr>
                    <tr>
                        <td colspan="2" class="feilmelding"></td>
                    </tr>
                </table>
                <?php } ?>
            </div>
            <div id="brettmeny" class="meny" style="display: none;">
                <h1 id="brettoverskrift" class="menyoverskrift">Velg et brett</h1>
                <div id="brettknapper-standard" class="brettknapper">
                    <?php for ($i = 0; $i < ANTALL_BRETT; ++$i) { ?>
                    <div id="brettknapp-<?= $i; ?>" class="brettknapp knapp disabled" data-mappe="" data-brett=""><span><?= $i+1; ?></span></div>
                    <?php } ?>
                </div>
            </div>
            <div id="tapmeny" class="meny" style="display: none;">
                <h1 id="tapoverskrift" class="menyoverskrift">Spillet er over</h1>
                <span class="knapp okknapp" id="tapokknapp">Tilbake</span>
            </div>
            <div id="lastermeny" class="meny" style="display: none;">
                <h1 id="lasteroverskrift" class="menyoverskrift">Laster inn nye brett...</h1>
            </div>
            <div id="brettferdigmeny" class="meny" style="display: none;">
                <h1 id="brettferdigoverskrift" class="menyoverskrift">Brett ferdig</h1>
                <span id="brettferdigtekst"></span>
                <span class="knapp okknapp" id="brettferdigokknapp">OK</span>
            </div>
            <div id="passordmeny" style="display: none;">
                <h1 id="passordoverskrift" class="menyoverskrift">Endre passord</h1>
                <table>
                    <tr>
                        <td><label for="gammeltpassord">Gammelt passord:</label></td>
                        <td><input type="password" id="gammeltpassord" /></td>
                    </tr>
                    <tr>
                        <td><label for="nyttpassord1">Nytt passord:</label></td>
                        <td><input type="password" id="nyttpassord1" /></td>
                    </tr>
                    <tr>
                        <td><label for="nyttpassord2">Nytt passord (igjen):</label></td>
                        <td><input type="password" id="nyttpassord2" /></td>
                    </tr>
                    <tr>
                        <td colspan="2" class="feilmelding"></td>
                    </tr>
                    <tr>
                        <td colspan="2"><span id="send_endrepassordknapp" class="knapp">Endre passord</span></td>
                    </tr>
                </table>
            </div>
        </div>
        <a href="mailto:beta@pepperkake.net" style="display: block; width: 100%; text-align: center;">Tilbakemeldinger?</a>
    </body>
</html>