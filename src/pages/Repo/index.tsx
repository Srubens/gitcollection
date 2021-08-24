import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { Header, RepoInfo, Issues } from './styles'
import logo from '../../assets/svg/logo.svg'
import {FiChevronLeft, FiChevronRight} from 'react-icons/fi'

import { api } from '../../services/api'

interface RepositoryParams {
    repository:string
}

interface GithubRepository{
    full_name:string;
    description:string;
    forks_count:number;
    open_issues_count:number;
    stargazers_count:number;
    owner:{
        login:string;
        avatar_url:string;
    }
}

interface GithubIssue{
    id:number;
    title:string;
    html_url:string;
    user:{
        login:string;
    }
}

const Repo:React.FC = () =>{

    const [repository, setRepository] = React.useState<GithubRepository | null>(null)
    const [issues, setIssues] = React.useState<GithubIssue[]>([])

    const { params } = useRouteMatch<RepositoryParams>()

    React.useEffect(() =>{

        api.get(`repos/${params.repository}`).then(response => {
            setRepository(response.data)
            console.log(response.data)
        })
        api.get(`repos/${params.repository}/issues`).then(response => {
            console.log(response.data)
            setIssues(response.data)
        })

    }, [params.repository])

    return (
        <>
         <Header>
             <img src={logo} alt="gitcollection" />
             <Link to="/" > <FiChevronLeft /> Voltar</Link>
         </Header>
         
         {repository && (

            <RepoInfo>
            <header>
                <img src={repository.owner.avatar_url} title={repository.owner.login} alt={repository.owner.login} />
                <div>
                    <b>{repository.full_name}</b>
                    <p>
                        {repository.description}
                    </p>
                </div>
            </header>
            <ul>
                <li>
                    <b>{repository.stargazers_count}</b>
                    <span>stars</span>
                </li>
                <li>
                    <b>{repository.forks_count}</b>
                    <span>forks</span>
                </li>
                <li>
                    <b>{repository.open_issues_count}</b>
                    <span>issues abertos</span>
                </li>
            </ul>
         </RepoInfo>

         )}

         <Issues>
             { issues.map(issue => (
                 <a href={issue.html_url} key={issue.id} >
                    <div>
                        <b>{issue.title}</b>
                        <p>
                            {issue.user.login}
                        </p>
                    </div>
                    <FiChevronRight />
                </a>
             )) }
         </Issues>
        </>
    )
}

export default Repo