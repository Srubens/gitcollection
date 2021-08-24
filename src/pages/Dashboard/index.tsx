import React from 'react'
import { Title, Form, Repos, Error } from './styles'
import logo from '../../assets/svg/logo.svg'
import {FiChevronRight} from 'react-icons/fi'
import { api } from '../../services/api'
import { Link } from 'react-router-dom'

interface GithubRepository{
    full_name:string;
    description:string;
    owner:{
        login:string;
        avatar_url:string;
    }
}
const Dashboard:React.FC = () =>{

    const [repos, setRepos] = React.useState<GithubRepository[]>(() => {
        const storageRepos = localStorage.getItem('@GitColection:repositories')
        if(storageRepos){
            return JSON.parse(storageRepos)
        }
        return []
    } )
    const [newRepo, setNewRepo] = React.useState('')
    const [inputError, setInputError] = React.useState('')
    const formEl = React.useRef<HTMLFormElement | null>(null)

    React.useEffect(() =>{
        localStorage.setItem('@GitColection:repositories', JSON.stringify(repos))
    }, [repos])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>):void => {
        setNewRepo(event.target.value)
    }

    const handleAddRepo = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        
        // console.log(newRepo)
        if(!newRepo){
            setInputError('Informe o username/repositorio')
            // console.log(setInputError('Informe o username/repositorio'))
            return;
        }

        try{


            const response = await api.get<GithubRepository>(`repos/${newRepo}`)

            // console.log(response)
            const respository = response.data
        
            

            setRepos([...repos, respository]);
            formEl.current?.reset()
            setNewRepo('')
            setInputError('')

        }catch(err){
            setInputError('repositorio não encontrado, no github')
            return;
            console.log('erro', err)
        }

        
    }

    return(
        <>
            <img src={logo} alt="logo-git" />
            <Title>Catálogo de Repositórios do Github</Title>

            <Form ref={formEl} hasError={Boolean(inputError)} onSubmit={handleAddRepo} >
                <input type="text" placeholder="username/repository_name" onChange={handleInputChange} />
                <button type="submit" >Buscar</button>
            </Form>

            { 
            inputError && 
            <Error>
                {inputError}
            </Error> 
            }

            <Repos>
                { repos.map((repository,index) => (
                    <Link to={`/repositories/${repository.full_name}`} key={repository.full_name + index} >
                        <img src={repository.owner.avatar_url} alt={repository.owner.login} />
                        <div>
                            <b>{repository.full_name}</b>
                            <p>{repository.description}</p>
                        </div>
                            <FiChevronRight size={20} />
                    </Link>
                ) ) }
            </Repos>

        </>
    )
}

export default Dashboard