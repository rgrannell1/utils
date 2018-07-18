
const octokit = require('@octokit/rest')()
const github = {}

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

module.exports = github
