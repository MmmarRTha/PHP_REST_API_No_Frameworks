<?php
include 'resources/partials/header.php';
?>

<div class="contenedor-barra">
    <h1 class="titulo h1">CRUD Rest API Fetch </h1>
</div>
<div class="bg-aqua contenedor sombra form">
    <form id="form" action="#">
        <legend>Alta de usuarios <span>Todos los datos son obligatorios</span>
        </legend>
        <!--        formulario-->
        <div class="fields">
            <div class="field">
                <label for="name">Nombre:</label>
                <input type="text" id="name" placeholder="Nombre">
            </div>
            <div class="field send">
                <input type="hidden" id="accion" value="create">
                <input type="submit" value="Agregar">
            </div>
    </form>
</div>
<!--contenedor resultados-->
<div class="bg-white contenedor sombra usuarios">
    <div class="contenedor-usuarios">
        <h2 class="h2">Usuarios</h2>

        <input type="text" id="buscar" class="buscador sombra" placeholder="Buscar Usuarios...">
        <p class="total-usuarios"><span></span> Usuarios</p>
        <div class="contenedor-tabla">
            <table class="listado-usuarios">
                <thead>
                <tr>
                    <th>ID:</th>
                    <th>Nombre:</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody id="contenido-tabla">

                </tbody>
            </table>
        </div>
    </div>
</div>
<?php include 'resources/partials/footer.php';


