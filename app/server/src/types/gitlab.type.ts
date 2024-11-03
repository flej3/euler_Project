export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    access_token_oauth?: string;
    refresh_token_oauth?: string;
    // state: string; // 'active', 'inactive' 등 상태를 정의하는 타입을 사용할 수 있음
    // avatar_url: string;
    // web_url: string;
    // created_at: string; // ISO 8601 포맷을 따르므로 string으로 정의
    // bio: string;
    // location: string;
    // skype: string;
    // linkedin: string;
    // twitter: string;
    // website_url: string;
    // organization: string;
    // last_sign_in_at: string; // ISO 8601 포맷
    // confirmed_at: string; // ISO 8601 포맷
    // last_activity_on: string; // 날짜 포맷
    // theme_id: number;
    // color_scheme_id: number;
    // projects_limit: number;
    // current_sign_in_at: string; // ISO 8601 포맷
    // identities: Array<any>; // 구체적인 구조가 불명확하므로 any로 설정
    // can_create_group: boolean;
    // can_create_project: boolean;
    // two_factor_enabled: boolean;
    // external: boolean;
}
