// GitLab 프로젝트의 인터페이스 정의
export interface Project {
    id: number;          // 프로젝트 ID
    name: string;       // 프로젝트 이름
    // 필요한 다른 속성 추가
}

export interface User {
    id: string; // 사용자 ID
    name: string; // 사용자 이름 등 필요한 속성 추가
    // 다른 속성들...
}