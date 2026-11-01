import type { RepositoryModel } from '@/domain/models'
import { RepositoryCard } from '../RepositoryCard/RepositoryCard'
import './RepositoryList.css'

type RepositoryListProps = {
  repositories: RepositoryModel[]
}

export const RepositoryList = ({ repositories }: RepositoryListProps) => {
  return (
    <div className="repository-list">
      {repositories.map((repository) => (
        <RepositoryCard
          key={repository.id}
          repository={repository}
        />
      ))}
    </div>
  )
}