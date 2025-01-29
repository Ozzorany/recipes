export interface Group {
    id: string;
    managerId: string;
    name: string;
    users: string[]
}

export interface UserMnagementGroups {
    managedGroups: Group[];
    sharedGroups: Group[]
}