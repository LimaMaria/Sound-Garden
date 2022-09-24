const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('id');
const BASE_URL = "https://xp41-soundgarden-api.herokuapp.com";


// *********************************************************************************************************  Get Todos os eventos

async function getEvents() {
    const listaDeEventos = document.querySelector("#listaDeEventos");
    try {
        const response = await fetch(`${BASE_URL}/events/`);
        const data = await response.json();
        data.forEach((element) => {
            const eventItem = `<article class="evento card p-5 m-3" data-id=${element._id} data-ticket=${element.number_tickets}>
            <h2>${element.name} - ${element.scheduled.slice(0,10)}</h2>
            <h4>${element.attractions}</h4>
            <p>${element.description}</p>
            <button href="reservar-ingresso.html?id=${element._id}" type="button" class="btn btn-primary view_data" data-bs-toggle="modal" data-bs-target="#addUsuarioModal" id="reserva-ingresso">
            reservar ingresso
          </button>
            </article>`;
            listaDeEventos.innerHTML += eventItem;
        });
    } catch (error) {
        console.log(error);
    }
}

// *********************************************************************************************************** Get eventos Principais

async function getEventsHome() {
    const listaDeEventos = document.querySelector("#listaDeEventos");
    var nome = [];
    var dataEvento = [];
    var attractions = [];
    var description = [];
    var id = [];
    try {
        const response = await fetch(`${BASE_URL}/events/`);
        const data = await response.json();
        data.forEach((element) => {
            nome.push(element.name);
            dataEvento.push(element.scheduled.slice(0,10));
            attractions.push(element.attractions);
            description.push(element.description);
            id.push(element._id);
        });
    } catch (error) {
        console.log(error);
    }
    for(i=0;i<3;i++){
        const eventItem = `<article class="evento card p-5 m-3" data-id=${id[i]}>
            <h2>${nome[i]} - ${dataEvento[i]}</h2>
            <h4>${attractions[i]}</h4>
            <p>${description[i]}</p>
            <button href="reservar-ingresso.html?id=${id[i]}" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addUsuarioModal" id="reserva-ingresso">
            reservar ingresso
          </button>
            </article>`;
            listaDeEventos.innerHTML += eventItem;
    }
}
// ************************************************************************************************************* Get eventos Admin

async function getEventsAdmin() {
    const eventosAdmin = document.querySelector("#eventosAdmin");
    try {
        const response = await fetch(`${BASE_URL}/events/`);
        const data = await response.json();
        data.forEach((element, index) => {
            const eventItem = `<tr>
            <th scope="row">${index + 1 }</th>
            <td>${element.scheduled.slice(0,10)} ${element.scheduled.slice(11,16)}</td>
            <td>${element.name}</td>
            <td>${element.attractions}</td>
            <td>
                <a href="./reservar-ingresso.html?id=${element._id}" class="btn btn-dark">ver reservas</a>
                <a href="./editar-evento.html?id=${element._id}" class="btn btn-secondary">editar</a>
                <a href="./excluir-evento.html?id=${element._id}" class="btn btn-danger">excluir</a>
            </td>
        </tr>`;
            eventosAdmin.innerHTML += eventItem;
        });
    } catch (error) {
        console.log(error);
    }
}
// *************************************************************************************************************** Form adicionando eventos

async function eventData() {
    try {
        const response = await fetch(`${BASE_URL}/events/`);
        const data = await response.json();
        data.forEach((element) => {
            if(element._id == myParam){
                document.querySelector("#nome").value = element.name;
                document.querySelector("#banner").value = element.poster;
                document.querySelector("#atracoes").value = element.attractions;
                document.querySelector("#descricao").value = element.description;
                document.querySelector("#data").value = element.scheduled.slice(0,10) +" "+ element.scheduled.slice(11,16);
                document.querySelector("#lotacao").value = element.number_tickets;
            }
        });
    } catch (error) {
        console.log(error);
    }
}
// ***********************************************************************************************************************  Deletando eventos

