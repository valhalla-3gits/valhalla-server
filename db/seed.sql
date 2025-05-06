-- Ranks

INSERT INTO public."Ranks" (id, token, name, number, value, "targetValue", "createdAt", "updatedAt")
VALUES (0, gen_random_uuid(), 'First', 0, 100, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO public."Ranks" (id, token, name, number, value, "targetValue", "createdAt", "updatedAt")
VALUES (1, gen_random_uuid(), 'Second', 1, 200, 4000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO public."Ranks" (id, token, name, number, value, "targetValue", "createdAt", "updatedAt")
VALUES (2, gen_random_uuid(), 'Third', 2, 400, 8000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO public."Ranks" (id, token, name, number, value, "targetValue", "createdAt", "updatedAt")
VALUES (3, gen_random_uuid(), 'Fourth', 3, 600, 16000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO public."Ranks" (id, token, name, number, value, "targetValue", "createdAt", "updatedAt")
VALUES (4, gen_random_uuid(), 'Fifth', 4, 1000, 32000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO public."Ranks" (id, token, name, number, value, "targetValue", "createdAt", "updatedAt")
VALUES (5, gen_random_uuid(), 'Sixth', 5, 1600, 64000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Statuses

INSERT INTO public."UserStatuses" (id, name, "createdAt", "updatedAt") VALUES (0, 'active', '2025-03-24 12:48:50.114000 +00:00', '2025-03-24 12:48:50.114000 +00:00');
INSERT INTO public."UserStatuses" (id, name, "createdAt", "updatedAt") VALUES (1, 'deleted', '2025-03-24 12:48:50.114000 +00:00', '2025-03-24 12:48:50.114000 +00:00');

-- Lanugages

INSERT INTO public."Languages" (id, token, name, shortName, mainFile, image) VALUES (0, gen_random_uuid(), 'C', 'C', 'main.c', 'clang');
INSERT INTO public."Languages" (id, token, name, shortName, mainFile, image) VALUES (1, gen_random_uuid(), 'Cpp', 'Cpp', 'main.cpp', 'clang');
INSERT INTO public."Languages" (id, token, name, shortName, mainFile, image) VALUES (2, gen_random_uuid(), 'Python', 'Py', 'main.py', 'python');
INSERT INTO public."Languages" (id, token, name, shortName, mainFile, image) VALUES (3, gen_random_uuid(), 'JavaScript', 'JS', 'main.js', 'javascript');
INSERT INTO public."Languages" (id, token, name, shortName, mainFile, image) VALUES (4, gen_random_uuid(), 'TypeScript', 'TS', 'main.ts', 'typescript');
INSERT INTO public."Languages" (id, token, name, shortName, mainFile, image) VALUES (5, gen_random_uuid(), 'Rust', 'Rs', 'main.rs', 'rust');
