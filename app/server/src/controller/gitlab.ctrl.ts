export const getStarredProjects = async (accessToken: string) => {
    try {
        const response = await fetch(`https://gitlab.synap.co.kr/api/v4/projects?starred=true`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch starred projects: ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error('Error fetching starred projects:', err);
        throw new Error('Failed to fetch starred projects');
    }
};

export const getMergeRequests = async (projectId: number, accessToken: string) => {
    try {
        const response = await fetch(`https://gitlab.synap.co.kr/api/v4/projects/${projectId}/merge_requests?state=opened`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch MRs for project ${projectId}: ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error(`Error fetching MRs for project ${projectId}:`, err);
        throw new Error('Failed to fetch merge requests');
    }
};

export const getStarredProjectsMRs = async (accessToken: string) => {
    try {
        const starredProjects = await getStarredProjects(accessToken);

        const mrList = await Promise.all(
            starredProjects.map(async (project: any) => {
                const mergeRequests = await getMergeRequests(project.id, accessToken);
                return {
                    projectId: project.id,
                    projectName: project.name,
                    mergeRequests: mergeRequests
                };
            })
        );

        return mrList;
    } catch (err) {
        console.error('Error fetching merge requests for starred projects:', err);
        throw new Error('Failed to fetch merge requests for starred projects');
    }
};