function deleteEventButton() {
    event.preventDefault();
      fetch(`${BASE_URL}/events/${myParam}`,{
        method: 'DELETE'
      })
        .then(response => {if (!response.ok) {
            alert("Falha ao excluir evento!!!");
            throw new Error('Erro ao excluir evento!!!');
          }
          return alert("Evento excluido com sucesso!!!");
        })
        .then(result => console.log(result))
        .then(()=> location.reload())
        .catch(error => console.log('error', error));
        
}

// ************************************************************************************************************************* Editando Eventos

function editEventButton() {
    var raw = {
        "name": document.querySelector("#nome").value,
        "poster": document.querySelector("#banner").value,
        "attractions": [
            document.querySelector("#atracoes").value,
        ],
        "description": document.querySelector("#descricao").value,
        "scheduled": document.querySelector("#data").value,
        "number_tickets": document.querySelector("#lotacao").value,
    }
      fetch(`${BASE_URL}/events/${myParam}`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
          },
        body: JSON.stringify(raw)
      })
        .then(response => {if (!response.ok) {
            alert("Falha ao atualizar evento!!!");
            throw new Error('Erro ao atualizar evento!!!');
          }
          return alert("Evento atualizado com sucesso!!!");
        })
        .then(result => console.log(result))
        .then(()=> location.reload())
        .catch(error => console.log('error', error));
        event.preventDefault();
}

// ************************************************************************************************************************ Evento Button
function createEventButton() {
    var raw = {
        "name": document.querySelector("#nome").value,
        "poster": document.querySelector("#banner").value,
        "attractions": [
            document.querySelector("#atracoes").value,
        ],
        "description": document.querySelector("#descricao").value,
        "scheduled": document.querySelector("#data").value,
        "number_tickets": document.querySelector("#lotacao").value,
    }
      fetch(`${BASE_URL}/events/`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
          },
        body: JSON.stringify(raw)
      })
        .then(response => {if (!response.ok) {
            alert("Falha ao cadastrar evento!!!");
            throw new Error('Erro ao cadastrar evento!!!');
          }
          return alert("Evento cadastrado com sucesso!!!");
        })
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
        event.preventDefault();
}

//*********************************************************************************************************************** Get reservas de Ingresso

async function getReservasAdmin() {
    const reservaIngresso = document.querySelector("#reservaIngresso");
    try {
        const response = await fetch(`${BASE_URL}/bookings/event/${myParam}`);
        const data = await response.json();
        //console.log(data)
        data.forEach((element, index) => {
            const eventItem = `
            <tr>
            <th scope="row">${index + 1 }</th>
            <td>${element.owner_name}</td>
            <td>${element.owner_email}</td>
            <td>${element.number_tickets}</td>
            <td>
            </td>
        </tr>`;
        reservaIngresso.innerHTML += eventItem;
        });
    } catch (error) {
        console.log(error);
    }
}




//********************************************************************************************************** Post reserva ingressos
function createEventReservaButton() {
    let raw = {
        "owner_name": document.querySelector("#nome-form-modal").value,
        "owner_email": document.querySelector("#email-form-modal").value,
        "number_tickets": 1,
        "event_id": id,
        
    }
    
      fetch(`${BASE_URL}/bookings/`, {
          method: 'POST',
          headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify(raw)
        })
        .then(response => {if (!response.ok) {
            alert("Falha ao cadastrar evento!!!");
            throw new Error('Erro ao cadastrar evento!!!!');
        }
        return alert("Evento cadastrado com sucesso!!!");
    })
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
    event.preventDefault();
}

//Puxando Id do elemento pai p/ form modal
var listaDeEventos = document.getElementById("listaDeEventos");
var id = ""
var tickets = ""
listaDeEventos.addEventListener('click',(e)=>{
    e.preventDefault()
   // console.log(e.target.id)
    let btnReservEvent = e.target.id == "reserva-ingresso"
     id = e.target.parentElement.dataset.id
    //  let idTicket = e.target.id == "reserva-ingresso"
    // let tic = e.target
    //console.log(e.target.parentElement.dataset.id)
})

