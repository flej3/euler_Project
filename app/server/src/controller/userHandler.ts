export const handleGitLabUser = async (accessToken: string, refreshToken: string) => {
    const response = await fetch('https://gitlab.synap.co.kr/api/v4/user', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const userProfile = await response.json();
    userProfile.accessToken = accessToken; // accessToken을 userProfile에 추가
    userProfile.refreshToken = refreshToken;

    const starredProjectsResponse2 = await fetch(`https://gitlab.synap.co.kr/api/v4/projects?starred=true`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!starredProjectsResponse2.ok) {
        throw new Error('즐겨찾기 프로젝트 조회 실패');
    }

    const likeProject = await starredProjectsResponse2.json();
    console.log('즐겨찾기한 프로젝트:', likeProject);

    userProfile.starredProjects = likeProject; // 즐겨찾기 프로젝트 추가
    return userProfile;
};
