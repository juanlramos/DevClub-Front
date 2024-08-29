import { FaTrash } from "react-icons/fa";
import api from "../../services/api";
import { useEffect, useState, useRef } from "react";

import './style.css'

function Home() {

  const [users, setUsers] = useState([])

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

          <button onClick={() => deleteUsers(user.id)}>
            <FaTrash />
          </button>
        </div>
      ))}
      

    </div>

  )
}

export default Home