<!DOCTYPE html>
<html>
    <head>
        <title>Pepperkake Adventures</title>
        <link rel="stylesheet" href="stil.css" />
        <!--<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>-->
        <script src="jquery.min.js"></script>
        <?php require "brett.php"; ?>
        <script src="Kontroll.js"></script>
        <script src="Enhet.js"></script>
        <script src="fiender/kontroll/GelebolleKontroll.js"></script>
        <script src="fiender/Gelebolle.js"></script>
        <script src="SpillerKontroll.js"></script>
        <script src="Spiller.js"></script>
        <script src="Plattform.js"></script>
        <script src="BlinkPlattform.js"></script>
        <script src="HeisPlattform.js"></script>
        <script src="Brett.js"></script>
        <script src="Spill.js"></script>
        <script src="pepperkake.js"></script>
    </head>
    <body>
        <div id="spillvindu">
            <div id="hovedmeny">
                <h1 id="spilloverskrift">Pepperkake Adventures</h1>
                <span id="startknapp">Start spill</span>
            </div>
            <div id="brettmeny" style="display: none;">
                <h1 id="brettoverskrift">Velg et brett</h1>
                <div id="brettknapper">
                    <?php for ($i = 0; $i < ANTALL_BRETT; ++$i) { ?>
                    <span class="brettknapp" brett="<?= $i; ?>"><?= $i+1; ?></span>
                    <?php } ?>
                </div>
            </div>
            <div id="tapmeny" style="display: none;">
                <h1 id="tapoverskrift">Spillet er over</h1>
                <span class="okknapp" id="tapokknapp">Tilbake</span>
            </div>
        </div>
    </body>
</html>