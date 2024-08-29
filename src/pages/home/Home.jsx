import { FaTrash } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import api from "../../services/api";
import { useEffect, useState, useRef } from "react";
import Modal from 'react-modal';

import './style.css'

Modal.setAppElement('#root'); // Necessário para acessibilidade

function Home() {

  const [users, setUsers] = useState([])
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()

  async function getUsers(){
    const usersFromApi = await api.get('/usuarios')

    setUsers(usersFromApi.data)
  }

  async function createUsers(){
    await api.post('/usuarios', {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value
    })

    location.reload()
  }

  async function deleteUsers(id){
    await api.delete(`/usuarios/${id}`)

    location.reload()
  }

  const openModal = (id) => {
    setUserIdToDelete(id);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setUserIdToDelete(null);
  };

  const confirmDelete = () => {
    if (userIdToDelete !== null) {
      deleteUsers(userIdToDelete);
    }
    closeModal();
  };

  useEffect(() => {
    getUsers()
  }, [])
  

  return (

    <div className='container'>
      <form>
          <h1>Cadastro de Usuarios</h1>
          <input type="text" name='nome' placeholder="Nome" ref={inputName}/>
          <input type="number" name='idade' placeholder="Idade" ref={inputAge}/>
          <input type="email" name='email' placeholder="Email" ref={inputEmail}/>
          <button type='button' onClick={createUsers}>Cadastrar</button>
      </form>

      {users.map((user) => (
        <div key={user.id} className="card">
          <div>
            <p>Nome:  <span> {user.name} </span>  </p>
            <p>Idade: <span> {user.age} </span>   </p>
            <p>Email: <span> {user.email} </span> </p>
          </div>

          <button onClick={() => openModal(user.id)}>
            <FaTrash />
          </button>
        </div>
      ))}
      
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirmar Exclusão"
        className='background'
      >
        <div className="modal">
          <div className="titulo">
            <h2>Confirmar Exclusão</h2>
            <button onClick={closeModal}><IoMdClose /></button>
          </div>
          <p>Tem certeza de que deseja excluir este usuário?</p>
          <div className="botoes">
            <button className="confirm" onClick={confirmDelete}>Confirmar</button>
            <button className="cancel" onClick={closeModal}>Cancelar</button>
          </div>
        </div>
      </Modal>

    </div>

  )
}

export default Home