-- Synapse Database Schema for TiDB Serverless
-- AI-powered neurodivergent productivity system
-- TiDB AgentX Hackathon 2025
-- Simplified schema without VECTOR columns (will be added later when TiDB supports them)

-- Drop tables if they exist (for clean re-creation)
DROP TABLE IF EXISTS brain_dump_sessions;
DROP TABLE IF EXISTS productivity_metrics;
DROP TABLE IF EXISTS project_relationships;
DROP TABLE IF EXISTS para_classifications;
DROP TABLE IF EXISTS gtd_actions;
DROP TABLE IF EXISTS kanban_cards;
DROP TABLE IF EXISTS agile_stories;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS projects; 
DROP TABLE IF EXISTS user_profiles;

-- Create user_profiles table
CREATE TABLE user_profiles (
    user_id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(320) NOT NULL UNIQUE,
    cognitive_type ENUM('ADHD', 'ASD', 'MIXED', 'NEUROTYPICAL') DEFAULT NULL,
    productivity_patterns JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create projects table  
CREATE TABLE projects (
    project_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT DEFAULT NULL,
    status ENUM('ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

-- Create tasks table
CREATE TABLE tasks (
    task_id VARCHAR(255) PRIMARY KEY,
    project_id VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT DEFAULT NULL,
    status ENUM('TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED') DEFAULT 'TODO',
    energy_required ENUM('LOW', 'MEDIUM', 'HIGH', 'HYPERFOCUS') DEFAULT NULL,
    hyperfocus_suitable BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

-- Create agile_stories table
CREATE TABLE agile_stories (
    story_id VARCHAR(255) PRIMARY KEY,
    task_id VARCHAR(255) NOT NULL,
    user_story TEXT NOT NULL,
    acceptance_criteria TEXT DEFAULT NULL,
    story_points INT DEFAULT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    sprint_id VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE
);

-- Create kanban_cards table
CREATE TABLE kanban_cards (
    card_id VARCHAR(255) PRIMARY KEY,
    task_id VARCHAR(255) NOT NULL,
    board_column ENUM('BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE') DEFAULT 'BACKLOG',
    wip_limit_count INT DEFAULT 0,
    blocked_reason TEXT DEFAULT NULL,
    card_color VARCHAR(7) DEFAULT NULL COMMENT 'Hex color code for visual categorization',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE
);

-- Create gtd_actions table
CREATE TABLE gtd_actions (
    action_id VARCHAR(255) PRIMARY KEY,
    task_id VARCHAR(255) NOT NULL,
    context VARCHAR(100) DEFAULT NULL COMMENT 'GTD context like @computer, @phone, @errands',
    next_action BOOLEAN DEFAULT FALSE,
    waiting_for TEXT DEFAULT NULL,
    someday_maybe BOOLEAN DEFAULT FALSE,
    review_date DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE
);

-- Create para_classifications table
CREATE TABLE para_classifications (
    classification_id VARCHAR(255) PRIMARY KEY,
    item_id VARCHAR(255) NOT NULL COMMENT 'Can reference projects.project_id or tasks.task_id',
    item_type ENUM('PROJECT', 'TASK') NOT NULL,
    para_category ENUM('PROJECT', 'AREA', 'RESOURCE', 'ARCHIVE') NOT NULL,
    area_of_responsibility VARCHAR(200) DEFAULT NULL,
    actionable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create brain_dump_sessions table
CREATE TABLE brain_dump_sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    original_input TEXT NOT NULL,
    energy_state ENUM('High', 'Medium', 'Low', 'Hyperfocus', 'Scattered') NOT NULL,
    processed_frameworks JSON DEFAULT NULL COMMENT 'AI-generated framework responses',
    created_projects JSON DEFAULT NULL COMMENT 'Array of project IDs created from this session',
    created_tasks JSON DEFAULT NULL COMMENT 'Array of task IDs created from this session',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

-- Create productivity_metrics table
CREATE TABLE productivity_metrics (
    metric_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    date_recorded DATE NOT NULL,
    energy_distribution JSON DEFAULT NULL COMMENT 'Distribution of energy states used',
    tasks_completed INT DEFAULT 0,
    tasks_created INT DEFAULT 0,
    hyperfocus_sessions INT DEFAULT 0,
    context_switches INT DEFAULT 0,
    framework_effectiveness JSON DEFAULT NULL COMMENT 'Effectiveness scores per framework',
    momentum_score DECIMAL(5,2) DEFAULT NULL COMMENT 'Cross-project momentum calculation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, date_recorded)
);

-- Create project_relationships table
CREATE TABLE project_relationships (
    relationship_id VARCHAR(255) PRIMARY KEY,
    source_project_id VARCHAR(255) NOT NULL,
    target_project_id VARCHAR(255) NOT NULL,
    relationship_type ENUM('DEPENDENT', 'RELATED', 'SIMILAR', 'BLOCKS') DEFAULT 'RELATED',
    relationship_strength DECIMAL(3,2) DEFAULT NULL COMMENT 'Strength of relationship 0.0-1.0',
    auto_discovered BOOLEAN DEFAULT FALSE COMMENT 'Was this relationship AI-discovered?',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (source_project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (target_project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_relationship (source_project_id, target_project_id, relationship_type)
);

-- Insert sample data for development and testing
INSERT INTO user_profiles (user_id, email, cognitive_type, productivity_patterns) VALUES 
('user-demo-001', 'demo@synapse.dev', 'ADHD', JSON_OBJECT(
    'peak_energy_times', JSON_ARRAY('09:00-11:00', '14:00-16:00'),
    'hyperfocus_triggers', JSON_ARRAY('code', 'research', 'writing'),
    'context_switch_tolerance', 'medium',
    'preferred_frameworks', JSON_ARRAY('kanban', 'gtd')
));

INSERT INTO projects (project_id, user_id, title, description, status) VALUES 
('proj-synapse-001', 'user-demo-001', 'Synapse Productivity System', 'AI-powered neurodivergent productivity system for TiDB AgentX Hackathon', 'ACTIVE');

INSERT INTO tasks (task_id, project_id, title, description, status, energy_required, hyperfocus_suitable) VALUES 
('task-brain-dump-001', 'proj-synapse-001', 'Implement Brain Dump Interface', 'Create React component for neurodivergent-friendly brain dumping', 'DONE', 'MEDIUM', true),
('task-tidb-conn-001', 'proj-synapse-001', 'Setup TiDB Connection', 'Configure MySQL connection with vector search capabilities', 'DONE', 'HIGH', true),
('task-db-schema-001', 'proj-synapse-001', 'Create Database Schema', 'Design tables for users, projects, tasks with vector embeddings', 'IN_PROGRESS', 'MEDIUM', true);

INSERT INTO agile_stories (story_id, task_id, user_story, story_points, priority) VALUES 
('story-001', 'task-brain-dump-001', 'As a neurodivergent user, I want to brain dump my scattered thoughts without structure pressure so that I can externalize my mental load', 5, 'HIGH');

INSERT INTO kanban_cards (card_id, task_id, board_column, card_color) VALUES 
('card-001', 'task-brain-dump-001', 'DONE', '#10b981'),
('card-002', 'task-tidb-conn-001', 'DONE', '#10b981'),
('card-003', 'task-db-schema-001', 'IN_PROGRESS', '#f59e0b');

INSERT INTO gtd_actions (action_id, task_id, context, next_action) VALUES 
('gtd-001', 'task-db-schema-001', '@computer', true);

INSERT INTO para_classifications (classification_id, item_id, item_type, para_category, actionable) VALUES 
('para-001', 'proj-synapse-001', 'PROJECT', 'PROJECT', true),
('para-002', 'task-brain-dump-001', 'TASK', 'ARCHIVE', false),
('para-003', 'task-db-schema-001', 'TASK', 'PROJECT', true);