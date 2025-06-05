<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Contrato de Agua</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; margin: 40px; }
        .titulo { text-align: center; font-weight: bold; font-size: 16px; }
        .firma { margin-top: 60px; text-align: center; }
        .firma div { margin-top: 50px; }
    </style>
</head>
<body>

<div class="titulo">
    SISTEMA OPERADOR DE AGUA POTABLE<br>
    PERIODO 2019-2022<br>
    SAN LUCAS ATOYATENCO TEX. PUE.
</div>

<p>
    CONTRATO que celebra por una parte EL COMITÉ DE AGUA POTABLE DE SAN LUCAS ATOYATENCO 2019-2022, TEXMELUCAN PUEBLA
    y por otra parte del <strong>{{ $cliente }}</strong> cuyo objetivo será el suministro del servicio de agua potable,
    sobre las cláusulas siguientes, denominado en lo sucesivo como el USUARIO:
</p>

<h4>CLAUSULAS</h4>

<ol>
    <li>El servicio será exclusivo para el predio ubicado en <strong>{{ $domicilio }}</strong>. El USUARIO reconoce que no podrá permitir ni conceder derivaciones. El incumplimiento conllevará suspensión.</li>
    <li>El usuario se compromete a pagar la anualidad entre enero y marzo.</li>
    <li>La falta de pago motivará recargos y, en su caso, suspensión del servicio según el reglamento basado en el Art. 29 fracc. 11 inc. C de la ley estatal.</li>
    <li>Para cobro de adeudos, el comité se refiere al reglamento anteriormente mencionado.</li>
    <li>El USUARIO se obliga a colocar una llave de paso al frente de su domicilio.</li>
    <li>En caso de fuga de la red principal, el comité cubre. Si es del usuario, él cubre todo.</li>
    <li>El comité podrá suspender el servicio por reparaciones y notificará mediante carteles.</li>
    <li>En caso de venta o subdivisión, el usuario debe notificar. De lo contrario, será responsable solidario.</li>
    <li>Debe informar cualquier cambio de propietario en máximo 30 días.</li>
    <li>En caso de corte por adeudo, el usuario cubrirá localización y gastos.</li>
    <li>En caso de reconexión, el usuario pagará lo establecido en el reglamento.</li>
    <li>Si una toma no se usa, debe notificarse por escrito. Si no, se asume uso normal y se cobran anualidades.</li>
    <li>Lo no previsto se regirá por el reglamento del comité.</li>
</ol>

<p>
    No. DE CONTRATO: <strong>{{ $numero_contrato }}</strong><br>
    SAN LUCAS ATOYATENCO<br>
    Reposición<br>
    AGU<br>
</p>

<p><strong>SAN LUCAS ATOYATENCO, TEXMELUCAN, PUEBLA, A {{ $fecha_inicio }}</strong></p>

<div class="firma">
    <div>
        ___________________________________<br>
        NOMBRE Y FIRMA DEL USUARIO
    </div>

    <div>
        ___________________________________<br>
        NOMBRE Y FIRMA DEL COMITÉ
    </div>

    <p>AV. REFORMA ESQUINA CON EMILIANO ZAPATA S/N TEL. 248 187.07 77</p>
</div>

</body>
</html>
