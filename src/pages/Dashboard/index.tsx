import React, {useState, useEffect} from 'react'
import {FiChevronRight} from 'react-icons/fi'
import {Link} from 'react-router-dom'
import api from '../../services/api'

import logoImg from '../../assets/logo.svg'
import {Title, Form, Repositories} from './styles'

interface Repository {
   full_name: string;
   description: string;
   owner: {
        login: string;
        avatar_url: string;
   }
 
}

const Dashboard: React.FC = () => {
     const [newRepo, setNewRepo] = useState('')
     const [repositories, setRepositories] = useState<Repository[]>(() => {
          const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories')
          if(storagedRepositories){
               return JSON.parse(storagedRepositories)
          } else {
               return []
          }
     })

     useEffect(() => {
         localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories)) 
     },[repositories])

     async function handleAddRepository(event: any): Promise<void>{
          event.preventDefault()
          const response = await api.get<Repository>(`repos/${newRepo}`)

          const repository = response.data // pega o retorno da api

          setRepositories([...repositories, repository]) // pega tudo que já tme na lista e coloca a que acabou de pesquisa
          setNewRepo('')
     }

     return (
          <>
               <img src={logoImg} alt="Github Explorer"/>
               <Title>Explore repositórios no Github</Title>
               <Form onSubmit={handleAddRepository}>
                    <input value={newRepo} onChange={(e) => setNewRepo(e.target.value)} placeholder='Digite o nome do repositório'></input>
                    <button type="submit">Pesquisar</button>
               </Form>
               <Repositories>
                    {repositories.map(repository =>(
                         <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
                              <img src={repository.owner.avatar_url} alt={repository.owner.login}></img>
                              <div>
                                   <strong>{repository.full_name}</strong>
                                   <p>{repository.description}</p>
                              </div>
                              <FiChevronRight size={20}/>
                         </Link>
                    ))}

                 
               </Repositories>
          </>
     )
}

export default Dashboard