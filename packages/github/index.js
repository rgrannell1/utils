
const octokit = require('@octokit/rest')()
const github = {}

/**
 * Get a GitHub project by name
 *
 * @param  {string} options.owner    the repository owner
 * @param  {string} options.repo     the repository name
 * @param  {[type]} options.name     the name of the project
 * @param  {string} options.token    the Github token. Optional.
 *
 * @return {Promise}                 A result promise
 */
github.getProject = async ({owner, repo, name, token}) => {
  octokit.authenticate({
    type: 'token',
    token: token || process.env.GITHUB_TOKEN
  })

  const projects = await octokit.projects.getRepoProjects({owner, repo})

  return projects.data.find(project => {
    return project.name === name
  })
}

/**
 * Create a Github pull-request
 *
 * @param  {string} options.owner    the repository owner
 * @param  {string} options.repo     the repository name
 * @param  {object} options.branches an object of branch names:
 *   - head the feature branch name
 *   - base the base branch name
 * @param  {string} options.message  the PR message
 * @param  {string} options.token    the Github token. Optional.
 *
 * @return {Promise}                 A result promise
 */
github.createPR = async ({owner, repo, branches, message, token}) => {
  octokit.authenticate({
    type: 'token',
    token: token || process.env.GITHUB_TOKEN
  })

  const {head, base} = branches

  return octokit.pullRequests.create({
    owner,
    repo,
    title: head[0].toUpperCase() + head.slice(1),
    head,
    base,
    body: message,
    maintainer_can_modify: true
  })
}

module.exports = github
