-- Seed data for process_steps
-- Run after migration.sql

INSERT INTO public.process_steps (step_number, title, description, sort_order)
VALUES
  (1, 'Design', 'Start in Figma, working through structure and content before any code gets written.', 0),
  (2, 'Build', 'Move into code, using AI-assisted development to build the real thing quickly and carefully.', 1),
  (3, 'Handoff', 'Deliver a working site, not just a file — ready to launch or pass to your team.', 2)
ON CONFLICT DO NOTHING;
