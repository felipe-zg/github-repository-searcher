import type { RepositoryModel } from '@/domain/models'
import './RepositoryCard.css'

type RepositoryCardProps = {
  repository: RepositoryModel
}

export const RepositoryCard = ({ repository }: RepositoryCardProps) => {
  return (
    <article className="repository-card">
      <div className="repository-card__header">
        <img
          src={repository.owner.avatarUrl}
          alt={`${repository.owner.login}'s avatar`}
          className="repository-card__avatar"
        />

        <div className="repository-card__identity">
          <a
            href={repository.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="repository-card__title"
          >
            {repository.fullName}
          </a>

          <span className="repository-card__owner">
            by {repository.owner.login}
          </span>
        </div>
      </div>

      <p className="repository-card__description">
        {repository.description || '説明はありません。'}
      </p>

      <div className="repository-card__metadata">
        {repository.language && (
          <span className="repository-card__language">
            {repository.language}
          </span>
        )}

        <span>★ {repository.stargazersCount.toLocaleString()}</span>
        <span>⑂ {repository.forksCount.toLocaleString()}</span>
      </div>
    </article>
  )
}