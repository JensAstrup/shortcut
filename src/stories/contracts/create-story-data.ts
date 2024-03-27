export default interface CreateStoryData {
    name: string; // Required
    archived?: boolean;
    comments?: [];
    completed_at_override?: Date;
    created_at?: Date;
    custom_fields?: [];
    deadline?: Date | null;
    description?: string;
    epic_id?: number | null;
    estimate?: number | null;
    external_id?: string;
    external_links?: string[];
    file_ids?: number[];
    follower_ids?: string[]; // Assuming UUIDs are represented as strings
    group_id?: string | null; // Assuming UUIDs are represented as strings
    iteration_id?: number | null;
    labels?: [];
    linked_file_ids?: number[];
    move_to?: 'first' | 'last';
    owner_ids?: string[]; // Assuming UUIDs are represented as strings
    project_id?: number | null;
    requested_by_id?: string; // Assuming UUIDs are represented as strings
    started_at_override?: Date;
    story_links?: [];
    story_template_id?: string | null; // Assuming UUIDs are represented as strings
    story_type?: 'bug' | 'chore' | 'feature';
    tasks?: [];
    updated_at?: Date;
    workflow_state_id?: number;
}
