
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

github.createPR({
  owner: 'rgrannell1',
  repo: 'utils',
  branches: {
    head: 'test/pr-target-branch',
    base: 'master'
  },
  message: 'Bing Bong test PR'
})

module.exports = github
