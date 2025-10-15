import { Octokit } from '@octokit/rest'

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function setupGitHub() {
  try {
    const octokit = await getUncachableGitHubClient();
    
    // Get authenticated user
    const { data: user } = await octokit.rest.users.getAuthenticated();
    console.log(`Authenticated as: ${user.login}`);
    
    // Create a new repository
    const repoName = 'techersgpt-support-platform';
    console.log(`Creating repository: ${repoName}...`);
    
    const { data: repo } = await octokit.rest.repos.createForAuthenticatedUser({
      name: repoName,
      description: 'TechersGPT - AI-Powered Technical Support Chat Application',
      private: false,
      auto_init: false
    });
    
    console.log(`Repository created successfully!`);
    console.log(`Repository URL: ${repo.html_url}`);
    console.log(`Git URL: ${repo.clone_url}`);
    
    return {
      username: user.login,
      repoUrl: repo.clone_url,
      htmlUrl: repo.html_url
    };
  } catch (error: any) {
    if (error.status === 422 && error.message.includes('already exists')) {
      console.log('Repository already exists. Using existing repository...');
      const octokit = await getUncachableGitHubClient();
      const { data: user } = await octokit.rest.users.getAuthenticated();
      const repoName = 'techersgpt-support-platform';
      const { data: repo } = await octokit.rest.repos.get({
        owner: user.login,
        repo: repoName
      });
      return {
        username: user.login,
        repoUrl: repo.clone_url,
        htmlUrl: repo.html_url
      };
    }
    throw error;
  }
}

setupGitHub()
  .then(result => {
    console.log('\n=== GitHub Setup Complete ===');
    console.log(`Username: ${result.username}`);
    console.log(`Repository URL: ${result.htmlUrl}`);
    console.log(`\nNext steps:`);
    console.log(`1. Add remote: git remote add origin ${result.repoUrl}`);
    console.log(`2. Push code: git push -u origin main`);
  })
  .catch(error => {
    console.error('Error setting up GitHub:', error.message);
    process.exit(1);
  });
