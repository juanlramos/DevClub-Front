import { FaTrash, FaPencilAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import api from "../../services/api";
import { useEffect, useState } from "react";
import Modal from 'react-modal';

import './style.css'

function Home() {

  const [users, setUsers] = useState([])
  const [user, setUser] = useState({ name: '', age: '', email: '' });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [modalEdit, setModalEdit] = useState(false)

  async function getUsers(){
    const usersFromApi = await api.get('/usuarios')

    setUsers(usersFromApi.data)
  }

  async function createUsers(){
    await api.post('/usuarios', {
      name: user.name,
      age: user.age,
      email: user.email,
    })

    location.reload()
  }

  async function deleteUsers(id){
    await api.delete(`/usuarios/${id}`)

    location.reload()
  }

    function openModal(id){
      setUserIdToDelete(id);
      setModalIsOpen(true);
  };

    function closeModal(){
      setModalIsOpen(false);
      setUserIdToDelete(null);
  };

    function confirmDelete(){
      if (userIdToDelete !== null) {
        deleteUsers(userIdToDelete);
      }
      closeModal();
  };

  async function editUser(id){
    await api.put(`/usuarios/${id}`, user)

    location.reload()
  }

  function openEditModal(user){
    setUser(user)
    setModalEdit(true)
  }

  function closeEditModal(){
    setModalEdit(false)
    setUser({ name: '', age: '', email: '' })
  }

  useEffect(() => {
    getUsers()
  }, [])
  

  return (

    <div className='container'>
      <form className="form">
          <h1>Cadastro de Usuarios</h1>
          <input type="text" name='nome' placeholder="Nome" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })}/>
          <input type="number" name='idade' placeholder="Idade" value={user.age} onChange={(e) => setUser({...user, age: e.target.value})}/>
          <input type="email" name='email' placeholder="Email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})}/>
          <button type='button' onClick={createUsers}>Cadastrar</button>
      </form>

      {users.map((user) => (
        <div key={user.id} className="card">
          <div>
            <p>Nome:  <span> {user.name} </span>  </p>
            <p>Idade: <span> {user.age} </span>   </p>
            <p>Email: <span> {user.email} </span> </p>
          </div>

          <div className="cardButton">
            <button className="edit" onClick={() => openEditModal(user)}>
              <FaPencilAlt />
            </button>
            
            <button className="delete" onClick={() => openModal(user.id)}>
              <FaTrash />
            </button>
          </div>
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

      <Modal
        isOpen={modalEdit}
        onRequestClose={closeEditModal}
        contentLabel="Edição de usuario"
        className='editModalBackground'
      >
        <div className="modalEdit">
          <div className="titulo">
              <h2>Edição de Usuario</h2>
              <button onClick={closeEditModal}><IoMdClose /></button>
            </div>
          <input type="text" name='nome' placeholder="Nome" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value})}/> 
          <input type="number" name='idade' placeholder="Idade" value={user.age} onChange={(e) => setUser({...user, age: e.target.value})}/>
          <input type="email" name='email' placeholder="Email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})}/>
          <button type='button' onClick={() => {editUser(user.id)}}>Editar</button>
        </div>
        
      </Modal>

    </div>

  )
}

export default Home