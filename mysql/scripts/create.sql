-- Drop tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS program_requirements;
DROP TABLE IF EXISTS programs;
DROP TABLE IF EXISTS courses;

-- Create tables
CREATE TABLE courses (
    course_id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    credits VARCHAR(5) NOT NULL  -- Using VARCHAR to handle "3-6" format
);

CREATE TABLE programs (
    program_id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('DEGREE', 'CONCENTRATION', 'CERTIFICATE')),
    parent_program_id VARCHAR(100),
    FOREIGN KEY (parent_program_id) REFERENCES programs(program_id)
);

CREATE TABLE program_requirements (
    program_id VARCHAR(100),
    course_id VARCHAR(10),
    requirement_type VARCHAR(20) NOT NULL,
    FOREIGN KEY (program_id) REFERENCES programs(program_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    PRIMARY KEY (program_id, course_id)
);

-- Insert courses
INSERT IGNORE INTO courses (course_id, title, credits) VALUES
('EM 600', 'Engineering Economics and Cost Analysis', '3'),
('EM 605', 'Elements of Operations Research', '3'),
('EM 612', 'Project Management of Complex Systems', '3'),
('EM 622', 'Decision Making via Data Analysis Techniques', '3'),
('EM 623', 'Data Science and Knowledge Discovery / Applied AI & ML for Systems and Enterprises', '3'),
('EM 624', 'Data Exploration and Informatics for Engineering Management', '3'),
('EM 626', 'Data Science and Knowledge Discovery / Applied AI & ML for Systems and Enterprises', '3'),
('EM 633', 'Decision Sciences in Healthcare / Forecasting & Demand Modeling Systems', '3'),
('EM 680', 'Project Mgmt of Complex Systems / Designing & Managing the Development Enterprise', '3'),
('SSW 540', 'Fundamentals of Software Engineering', '3'),
('SSW 555', 'Agile Methods for Software Development', '3'),
('SSW 564', 'Software Requirements Analysis and Engineering', '3'),
('SSW 565', 'Software Architecture and Component-Based Design', '3'),
('SSW 567', 'Software Testing, QA, and Maintenance', '3'),
('SSW 590', 'Software Architecture, Testing, and DevOps', '9'),
('SSW 695', 'Software Engineering Capstone Studio', '3'),
('SYS 605', 'Mission & System Design Verification / Systems Integration', '3'),
('SYS 611', 'Systems Modeling & Simulation', '3'),
('SYS 625', 'Fundamentals of Systems Engineering / Conception of CPS', '3'),
('SYS 632', 'Designing Space Missions & Systems / Human Spaceflight', '9'),
('SYS 633', 'Mission & System Design Verification / Systems Integration', '9'),
('SYS 635', 'Designing Space Missions & Systems / Human Spaceflight', '9'),
('SYS 637', 'Cost-Effective Space Mission Operations', '3'),
('SYS 640', 'System Supportability & Logistics / Design for Reliability', '3'),
('SYS 645', 'System Supportability & Logistics / Design for Reliability', '3'),
('SYS 650', 'System Architecture and Design', '3'),
('SYS 660', 'Decision and Risk Analysis', '3'),
('SYS 670', 'Decision Sciences in Healthcare / Forecasting & Demand Modeling Systems', '3'),
('SYS 671', 'Fundamentals of Systems Engineering / Conception of CPS', '3'),
('SYS 672', 'Design, Implementation, Sustainment of CPS', '9'),
('SYS 673', 'Design, Implementation, Sustainment of CPS', '9'),
('SYS 674', 'Design, Implementation, Sustainment of CPS', '9'),
('SYS 681', 'Systems Modeling & Simulation / Dynamic Modeling of Systems & Enterprise', '3'),
('SYS 682', 'Multi-Agent Socio-Technical Systems / Systems Modeling & Simulation', '3'),
('SYS 800', 'Special Problems / Thesis in Systems Engineering', '3-6'),
('SYS 900', 'Special Problems / Thesis in Systems Engineering', '3-6');

-- Insert Programs (Degrees first)
INSERT INTO programs (program_id, name, type) VALUES
('MSYS_ANALYTICS', 'M.Eng. Systems Analytics', 'DEGREE'),
('MENG_MGMT', 'M.Eng. Engineering Management', 'DEGREE'),
('MS_SWEN', 'M.S. Software Engineering', 'DEGREE'),
('MENG_SPACE', 'M.Eng. Space Systems Engineering', 'DEGREE'),
('MENG_SYS', 'M.Eng. Systems Engineering', 'DEGREE');

-- Insert Concentrations (with parent degree references)
INSERT INTO programs (program_id, name, type, parent_program_id) VALUES
('CONC_LCPS', 'Large-Scale CPS', 'CONCENTRATION', 'MENG_SYS'),
('CONC_ECPS', 'Embedded CPS', 'CONCENTRATION', 'MENG_SYS'),
('CONC_SPACE', 'Space Systems', 'CONCENTRATION', 'MENG_SYS'),
('CONC_SWEN', 'Software Systems', 'CONCENTRATION', 'MENG_SYS');

-- Insert Certificates
INSERT INTO programs (program_id, name, type) VALUES
('CERT_HSDA', 'Healthcare Systems and Data Analytics Certificate', 'CERTIFICATE'),
('CERT_DEVR', 'Data Exploration & Visualization for Risk & Decision-Making', 'CERTIFICATE'),
('CERT_SWEN', 'Software Engineering Certificate', 'CERTIFICATE'),
('CERT_SYS', 'Systems Engineering Certificate', 'CERTIFICATE'),
('CERT_SPACE', 'Space Systems Engineering Certificate', 'CERTIFICATE'),
('CERT_SSE', 'Systems Supportability Engineering Certificate', 'CERTIFICATE'),
('CERT_ECPS', 'Embedded/Cyber-Physical Systems Certificate', 'CERTIFICATE');

-- Add all Program Requirements
INSERT INTO program_requirements (program_id, course_id, requirement_type) VALUES
-- M.Eng. Systems Analytics Requirements
('MSYS_ANALYTICS', 'EM 624', 'Core'),
('MSYS_ANALYTICS', 'EM 622', 'Core'),
('MSYS_ANALYTICS', 'SYS 660', 'Core'),
('MSYS_ANALYTICS', 'EM 623', 'Core Choice'),
('MSYS_ANALYTICS', 'EM 626', 'Core Choice'),
('MSYS_ANALYTICS', 'EM 633', 'Core Choice'),
('MSYS_ANALYTICS', 'SYS 670', 'Core Choice'),
('MSYS_ANALYTICS', 'SYS 682', 'Core Choice'),
('MSYS_ANALYTICS', 'SYS 611', 'Core Choice'),

-- M.Eng. Engineering Management Requirements
('MENG_MGMT', 'EM 600', 'Core'),
('MENG_MGMT', 'EM 605', 'Core'),
('MENG_MGMT', 'EM 624', 'Core'),
('MENG_MGMT', 'SYS 660', 'Core'),
('MENG_MGMT', 'EM 612', 'Core Choice'),
('MENG_MGMT', 'EM 680', 'Core Choice'),
('MENG_MGMT', 'SYS 611', 'Core Choice'),
('MENG_MGMT', 'SYS 681', 'Core Choice'),

-- M.S. Software Engineering Requirements
('MS_SWEN', 'SSW 540', 'Core'),
('MS_SWEN', 'SSW 555', 'Core'),
('MS_SWEN', 'SSW 564', 'Core'),
('MS_SWEN', 'SSW 565', 'Core'),
('MS_SWEN', 'SSW 567', 'Core'),
('MS_SWEN', 'SSW 695', 'Core'),

-- M.Eng. Space Systems Engineering Requirements
('MENG_SPACE', 'SYS 611', 'Core Choice'),
('MENG_SPACE', 'SYS 660', 'Core Choice'),
('MENG_SPACE', 'EM 612', 'Core'),
('MENG_SPACE', 'SYS 625', 'Core Choice'),
('MENG_SPACE', 'SYS 671', 'Core Choice'),
('MENG_SPACE', 'SYS 632', 'Core Choice'),
('MENG_SPACE', 'SYS 635', 'Core Choice'),
('MENG_SPACE', 'SYS 633', 'Core Choice'),
('MENG_SPACE', 'SYS 605', 'Core Choice'),
('MENG_SPACE', 'SYS 637', 'Core'),
('MENG_SPACE', 'SYS 800', 'Project/Thesis'),
('MENG_SPACE', 'SYS 900', 'Project/Thesis'),

-- M.Eng. Systems Engineering Requirements
('MENG_SYS', 'SYS 611', 'Core Choice'),
('MENG_SYS', 'SYS 660', 'Core Choice'),
('MENG_SYS', 'EM 612', 'Core'),
('MENG_SYS', 'SYS 625', 'Core Choice'),
('MENG_SYS', 'SYS 671', 'Core Choice'),
('MENG_SYS', 'SYS 800', 'Project/Thesis'),
('MENG_SYS', 'SYS 900', 'Project/Thesis'),

-- Large-Scale CPS Concentration Requirements
('CONC_LCPS', 'SYS 650', 'Concentration'),
('CONC_LCPS', 'SYS 605', 'Concentration'),
('CONC_LCPS', 'SYS 640', 'Concentration'),
('CONC_LCPS', 'SYS 645', 'Concentration'),

-- Embedded CPS Concentration Requirements
('CONC_ECPS', 'SYS 672', 'Concentration'),
('CONC_ECPS', 'SYS 673', 'Concentration'),
('CONC_ECPS', 'SYS 674', 'Concentration'),

-- Space Systems Concentration Requirements
('CONC_SPACE', 'SYS 632', 'Concentration'),
('CONC_SPACE', 'SYS 635', 'Concentration'),
('CONC_SPACE', 'SYS 633', 'Concentration'),
('CONC_SPACE', 'SYS 605', 'Concentration'),
('CONC_SPACE', 'SYS 637', 'Concentration'),

-- Software Systems Concentration Requirements
('CONC_SWEN', 'SSW 565', 'Concentration'),
('CONC_SWEN', 'SSW 567', 'Concentration'),
('CONC_SWEN', 'SSW 590', 'Concentration'),

-- Certificate Requirements
-- Healthcare Systems and Data Analytics Certificate
('CERT_HSDA', 'EM 624', 'Core'),
('CERT_HSDA', 'EM 633', 'Core'),

-- Data Exploration & Visualization for Risk & Decision-Making Certificate
('CERT_DEVR', 'EM 624', 'Core'),
('CERT_DEVR', 'EM 622', 'Core'),
('CERT_DEVR', 'SYS 660', 'Core'),

-- Software Engineering Certificate
('CERT_SWEN', 'SSW 540', 'Core'),

-- Systems Engineering Certificate
('CERT_SYS', 'SYS 625', 'Core'),
('CERT_SYS', 'SYS 650', 'Core'),

-- Space Systems Engineering Certificate
('CERT_SPACE', 'SYS 632', 'Core'),
('CERT_SPACE', 'SYS 633', 'Core'),
('CERT_SPACE', 'SYS 637', 'Core'),

-- Systems Supportability Engineering Certificate
('CERT_SSE', 'SYS 640', 'Core'),
('CERT_SSE', 'SYS 645', 'Core'),

-- Embedded/Cyber-Physical Systems Certificate
('CERT_ECPS', 'SYS 672', 'Core'),
('CERT_ECPS', 'SYS 673', 'Core'),
('CERT_ECPS', 'SYS 674', 'Core');