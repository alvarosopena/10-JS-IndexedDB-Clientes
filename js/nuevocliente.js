(function(){
    let DB;
    const formulario = document.querySelector("#formulario");

    document.addEventListener("DOMContentLoaded", () => {
        conectarDB();

        formulario.addEventListener("submit", validarCliente);
    });

    function conectarDB(){
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function (){
            console.log("error db");
        };

        abrirConexion.onsuccess = function (){
            DB = abrirConexion.result;
            console.log("success db");
        };
    }

    function validarCliente(e){
        //Submit e
        e.preventDefault();
        

        //Leer inputs
        const nombre = document.querySelector("#nombre").value;
        const email = document.querySelector("#email").value;
        const telefono = document.querySelector("#telefono").value;
        const empresa = document.querySelector("#empresa").value;

        if( nombre === "" || email === "" || telefono === "" || empresa === "" ){
            imprimirAlerta("Todos los campos son obligatorios", "error");

            return;
        }

        //Crear un objeto con la info
        const cliente = {
            //Llave y valor, si es el mismo se puede dejar uno solo
            nombre,
            email,
            telefono,
            empresa
            
        }
        
        // le agrego el id al obj
        cliente.id = Date.now();
        console.log(cliente);

        crearNuevoCliente(cliente);
       
    }

    function crearNuevoCliente(cliente){
        const transaction = DB.transaction(['crm'], 'readwrite');

        const objectStore = transaction.objectStore('crm');

        objectStore.add(cliente);

        transaction.onerror = function () {
            imprimirAlerta("Hubo un error", "error");
        };

        transaction.oncomplete = function () {
          
            imprimirAlerta("Cliente agregado correctamente");

            setTimeout(() => {
                window.location.href = "index.html"
            }, 3000 );
        };
        
    }

    function imprimirAlerta(mensaje, tipo){
        //para q no se llene la pantalla de carteles, creamos un classlist alerta y lo seleccionamos en negativo
        const alerta = document.querySelector(".alerta");
        //si no hay alerta previa
        if(!alerta){
            // Crear alerta
            const divMsj = document.createElement("div");
            divMsj.classList.add("px-4", "py-3", "rounded", "max-w-lg", "mx-auto", "mt-6", "text-center", "border", "alerta");

            if(tipo === "error"){
                divMsj.classList.add("bg-red-100", "border-red", "text-red-700");
            } else {
                divMsj.classList.add("bg-green-100", "border-green", "text-green-700");
            }

            divMsj.textContent = mensaje;
            //agrego el divmsj abajo del form
            formulario.appendChild(divMsj);

            setTimeout(() =>{
               divMsj.remove();
            }, 3000 )
        }
    }
})();