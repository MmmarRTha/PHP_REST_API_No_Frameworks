const contenidoTabla = document.querySelector('#contenido-tabla'),
      //totalU = document.querySelector('#total-usuarios'),
      createForm = document.querySelector('#createForm'),
      modal = document.querySelector('#my-modal'),
      modalEditBtn = document.querySelector('#modalEditBtn'),
      inputBuscador = document.querySelector('#buscar');
let   output = '';

eventListener();
function eventListener()
{
    createForm.addEventListener('submit', postForm);
    modalEditBtn.addEventListener('click', openModal);
    //buscador
    inputBuscador.addEventListener('input', buscarUsuarios);
}

//Read all
const renderUsers = (users) => {
    users.forEach(user => {
        output += `
            <tr>
            <td>${user.id}</td>
            <td id="get-name">${user.name}</td>
            <td id="get-name">${user.lastName}</td>
            <td>
                <a id="modalEditBtn" class="btn-editar btn" onclick="update(${user.id})"><span class="las la-edit"></span></a>
                <a href="#" data-id="${user.id}" class="btn-borrar btn" id="delete-user"> <span class="las la-trash"></span></a>
            </td>
            </tr>
            `;
    });
    contenidoTabla.innerHTML = output;
}

//Get - Read users from db on a table
//Method: GET
fetch('app/api/user/read.php')
    .then(response => response.json())
    .then(datos => {
        renderUsers(datos);
        console.log('success', datos);
        numeroUsuarios();
    }).catch(error =>{
        console.log('error', error);
        mostrarNotificacion('Hubo un error al mostrar la tabla de usuarios!', 'error');
    })

//Delete
//Method: DELETE
contenidoTabla.addEventListener('click', (e) =>
{
    e.preventDefault();
    if(e.target.parentElement.classList.contains('btn-borrar')) {
        //tomamos el ID
        const id = e.target.parentElement.getAttribute('data-id');
        //preguntar al usuario
        const respuesta = confirm('Estas seguro (a) que deseas eliminar el usuario ?');
        if (respuesta) {
            const url = 'app/api/user/delete.php';
            fetch(`${url}/?id=${id}`, {
                method: 'DELETE',
            })
                .then(res => res.json())
                .then(datos => {
                    console.log('success', datos);
                    numeroUsuarios();
                    e.target.parentElement.parentElement.parentElement.remove();
                    mostrarNotificacion('Usuario eliminado!', 'correcto');
                }).catch(error => {
                console.log('error', error);
                mostrarNotificacion('Hubo un error al eliminar el usuario!', 'error');
            })
        }
    }
})

//Create
//Method: POST
function postForm(e)
{
    e.preventDefault();
    const dataForm = new FormData(createForm);
    let nombre = dataForm.get('name');
    let apellido = dataForm.get('lastName');

    if( nombre === '' || apellido === '') {
        //dos parametros: texto y clase
        mostrarNotificacion('Todos los Campos son Obligatorios!', 'error');
    } else {
        fetch('app/api/user/create.php', {
            method: 'POST',
            body: dataForm
        })
            .then(data => data.json())
            .then(datos => {
                console.log('success', datos);
                mostrarNotificacion('Usuario creado correctamente!', 'correcto');
                numeroUsuarios();
                createForm.reset();
            }).catch(error => {
            console.log('error', error);
            mostrarNotificacion('Hubo un error al crear el usuario!', 'error');
        })
    }
}

//Read single
const update = (id) => {
    alert(id);
    const url = 'app/api/user/read_single.php';
    const formData = new FormData();
    formData.append('id', id);
    fetch(url, {
        method: 'POST',
        body: formData
    })
        .then(data => data.json())
        .then(data => {
            console.log('success', data);
            openModal(data);
        })
        .catch(error => {
            console.log('error', error);
        });
}
//update user
function openModal(data){
    modal.style.display = 'block';
    const idUpdate = data.id;
    const pintarNombre = document.querySelector('.pintarNombre');
    pintarNombre.innerHTML = `
    <div class="field">
        <input type="number" value="${data.id}" hidden="true">
        <label for="name">Nombre:</label>
        <input type="text" name="name" placeholder="Nombre" value="${data.name}">
    </div>
     <div class="field">
        <label for="lastName">Apellido:</label>
        <input type="text" id="lastName" name="lastName" value="${data.lastName}">
    </div>
    <div class="field send">
        <input id="send-update" data-id="${data.id}" type="submit" value="Editar">
    </div>
    `;

    pintarNombre.addEventListener('click', (e) =>{
        e.preventDefault();
        let sendUpdateBtn = e.target.id === 'send-update';
        if(sendUpdateBtn) {
            const updateForm = document.querySelector('#updateForm');
            const dataForm = new FormData(updateForm);
            dataForm.append('id', idUpdate);
            let newName = dataForm.get('name');
            let newlastName = dataForm.get('lastName');
            let idUser = dataForm.get('id');
            if(newName === ''){
                mostrarNotificacion('Todos los Campos son Obligatorios!', 'error');
            } else {
                const url = 'app/api/user/update.php';
                const urlId = `${url}/?id=${idUpdate}`;
                fetch(`${urlId}`, {
                    method: 'POST',
                    body: dataForm
                })
                    .then(newData => newData.json())
                    .then(newData => {
                        console.log('success', newData);
                        mostrarNotificacion('Usuario editado correctamente!', 'correcto');
                        setTimeout(() => {
                            window.location.href = 'index.php';
                        }, 4000);
                    })
                    .catch(error => {
                        console.log('error', error);
                        mostrarNotificacion('Hubo un error al editar el usuario!', 'error');
                    });
            }
        }
    })
}


function numeroUsuarios(){
    const totalUsuarios = document.querySelectorAll('tbody tr');
    contenedorNumero = document.querySelector('.total-usuarios span')
    let total = 0;
    totalUsuarios.forEach(usuario => {
        if(usuario.style.display === '' || usuario.style.display === 'table-row'){
            total++
        }
    })

    console.log(total);
    contenedorNumero.textContent = total;
}
//notificacion en pantalla
function mostrarNotificacion(mensaje, clase) {
    const notificacion = document.createElement('div');
    notificacion.classList.add(clase, 'notificacion', 'sombra');
    notificacion.textContent = mensaje;
    //formulario
    createForm.insertBefore(notificacion, document.querySelector('form legend'));
    //ocultar y mostrar la notifiacion
    setTimeout(() => {
        notificacion.classList.add('visible');
        setTimeout(() => {
            notificacion.classList.remove('visible');
            setTimeout(() => {
                notificacion.remove();
            }, 500);
        }, 3000);
    }, 100);
}
//busca registros
function buscarUsuarios(datos) {
    registros = datos;
    //console.log(registros);

}

